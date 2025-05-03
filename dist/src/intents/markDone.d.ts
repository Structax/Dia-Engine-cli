import { z } from "zod";
export declare const markDone: {
    id: string;
    input: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    require: string;
    effect: (_ctx: any, input: {
        id: any;
    }) => Promise<{
        __dia_emit_marker: true;
        type: string;
        payload: {
            id: any;
        };
    }>;
};
//# sourceMappingURL=markDone.d.ts.map