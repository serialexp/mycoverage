/* eslint-disable */
import _m0 from "protobufjs/minimal"

export const protobufPackage = ""

export interface Coverage {
  sources: string[]
  lineInfo: LineInformation[]
}

export interface LineInformation {
  type: LineInformation_LineType
  hits: number
  branches: number
  coveredBranches: number
  hitsBySource: HitsBySource[]
  lineNumber: number
}

export enum LineInformation_LineType {
  STATEMENT = 0,
  BRANCH = 1,
  FUNCTION = 2,
  UNRECOGNIZED = -1,
}

export function lineInformation_LineTypeFromJSON(
  object: any,
): LineInformation_LineType {
  switch (object) {
    case 0:
    case "STATEMENT":
      return LineInformation_LineType.STATEMENT
    case 1:
    case "BRANCH":
      return LineInformation_LineType.BRANCH
    case 2:
    case "FUNCTION":
      return LineInformation_LineType.FUNCTION
    case -1:
    case "UNRECOGNIZED":
    default:
      return LineInformation_LineType.UNRECOGNIZED
  }
}

export function lineInformation_LineTypeToJSON(
  object: LineInformation_LineType,
): string {
  switch (object) {
    case LineInformation_LineType.STATEMENT:
      return "STATEMENT"
    case LineInformation_LineType.BRANCH:
      return "BRANCH"
    case LineInformation_LineType.FUNCTION:
      return "FUNCTION"
    case LineInformation_LineType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED"
  }
}

export interface HitsBySource {
  sourceIndex: number
  hits: number[]
}

function createBaseCoverage(): Coverage {
  return { sources: [], lineInfo: [] }
}

export const Coverage = {
  encode(
    message: Coverage,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.sources) {
      writer.uint32(10).string(v!)
    }
    for (const v of message.lineInfo) {
      LineInformation.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Coverage {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCoverage()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.sources.push(reader.string())
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.lineInfo.push(LineInformation.decode(reader, reader.uint32()))
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): Coverage {
    return {
      sources: globalThis.Array.isArray(object?.sources)
        ? object.sources.map((e: any) => globalThis.String(e))
        : [],
      lineInfo: globalThis.Array.isArray(object?.lineInfo)
        ? object.lineInfo.map((e: any) => LineInformation.fromJSON(e))
        : [],
    }
  },

  toJSON(message: Coverage): unknown {
    const obj: any = {}
    if (message.sources?.length) {
      obj.sources = message.sources
    }
    if (message.lineInfo?.length) {
      obj.lineInfo = message.lineInfo.map((e) => LineInformation.toJSON(e))
    }
    return obj
  },

  create<I extends Exact<DeepPartial<Coverage>, I>>(base?: I): Coverage {
    return Coverage.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<Coverage>, I>>(object: I): Coverage {
    const message = createBaseCoverage()
    message.sources = object.sources?.map((e) => e) || []
    message.lineInfo =
      object.lineInfo?.map((e) => LineInformation.fromPartial(e)) || []
    return message
  },
}

function createBaseLineInformation(): LineInformation {
  return {
    type: 0,
    hits: 0,
    branches: 0,
    coveredBranches: 0,
    hitsBySource: [],
    lineNumber: 0,
  }
}

export const LineInformation = {
  encode(
    message: LineInformation,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type)
    }
    if (message.hits !== 0) {
      writer.uint32(16).int32(message.hits)
    }
    if (message.branches !== 0) {
      writer.uint32(24).int32(message.branches)
    }
    if (message.coveredBranches !== 0) {
      writer.uint32(32).int32(message.coveredBranches)
    }
    for (const v of message.hitsBySource) {
      HitsBySource.encode(v!, writer.uint32(42).fork()).ldelim()
    }
    if (message.lineNumber !== 0) {
      writer.uint32(48).int32(message.lineNumber)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LineInformation {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseLineInformation()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.type = reader.int32() as any
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.hits = reader.int32()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.branches = reader.int32()
          continue
        case 4:
          if (tag !== 32) {
            break
          }

          message.coveredBranches = reader.int32()
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.hitsBySource.push(
            HitsBySource.decode(reader, reader.uint32()),
          )
          continue
        case 6:
          if (tag !== 48) {
            break
          }

          message.lineNumber = reader.int32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): LineInformation {
    return {
      type: isSet(object.type)
        ? lineInformation_LineTypeFromJSON(object.type)
        : 0,
      hits: isSet(object.hits) ? globalThis.Number(object.hits) : 0,
      branches: isSet(object.branches) ? globalThis.Number(object.branches) : 0,
      coveredBranches: isSet(object.coveredBranches)
        ? globalThis.Number(object.coveredBranches)
        : 0,
      hitsBySource: globalThis.Array.isArray(object?.hitsBySource)
        ? object.hitsBySource.map((e: any) => HitsBySource.fromJSON(e))
        : [],
      lineNumber: isSet(object.lineNumber)
        ? globalThis.Number(object.lineNumber)
        : 0,
    }
  },

  toJSON(message: LineInformation): unknown {
    const obj: any = {}
    if (message.type !== 0) {
      obj.type = lineInformation_LineTypeToJSON(message.type)
    }
    if (message.hits !== 0) {
      obj.hits = Math.round(message.hits)
    }
    if (message.branches !== 0) {
      obj.branches = Math.round(message.branches)
    }
    if (message.coveredBranches !== 0) {
      obj.coveredBranches = Math.round(message.coveredBranches)
    }
    if (message.hitsBySource?.length) {
      obj.hitsBySource = message.hitsBySource.map((e) => HitsBySource.toJSON(e))
    }
    if (message.lineNumber !== 0) {
      obj.lineNumber = Math.round(message.lineNumber)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<LineInformation>, I>>(
    base?: I,
  ): LineInformation {
    return LineInformation.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<LineInformation>, I>>(
    object: I,
  ): LineInformation {
    const message = createBaseLineInformation()
    message.type = object.type ?? 0
    message.hits = object.hits ?? 0
    message.branches = object.branches ?? 0
    message.coveredBranches = object.coveredBranches ?? 0
    message.hitsBySource =
      object.hitsBySource?.map((e) => HitsBySource.fromPartial(e)) || []
    message.lineNumber = object.lineNumber ?? 0
    return message
  },
}

function createBaseHitsBySource(): HitsBySource {
  return { sourceIndex: 0, hits: [] }
}

export const HitsBySource = {
  encode(
    message: HitsBySource,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.sourceIndex !== 0) {
      writer.uint32(8).int32(message.sourceIndex)
    }
    writer.uint32(18).fork()
    for (const v of message.hits) {
      writer.int32(v)
    }
    writer.ldelim()
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HitsBySource {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHitsBySource()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.sourceIndex = reader.int32()
          continue
        case 2:
          if (tag === 16) {
            message.hits.push(reader.int32())

            continue
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos
            while (reader.pos < end2) {
              message.hits.push(reader.int32())
            }

            continue
          }

          break
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): HitsBySource {
    return {
      sourceIndex: isSet(object.sourceIndex)
        ? globalThis.Number(object.sourceIndex)
        : 0,
      hits: globalThis.Array.isArray(object?.hits)
        ? object.hits.map((e: any) => globalThis.Number(e))
        : [],
    }
  },

  toJSON(message: HitsBySource): unknown {
    const obj: any = {}
    if (message.sourceIndex !== 0) {
      obj.sourceIndex = Math.round(message.sourceIndex)
    }
    if (message.hits?.length) {
      obj.hits = message.hits.map((e) => Math.round(e))
    }
    return obj
  },

  create<I extends Exact<DeepPartial<HitsBySource>, I>>(
    base?: I,
  ): HitsBySource {
    return HitsBySource.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<HitsBySource>, I>>(
    object: I,
  ): HitsBySource {
    const message = createBaseHitsBySource()
    message.sourceIndex = object.sourceIndex ?? 0
    message.hits = object.hits?.map((e) => e) || []
    return message
  },
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never
    }

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
