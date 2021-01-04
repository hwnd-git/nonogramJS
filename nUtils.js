export function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
}