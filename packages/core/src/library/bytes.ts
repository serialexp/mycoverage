/**
 * Helpers for working with Prisma 7 `Bytes` values.
 *
 * Under Prisma 7 (with the TS 5.7+ typed-array generics), `Bytes` columns are
 * typed as `Uint8Array<ArrayBuffer>` rather than Node's `Buffer`. A plain
 * `Buffer.from(...)` yields `Buffer<ArrayBufferLike>`, which is NOT assignable
 * to that type, and `Uint8Array.prototype.toString("base64")` does not exist
 * (it ignores the radix and joins with commas). These helpers bridge the gap.
 */

/** Normalise any byte-ish input into the exact `Uint8Array<ArrayBuffer>` Prisma expects. */
export function toBytes(
  input: Uint8Array | ArrayLike<number>,
): Uint8Array<ArrayBuffer> {
  const src = input instanceof Uint8Array ? input : Uint8Array.from(input)
  const out = new Uint8Array(src.byteLength)
  out.set(src)
  return out
}

/** Base64-encode a byte array (works for both `Buffer` and `Uint8Array`). */
export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64")
}

/** Decode a base64 string into the `Uint8Array<ArrayBuffer>` Prisma expects. */
export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  return toBytes(Buffer.from(base64, "base64"))
}
