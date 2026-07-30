import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shared input cap. Every tool parses on the main thread, so anything larger
 * than this locks up the tab rather than producing a useful result.
 */
export const MAX_INPUT_BYTES = 5 * 1024 * 1024
export const MAX_INPUT_SIZE_LABEL = "5 MB"

export function isOverSizeLimit(input: string | number): boolean {
  const bytes = typeof input === "number" ? input : new Blob([input]).size
  return bytes > MAX_INPUT_BYTES
}

/**
 * Parse once and return the result alongside the error, so callers never have
 * to validate and then parse the same string a second time.
 */
export function tryParseJson(json: string): { ok: true; value: any } | { ok: false; error: string } {
  if (!json.trim()) return { ok: false, error: "Please enter JSON" }

  try {
    return { ok: true, value: JSON.parse(json) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? `Invalid JSON: ${e.message}` : "Invalid JSON format" }
  }
}

export interface JsonDiff {
  added: Record<string, any>
  removed: Record<string, any>
  modified: Record<string, { from: any; to: any }>
}

export function compareJson(json1: string, json2: string): JsonDiff {
  let obj1: any
  let obj2: any

  try {
    obj1 = JSON.parse(json1)
    obj2 = JSON.parse(json2)
  } catch (e) {
    throw new Error("Invalid JSON provided for comparison")
  }

  const diff: JsonDiff = { added: {}, removed: {}, modified: {} }
  diffValues(obj1, obj2, "", diff)
  return diff
}

function isPlainObject(value: any): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Order-independent, key-order-independent serialization used for equality checks. */
function canonicalize(value: any): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null"
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
    .join(",")}}`
}

function deepEqual(a: any, b: any): boolean {
  return canonicalize(a) === canonicalize(b)
}

/**
 * Compare two arrays as multisets so that reordering the same elements is not
 * reported as a change - only genuinely added or removed elements surface.
 */
function diffArrays(left: any[], right: any[]): { added: any[]; removed: any[] } {
  const remaining = new Map<string, number>()
  for (const item of left) {
    const key = canonicalize(item)
    remaining.set(key, (remaining.get(key) ?? 0) + 1)
  }

  const added: any[] = []
  for (const item of right) {
    const key = canonicalize(item)
    const count = remaining.get(key) ?? 0
    if (count > 0) remaining.set(key, count - 1)
    else added.push(item)
  }

  const removed: any[] = []
  for (const item of left) {
    const key = canonicalize(item)
    const count = remaining.get(key) ?? 0
    if (count > 0) {
      removed.push(item)
      remaining.set(key, count - 1)
    }
  }

  return { added, removed }
}

function diffValues(left: any, right: any, path: string, diff: JsonDiff): void {
  const child = (key: string) => (path ? `${path}.${key}` : key)

  if (isPlainObject(left) && isPlainObject(right)) {
    for (const key of Object.keys(right)) {
      if (!(key in left)) diff.added[child(key)] = right[key]
    }
    for (const key of Object.keys(left)) {
      if (!(key in right)) diff.removed[child(key)] = left[key]
      else diffValues(left[key], right[key], child(key), diff)
    }
    return
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const { added, removed } = diffArrays(left, right)
    // Same elements in a different order counts as unchanged.
    if (added.length) diff.added[path || "(root)"] = added
    if (removed.length) diff.removed[path || "(root)"] = removed
    return
  }

  // Everything else - scalars, and any type change such as object <-> scalar,
  // array <-> object or null <-> value - is a modification.
  if (!deepEqual(left, right)) {
    diff.modified[path || "(root)"] = { from: left, to: right }
  }
}

export function mergeJson(...jsons: string[]): string {
  try {
    const objects = jsons.map((json) => JSON.parse(json))
    const merged = objects.reduce((acc, obj) => deepMerge(acc, obj), {})
    return JSON.stringify(merged, null, 2)
  } catch (e) {
    throw new Error("Invalid JSON provided for merging")
  }
}

function deepMerge(target: any, source: any): any {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key]
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        output[key] = source[key]
      }
    })
  }

  return output
}

function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item)
}