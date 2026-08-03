import { describe, it, expect } from "vitest"
import { tryParseJson, isOverSizeLimit, compareJson, mergeJson, MAX_INPUT_BYTES } from "./utils"

describe("tryParseJson", () => {
  it("parses a valid object", () => {
    const result = tryParseJson('{"a":1}')
    expect(result).toEqual({ ok: true, value: { a: 1 } })
  })

  it("parses a valid array and primitives", () => {
    expect(tryParseJson("[1,2,3]")).toEqual({ ok: true, value: [1, 2, 3] })
    expect(tryParseJson("true")).toEqual({ ok: true, value: true })
    expect(tryParseJson("42")).toEqual({ ok: true, value: 42 })
  })

  it("rejects empty or whitespace input", () => {
    expect(tryParseJson("")).toEqual({ ok: false, error: "Please enter JSON" })
    expect(tryParseJson("   \n ")).toEqual({ ok: false, error: "Please enter JSON" })
  })

  it("rejects malformed JSON with a descriptive error", () => {
    const result = tryParseJson('{"a":}')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/Invalid JSON/)
  })

  it("rejects a trailing comma (not valid JSON)", () => {
    expect(tryParseJson('{"a":1,}').ok).toBe(false)
  })
})

describe("isOverSizeLimit", () => {
  it("returns false for small strings", () => {
    expect(isOverSizeLimit('{"a":1}')).toBe(false)
  })

  it("accepts a numeric byte count", () => {
    expect(isOverSizeLimit(MAX_INPUT_BYTES)).toBe(false)
    expect(isOverSizeLimit(MAX_INPUT_BYTES + 1)).toBe(true)
  })

  it("flags a string just over the limit", () => {
    expect(isOverSizeLimit("x".repeat(MAX_INPUT_BYTES + 1))).toBe(true)
  })
})

describe("compareJson", () => {
  it("reports added, removed and modified keys", () => {
    const diff = compareJson('{"keep":1,"drop":2,"change":3}', '{"keep":1,"change":4,"new":5}')
    expect(diff.added).toEqual({ new: 5 })
    expect(diff.removed).toEqual({ drop: 2 })
    expect(diff.modified).toEqual({ change: { from: 3, to: 4 } })
  })

  it("uses dotted paths for nested changes", () => {
    const diff = compareJson('{"a":{"b":1}}', '{"a":{"b":2}}')
    expect(diff.modified).toEqual({ "a.b": { from: 1, to: 2 } })
  })

  it("treats identical documents as no change", () => {
    const diff = compareJson('{"a":[1,2],"b":{"c":3}}', '{"a":[1,2],"b":{"c":3}}')
    expect(diff.added).toEqual({})
    expect(diff.removed).toEqual({})
    expect(diff.modified).toEqual({})
  })

  it("ignores array reordering (multiset comparison)", () => {
    const diff = compareJson('{"list":[1,2,3]}', '{"list":[3,2,1]}')
    expect(diff.added).toEqual({})
    expect(diff.removed).toEqual({})
    expect(diff.modified).toEqual({})
  })

  it("detects genuinely added and removed array elements", () => {
    const diff = compareJson('{"list":[1,2]}', '{"list":[2,3]}')
    expect(diff.added).toEqual({ list: [3] })
    expect(diff.removed).toEqual({ list: [1] })
  })

  it("reports a type change as a modification", () => {
    const diff = compareJson('{"a":1}', '{"a":"1"}')
    expect(diff.modified).toEqual({ a: { from: 1, to: "1" } })
  })

  it("throws on invalid JSON", () => {
    expect(() => compareJson("{", "{}")).toThrow(/Invalid JSON/)
  })
})

describe("mergeJson", () => {
  it("merges flat objects with later keys winning", () => {
    expect(JSON.parse(mergeJson('{"a":1,"b":2}', '{"b":3,"c":4}'))).toEqual({ a: 1, b: 3, c: 4 })
  })

  it("deep-merges nested objects instead of replacing them", () => {
    const merged = JSON.parse(mergeJson('{"a":{"x":1}}', '{"a":{"y":2}}'))
    expect(merged).toEqual({ a: { x: 1, y: 2 } })
  })

  it("replaces arrays rather than concatenating", () => {
    const merged = JSON.parse(mergeJson('{"list":[1,2]}', '{"list":[3]}'))
    expect(merged).toEqual({ list: [3] })
  })

  it("merges more than two objects in order", () => {
    const merged = JSON.parse(mergeJson('{"a":1}', '{"b":2}', '{"a":9}'))
    expect(merged).toEqual({ a: 9, b: 2 })
  })

  it("throws on invalid JSON", () => {
    expect(() => mergeJson('{"a":1}', "not json")).toThrow(/Invalid JSON/)
  })
})
