import { AuthPredicate } from "../shared/types"
// Removed import as registerAuthRule is defined locally
let authRules: Record<string, Function> = {}

// Register the rule using the locally defined registerAuthRule function
registerAuthRule("user:authenticated", (user: { id: string; name: string } | null) => {
  return !!user
})

export function registerAuthRule(name: string, fn: Function) {
  authRules[name] = fn
}

export function getAuthRules() {
  return authRules
}


export function clearAuthRules() {
  Object.keys(authRules).forEach((k) => delete authRules[k])
}
registerAuthRule("user:authenticated", (user: { id: string; name: string } | null): boolean => {
  return !!user
})