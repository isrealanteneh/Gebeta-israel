import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import path from 'path';
import { verify } from "crypto";

export default defineConfig({

    build: {
        outDir: [__dirname, '..', 'backend', 'src', 'views'].join(path.sep),
        rollupOptions: {
            input: {
                index: 'index.html',
                login: 'login.html',
                verify: 'verify.html',
                '404-page': '404-page.html'
                // main: ['src', 'main.ts'].join(path.sep),
                // login: ['src', 'login.ts'].join(path.sep),
                // '404-page': ['src', '404-page.ts'].join(path.sep),
            },
            // output: {
            //     entryFileNames: ['js', '[name].js'].join(path.sep)
            // }

        },
        cssCodeSplit: true
    },
    plugins: [
        // ViteEjsPlugin({
        //     ejs: {
        //         cache: false,
        //         beautify: true,
        //         com
        //     }
        // })
    ]
})