import { markDone } from "./intents/markDone.js";
export const intentMap = {
    "task.mark_done": markDone
};
export function getIntentById(id) {
    const found = intentMap[id];
    if (!found)
        throw new Error(`Intent not found: ${id}`);
    return found;
}
