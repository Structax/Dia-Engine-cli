export function emit<T>(type: string, payload: T): {
    __dia_emit_marker: true
    type: string
    payload: T
  } {
    return {
      __dia_emit_marker: true,
      type,
      payload
    }
  }