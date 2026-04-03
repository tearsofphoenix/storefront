// @ts-nocheck
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
    projectConfig: {
        // ...
        databaseDriverOptions: {
            ssl: false,
            sslmode: "disable",
        },
    },
    admin: {
        vite: (config: any) => {
            return {
                server: {
                    host: "0.0.0.0",
                    // Allow all hosts when running in Docker (development mode)
                    // In production, this should be more restrictive
                    allowedHosts: [
                        "localhost",
                        ".localhost",
                        "127.0.0.1",
                    ],
                    hmr: {
                        // HMR websocket port inside container
                        port: 5173,
                        // Port browser connects to (exposed in docker-compose.yml)
                        clientPort: 5173,
                    },
                },
            }
        },
    }
})
