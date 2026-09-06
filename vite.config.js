import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
    define: {
        __LLMVISION_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                "llmvision-card": "src/llmvision-card.js",
                "llmvision-preview-card": "src/llmvision-preview-card.js",
                "llmvision-horizontal-card": "src/llmvision-horizontal-card.js",
            },
            output: {
                entryFileNames: "[name].js",
                format: "es",
            },
        },
    },
});