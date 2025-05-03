// ✅ ファイル: src/testUtils.ts

import { DiaContext, DomainEvent } from "../shared/types"
import { DiaIntent, runIntent } from "./runIntent"

export function mockContext(overrides: Partial<DiaContext> = {}): DiaContext {
  return {
    user: { id: "u1", roles: ["user"], tenantId: "t1" },
    session: { expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    signal: new AbortController().signal,
    traceId: "test-trace-id",
    services: {},
    ...overrides
  }
}

export async function runIntentTest<I, O>(
  intent: DiaIntent<I, O>,
  input: I,
  ctx: DiaContext = mockContext()
): Promise<{
  result: O
  emits: DomainEvent[]
}> {
  return await runIntent(intent, ctx, input)
}
