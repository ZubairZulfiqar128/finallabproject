/**
 * Local development entry only — not used on Vercel.
 * Production deploys backend/src/app.js as a serverless function via vercel.json.
 */
import './config/loadEnv.js'
import app from './app.js'
import connectDB, { getDbStatus } from './config/db.js'

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  const db = getDbStatus()
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`)
    console.log(`MongoDB: ${db.state} (${db.database ?? 'n/a'})`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
