import { registerAuthRule } from "./authRegistry.js"

export function registerBuiltInAuthRules() {
  registerAuthRule("user:authenticated", (user) => !!user)
}