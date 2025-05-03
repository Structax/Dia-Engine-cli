import { DomainEvent, DiaIntent } from "../shared/types";
import { DiaContext } from "../shared/types";
export declare function runIntent<I, O>(intent: DiaIntent<I, O>, ctx: DiaContext, input: I): Promise<{
    result: O;
    emits: DomainEvent[];
}>;
export { DiaIntent };
//# sourceMappingURL=runIntent.d.ts.map