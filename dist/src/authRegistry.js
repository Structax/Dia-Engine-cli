// Removed import as registerAuthRule is defined locally
let authRules = {};
// Register the rule using the locally defined registerAuthRule function
registerAuthRule("user:authenticated", (user) => {
    return !!user;
});
export function registerAuthRule(name, fn) {
    authRules[name] = fn;
}
export function getAuthRules() {
    return authRules;
}
export function clearAuthRules() {
    Object.keys(authRules).forEach((k) => delete authRules[k]);
}
registerAuthRule("user:authenticated", (user) => {
    return !!user;
});
