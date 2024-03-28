// noinspection DuplicatedCode
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
export function die(message) {
    console.error(message);
    process.exit(1);
}
export function expandTilde(filePath) {
    if (filePath.startsWith('~')) {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}
export function readSuperHavenConfig() {
    var superMavenHome = expandTilde('~/.supermaven');
    var configPath = path.join(superMavenHome, 'superhaven.config.json');
    if (!fs.existsSync(configPath)) {
        var message = "superhaven.config.json not found at ".concat(configPath);
        die(message);
    }
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    catch (e) {
        die("Error reading superhaven.config.json: ".concat(e));
    }
}
var config = readSuperHavenConfig();
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.SUPER_HAVEN_AUTH_TOKEN': JSON.stringify(config.authToken)
    }
});
