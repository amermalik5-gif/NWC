import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/admin/auth/useAuth'
import NwcLogo from '@/assets/nwc-logo-white.svg'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const ok = await login(username, password)
    if (ok) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen nwc-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo above card */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={NwcLogo}
            alt="NWC"
            className="h-20 w-20 rounded-full bg-white/10 p-1 mb-4"
          />
          <h1 className="text-2xl font-bold text-white tracking-wide">Admin Panel</h1>
          <p className="text-sm text-blue-200 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Authorised Personnel Only
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/20 bg-white shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="border-b border-nwc-muted bg-nwc-light px-8 py-5">
            <h2 className="text-base font-semibold text-nwc-navy">Administrator Sign In</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your admin credentials to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="username" className="text-slate-700 text-sm">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  autoFocus
                  required
                  disabled={isLoading}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700 text-sm">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full nwc-gradient hover:opacity-90 text-white font-semibold h-11 transition-opacity"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Admin'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Back to{' '}
              <a href="/login" className="text-nwc-blue underline hover:text-nwc-navy">
                user login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
