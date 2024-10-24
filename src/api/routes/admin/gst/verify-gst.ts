// src/api/routes/admin/gst/verify-gst.ts
import {
  MedusaRequest,
  MedusaResponse
} from "@medusajs/medusa"
import { Router } from "express"
import { ConfigModule } from "@medusajs/medusa"

export const GSTRouter: Router = Router()

export type GSTVerificationResponse = {
  success: boolean
  data?: any
  error?: string
}

type GSTVerifyRequestBody = {
  gstNumber: string
}

// Middleware to check if GST number is provided
const validateGSTNumber = async (
  req: MedusaRequest<GSTVerifyRequestBody>,
  res: MedusaResponse,
  next: Function
) => {
  const { gstNumber } = req.body

  if (!gstNumber) {
    return res.status(400).json({
      success: false,
      error: "GST number is required"
    })
  }

  next()
}

GSTRouter.post(
  "/verify",
  validateGSTNumber,
  async (
    req: MedusaRequest<GSTVerifyRequestBody>,
    res: MedusaResponse
  ) => {
    const gstService = req.scope.resolve("gstVerificationService")

    try {
      const { gstNumber } = req.body
      const result = await gstService.verifyGST(gstNumber)

      if (!result.success) {
        return res.status(400).json(result)
      }

      res.json(result)
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "An error occurred while verifying GST number"
      })
    }
  }
)

export default GSTRouter