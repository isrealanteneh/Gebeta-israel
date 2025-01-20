import { defineConfig } from "vite";
import path from 'path';
import fs from 'fs';

// Function to get all HTML files in the frontend directory
function getHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    const htmlFiles = {};
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const name = path.basename(file, '.html');
            htmlFiles[name] = path.resolve(dir, file);
        }
    });
    return htmlFiles;
}

export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, '..', 'backend', 'views'),
        rollupOptions: {
            input: getHtmlFiles(path.resolve(__dirname)),
            output: {
                entryFileNames: 'assets/js/[name].js',
                chunkFileNames: 'assets/js/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        },
        cssCodeSplit: true
    }
});