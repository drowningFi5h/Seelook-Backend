// src/api/index.ts
import { Router } from "express"
import { ConfigModule } from "@medusajs/medusa"
import { GSTRouter } from "./routes/admin/gst/verify-gst"

export default (app: Router, container: ConfigModule, config: Record<string, unknown>): Router => {
  app.use("/admin/gst", GSTRouter)
  return app
}