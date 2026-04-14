import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-slate-200">404</h1>
      <p className="text-slate-500">Page not found</p>
      <Button asChild>
        <Link to={ROUTES.DASHBOARD}>Back to Dashboard</Link>
      </Button>
    </div>
  )
}
