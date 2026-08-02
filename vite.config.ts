import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom Vite plugin to forward browser & API logs directly to the Node.js Terminal Console
function terminalLoggerPlugin(): Plugin {
  return {
    name: 'vite-plugin-terminal-logger',
    configureServer(server) {
      server.middlewares.use('/__terminal_log', (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const logData = JSON.parse(body || '{}');
            const { type, method, url, status, message, data, details } = logData;

            const timestamp = new Date().toLocaleTimeString();

            if (type === 'API_ERROR' || type === 'ERROR') {
              console.error(
                `\x1b[31m[TERMINAL ERROR ${timestamp}]\x1b[0m ${method || ''} ${url || ''} ` +
                `Status: \x1b[33m${status || 'ERR'}\x1b[0m\nMessage: ${message || ''}` +
                (details ? `\nDetails: ${JSON.stringify(details, null, 2)}` : '')
              );
            } else if (type === 'API_RESPONSE') {
              console.log(
                `\x1b[32m[API RESP ${timestamp}]\x1b[0m ${method || 'GET'} ${url || ''} ` +
                `-> Status: \x1b[36m${status}\x1b[0m` +
                (data ? `\nPayload: ${JSON.stringify(data).slice(0, 300)}` : '')
              );
            } else {
              console.log(
                `\x1b[35m[CLIENT LOG ${timestamp}]\x1b[0m ${message || JSON.stringify(logData)}`
              );
            }
          } catch (e) {
            console.log('\x1b[33m[TERMINAL LOG]\x1b[0m', body);
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), terminalLoggerPlugin()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://backend.zalameh.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
