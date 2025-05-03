import { markDone } from "./intents/markDone.js";
type IntentMap = {
    "task.mark_done": typeof markDone;
};
export declare const intentMap: IntentMap;
export declare function getIntentById(id: string): (typeof intentMap)[keyof typeof intentMap];
export {};
//# sourceMappingURL=intentMap.d.ts.map