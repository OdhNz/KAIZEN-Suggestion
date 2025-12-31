import { defineConfig } from 'vite';
import dns from 'dns'
import laravel from 'laravel-vite-plugin';

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
    ],
});
