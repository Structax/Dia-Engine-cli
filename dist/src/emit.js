export function emit(type, payload) {
    return {
        __dia_emit_marker: true,
        type,
        payload
    };
}
