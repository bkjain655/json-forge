import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidJson(json: string): boolean {
  if (!json.trim()) return false

  try {
    JSON.parse(json)
    return true
  } catch (e) {
    return false
  }
}

export function formatJson(json: string, spaces = 2): string {
  if (!json.trim()) return ""

  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, spaces)
  } catch (e) {
    return json
  }
}

export function minifyJson(json: string): string {
  if (!json.trim()) return ""

  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch (e) {
    return json
  }
}

export function compareJson(json1: string, json2: string): { added: any; removed: any; modified: any } {
  try {
    const obj1 = JSON.parse(json1)
    const obj2 = JSON.parse(json2)

    return {
      added: findAdded(obj1, obj2),
      removed: findAdded(obj2, obj1), // Reversed to find removed
      modified: findModified(obj1, obj2),
    }
  } catch (e) {
    throw new Error("Invalid JSON provided for comparison")
  }
}

function findAdded(obj1: any, obj2: any, path = ""): any {
  const result: any = {}

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return {}
  }

  for (const key in obj1) {
    const currentPath = path ? `${path}.${key}` : key

    if (!(key in obj2)) {
      result[currentPath] = obj1[key]
    } else if (
      typeof obj1[key] === "object" &&
      obj1[key] !== null &&
      typeof obj2[key] === "object" &&
      obj2[key] !== null
    ) {
      const nestedAdded = findAdded(obj1[key], obj2[key], currentPath)
      Object.assign(result, nestedAdded)
    }
  }

  return result
}

function findModified(obj1: any, obj2: any, path = ""): any {
  const result: any = {}

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return {}
  }

  for (const key in obj1) {
    const currentPath = path ? `${path}.${key}` : key

    if (key in obj2) {
      if (typeof obj1[key] !== "object" || obj1[key] === null || typeof obj2[key] !== "object" || obj2[key] === null) {
        if (obj1[key] !== obj2[key]) {
          result[currentPath] = { from: obj1[key], to: obj2[key] }
        }
      } else {
        const nestedModified = findModified(obj1[key], obj2[key], currentPath)
        Object.assign(result, nestedModified)
      }
    }
  }

  return result
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