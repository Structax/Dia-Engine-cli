import { AuthCondition } from "../shared/types"
import { authRules } from "./authRegistry.js" // 次で作る

export function evaluateAuthCondition<Input>(
  condition: AuthCondition<Input>,
  user: any,
  input: Input
): boolean {
  if (typeof condition === "string") {
    const rule = authRules[condition]
    if (!rule) throw new Error(`Unknown auth rule: ${condition}`)
    return rule(user, input)
  }

  if (typeof condition === "function") {
    return condition(user, input)
  }

  if (condition.when) {
    const rule = authRules[condition.when]
    if (!rule) throw new Error(`Unknown auth rule: ${condition.when}`)
    return rule(user, input)
  }

  if (condition.and) {
    return condition.and.every((c) => evaluateAuthCondition(c, user, input))
  }

  if (condition.or) {
    return condition.or.some((c) => evaluateAuthCondition(c, user, input))
  }

  if (condition.not) {
    return !evaluateAuthCondition(condition.not, user, input)
  }

  throw new Error("Invalid auth condition")
}