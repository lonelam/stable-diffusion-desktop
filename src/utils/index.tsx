export function isDevelopment() {
    return process.execPath.includes('node_modules');
}
