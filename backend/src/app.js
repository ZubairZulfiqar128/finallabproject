import './config/loadEnv.js'
import express from 'express'
import cors from 'cors'
import connectDB, { getDbStatus } from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

const isProduction = process.env.NODE_ENV === 'production'

app.use(
  cors(
    isProduction
      ? {
          origin(origin, callback) {
            if (!origin) return callback(null, true)
            const allowed =
              /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
              /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin) ||
              (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
            callback(null, allowed)
          },
          credentials: true,
        }
      : {}
  )
)
app.use(express.json())

// Ensure MongoDB is connected before API routes (serverless-safe)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB()
    } catch (err) {
      return next(err)
    }
  }
  next()
})

app.get('/api/health', async (_req, res) => {
  try {
    await connectDB()
    res.json({
      status: 'ok',
      service: 'Maison Chronos API',
      database: getDbStatus(),
    })
  } catch (err) {
    res.status(503).json({
      status: 'error',
      service: 'Maison Chronos API',
      message: err.message,
      database: getDbStatus(),
    })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/contact', contactRoutes)

app.use(errorHandler)

export default app
