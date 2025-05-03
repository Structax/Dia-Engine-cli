import { AuthCondition } from "../shared/types"
import { getAuthRules } from "./authRegistry"

export function evaluateAuthCondition<Input>(
  condition: AuthCondition<Input>,
  user: any,
  input: Input
): boolean {
  const rules = getAuthRules()
  if (typeof condition === "string") {
    
    if (!rules) throw new Error(`Unknown auth rule: ${condition}`)
    const rule = rules[condition];
    if (!rule) throw new Error(`Unknown auth rule: ${condition}`);
    return rule(user, input);
  }

  if (typeof condition === "function") {
    return condition(user, input)
  }

  if (condition.when) {
    const rules = getAuthRules();
    const rule = rules[condition.when];
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