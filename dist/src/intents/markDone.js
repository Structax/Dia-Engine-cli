import { z } from "zod";
import { emit } from "../emit.js"; // 新規追加
export const markDone = {
    id: "task.mark_done",
    input: z.object({ id: z.string() }),
    require: "user:authenticated",
    effect: async (_ctx, input) => {
        return emit("task.done", { id: input.id });
    }
};
