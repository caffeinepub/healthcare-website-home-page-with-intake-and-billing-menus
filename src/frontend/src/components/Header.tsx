import { Link, useRouterState } from '@tanstack/react-router';

export default function Header() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src="/assets/generated/healthcare-logo.dim_256x256.png" 
            alt="Healthcare Logo" 
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            HealthCare
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/intake"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive('/intake')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Intake
          </Link>
          <Link
            to="/billing"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
              isActive('/billing')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Billing
          </Link>
        </nav>
      </div>
    </header>
  );
}
