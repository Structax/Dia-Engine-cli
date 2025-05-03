// ✅ ファイル: src/testUtils.ts
import { runIntent } from "./runIntent";
export function mockContext(overrides = {}) {
    return {
        user: { id: "u1", roles: ["user"], tenantId: "t1" },
        session: { expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
        signal: new AbortController().signal,
        traceId: "test-trace-id",
        services: {},
        ...overrides
    };
}
export async function runIntentTest(intent, input, ctx = mockContext()) {
    return await runIntent(intent, ctx, input);
}
