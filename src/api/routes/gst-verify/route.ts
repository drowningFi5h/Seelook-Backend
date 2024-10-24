import { Router } from "express"
import axios from "axios"

export default (router: Router) => {
  // Validate environment variables
  const SETU_CLIENT_ID = process.env.SETU_CLIENT_ID
  const SETU_CLIENT_SECRET = process.env.SETU_CLIENT_SECRET
  const SETU_PRODUCT_INSTANCE_ID = process.env.SETU_PRODUCT_INSTANCE_ID

  if (!SETU_CLIENT_ID || !SETU_CLIENT_SECRET || !SETU_PRODUCT_INSTANCE_ID) {
    console.error("Missing required Setu API credentials in environment variables")
  }

  router.post("/admin/gst/verify", async (req, res) => {
    try {
      const { gstin } = req.body

      if (!gstin) {
        return res.status(400).json({
          message: "GST number is required"
        })
      }

      const response = await axios({
        method: 'post',
        url: 'https://dg-sandbox.setu.co/api/verify/gst',
        headers: {
          'x-client-id': SETU_CLIENT_ID,
          'x-client-secret': SETU_CLIENT_SECRET,
          'x-product-instance-id': SETU_PRODUCT_INSTANCE_ID,
        },
        data: {
          gstNumber: gstin
        }
      })

      return res.status(200).json({
        success: true,
        data: response.data
      })

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          success: false,
          message: error.response?.data?.message || "GST verification failed",
          error: error.response?.data
        })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error"
      })
    }
  })

  return router
}