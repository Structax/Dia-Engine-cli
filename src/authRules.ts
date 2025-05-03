import { registerAuthRule } from "./authRegistry.js"

export function registerBuiltInAuthRules() {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  type AuthRule = (user: User | null) => boolean;

  registerAuthRule("user:authenticated", (user: User | null): boolean => !!user);
}