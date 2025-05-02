import DiaContext, { DiaIntent, DomainEvent } from "../shared/types.js";
import { runEffect } from "./runEffect.js";
import { evaluateAuthCondition } from "./auth.js";
import { z } from "zod";

export async function runIntent<I, O>(
  intent: DiaIntent<I, O>,
  ctx: DiaContext,
  input: I
): Promise<{ result: O; emits: DomainEvent[] }> {
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
  const rawResult = await runEffect(
    `intent.${intent.id}`,
    async (ctx) => intent.effect(ctx, parsed.data),
    ctx
  ) as unknown;

  // ✅ Step 4: Extract emits and result
  const emits = extractEmits(rawResult as Partial<DomainEvent> & { emit?: DomainEvent | DomainEvent[]; __dia_emit_marker?: boolean }, ctx);
  const result = extractResult<O>(rawResult);

  debugLogs(rawResult, emits);

  return { result, emits };
}

function extractEmits(
  result: Partial<DomainEvent> & { emit?: DomainEvent | DomainEvent[]; __dia_emit_marker?: boolean },
  ctx: DiaContext
): DomainEvent[] {
  if (!result) return []

  // ✅ emit() ヘルパーで返された構造
  if (result.__dia_emit_marker) {
    return [{
      type: result.type!,
      payload: result.payload!,
      emittedAt: new Date().toISOString(),
      traceId: ctx.traceId
    }]
  }

  // ✅ { emit } スタイル
  if ("emit" in result && result.emit) {
    const e = result.emit
    return Array.isArray(e)
      ? e.map(ev => fillMeta(ev, ctx))
      : [fillMeta(e, ctx)]
  }

  // ✅ 直接 DomainEvent 構造
  if ("type" in result && "payload" in result) {
    return [fillMeta(result as DomainEvent<any>, ctx)]
  }

  return []
}

function fillMeta<T>(e: DomainEvent<T>, ctx: DiaContext): DomainEvent<T> {
  return {
    ...e,
    emittedAt: e.emittedAt || new Date().toISOString(),
    traceId: e.traceId || ctx.traceId,
  };
}

function extractResult<T>(result: any): T {
  // emit only intent: return {} when it's clearly a marker
  if (result?.__dia_emit_marker) return {} as T
  if ('emit' in result) {
    const copy = { ...result }
    delete copy.emit
    return copy as T
  }
  return result as T
}
function debugLogs(rawResult: unknown, emits: DomainEvent[]): void {
  console.log("[debug] rawResult:", rawResult);
  console.log("[debug] emits:", emits);
}

export { DiaIntent };
