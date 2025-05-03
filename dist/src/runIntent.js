import { DiaIntent } from "../shared/types";
import { runEffect } from "./runEffect.js";
import { evaluateAuthCondition } from "./auth.js";
export async function runIntent(intent, ctx, input) {
    // ✅ Step 1: Validate input
    const parsed = intent.input.safeParse(input);
    if (!parsed.success) {
        throw new Error(`Invalid input: ${JSON.stringify(parsed.error.format())}`);
    }
    // ✅ Step 2: Authorization check
    if (intent.require) {
        const isAuthorized = evaluateAuthCondition(intent.require, ctx.user, parsed.data);
        if (!isAuthorized) {
            throw new Error(`Forbidden: require check failed`);
        }
    }
    // ✅ Step 3: Execute effect
    const rawResult = await runEffect(`intent.${intent.id}`, async (ctx) => intent.effect(ctx, parsed.data), ctx);
    // ✅ Step 4: Extract emits and result
    const emits = extractEmits(rawResult, ctx);
    const result = extractResult(rawResult);
    debugLogs(rawResult, emits);
    return { result, emits };
}
function extractEmits(result, ctx) {
    if (!result)
        return [];
    // ✅ emit() ヘルパーで返された構造
    if (result.__dia_emit_marker) {
        return [{
                type: result.type,
                payload: result.payload,
                emittedAt: new Date().toISOString(),
                traceId: ctx.traceId
            }];
    }
    // ✅ { emit } スタイル
    if ("emit" in result && result.emit) {
        const e = result.emit;
        return Array.isArray(e)
            ? e.map(ev => fillMeta(ev, ctx))
            : [fillMeta(e, ctx)];
    }
    // ✅ 直接 DomainEvent 構造
    if ("type" in result && "payload" in result) {
        return [fillMeta(result, ctx)];
    }
    return [];
}
function fillMeta(e, ctx) {
    return {
        ...e,
        emittedAt: e.emittedAt || new Date().toISOString(),
        traceId: e.traceId || ctx.traceId,
    };
}
function extractResult(result) {
    // emit only intent: return {} when it's clearly a marker
    if (result?.__dia_emit_marker)
        return {};
    if ('emit' in result) {
        const copy = { ...result };
        delete copy.emit;
        return copy;
    }
    return result;
}
function debugLogs(rawResult, emits) {
    console.log("[debug] rawResult:", rawResult);
    console.log("[debug] emits:", emits);
}
export { DiaIntent };
