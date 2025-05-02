import { markDone } from "./intents/markDone.js"

// Explicitly define the type for intentMap
type IntentMap = {
  "task.mark_done": typeof markDone
}

export const intentMap: IntentMap = {
  "task.mark_done": markDone
}

export function getIntentById(id: string): (typeof intentMap)[keyof typeof intentMap] {
  const found = intentMap[id as keyof typeof intentMap]
  if (!found) throw new Error(`Intent not found: ${id}`)
  return found
}