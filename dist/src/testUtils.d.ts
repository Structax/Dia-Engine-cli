import { DiaContext, DomainEvent } from "../shared/types";
import { DiaIntent } from "./runIntent";
export declare function mockContext(overrides?: Partial<DiaContext>): DiaContext;
export declare function runIntentTest<I, O>(intent: DiaIntent<I, O>, input: I, ctx?: DiaContext): Promise<{
    result: O;
    emits: DomainEvent[];
}>;
//# sourceMappingURL=testUtils.d.ts.map