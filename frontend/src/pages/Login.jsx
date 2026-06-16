import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Login page — authenticates via JWT API (MongoDB users collection).
 * Guest cart items merge into the server cart on success.
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { getGuestItems, clearGuestCart, items } = useCart()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/'
  const guestCount = items.reduce((sum, line) => sum + line.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setSubmitting(true)

    try {
      const guestItems = getGuestItems()
      await login({ email: email.trim(), password, guestItems })
      clearGuestCart()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-aside" aria-hidden="true">
        <p className="eyebrow">Maison Chronos</p>
        <h2 className="auth-aside-title">Welcome back</h2>
        <p className="auth-aside-text">
          Sign in to sync your cart across devices. Your selections are stored securely
          in MongoDB Atlas.
        </p>
        <ul className="auth-features">
          <li>Persistent cart saved to your account</li>
          <li>Concierge contact history</li>
          <li>Exclusive collection access</li>
        </ul>
      </aside>

      <div className="auth-card">
        <header className="auth-card-header">
          <h1 className="page-title">Sign in</h1>
          <p className="page-intro">
            Access your saved cart and concierge account.
            {guestCount > 0 ? (
              <span className="auth-guest-note">
                {' '}
                {guestCount} guest item{guestCount !== 1 ? 's' : ''} will merge on sign-in.
              </span>
            ) : null}
          </p>
        </header>

        <form className="contact-form auth-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="field-error auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <div className="input-password-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm input-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
          <p className="auth-switch">
            Need help? <Link to="/contact">Contact concierge</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
