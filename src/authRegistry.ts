import { AuthPredicate } from "../shared/types"

export const authRules: Record<string, AuthPredicate> = {}

export function registerAuthRule(id: string, rule: AuthPredicate) {
  authRules[id] = rule
}

export function clearAuthRules() {
  Object.keys(authRules).forEach((k) => delete authRules[k])
}