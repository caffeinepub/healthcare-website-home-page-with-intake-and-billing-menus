import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isHospiceOpen, setIsHospiceOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const billingRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => currentPath === path;
  const isBillingActive = currentPath.includes('/billing');
  const isAccountActive = currentPath.includes('/receivables');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (billingRef.current && !billingRef.current.contains(event.target as Node)) {
        setIsBillingOpen(false);
        setIsHospiceOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHospiceOpen(false);
        setIsBillingOpen(false);
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleBillingClick = () => {
    setIsBillingOpen(!isBillingOpen);
    setIsHospiceOpen(false);
    setIsAccountOpen(false);
  };

  const handleHospiceClick = () => {
    setIsHospiceOpen(!isHospiceOpen);
  };

  const handleAccountClick = () => {
    setIsAccountOpen(!isAccountOpen);
    setIsBillingOpen(false);
    setIsHospiceOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setIsBillingOpen(false);
    setIsHospiceOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img 
            src="/assets/generated/pd-group-logo.dim_256x256.png" 
            alt="PD group Logo" 
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Pinku
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
          
          <div className="relative" ref={billingRef}>
            <button
              onClick={handleBillingClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBillingClick();
                }
              }}
              className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                isBillingActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
              aria-expanded={isBillingOpen}
              aria-haspopup="true"
            >
              Billing
              <ChevronDown className={`h-4 w-4 transition-transform ${isBillingOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBillingOpen && (
              <div 
                className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-popover shadow-lg"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="p-1">
                  <div className="relative">
                    <button
                      onClick={handleHospiceClick}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleHospiceClick();
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                      role="menuitem"
                      aria-expanded={isHospiceOpen}
                      aria-haspopup="true"
                    >
                      <span>Hospice Billing</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isHospiceOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isHospiceOpen && (
                      <div className="ml-2 mt-1 space-y-1 border-l-2 border-border pl-2">
                        <button
                          onClick={() => handleNavigation('/billing/hospice/manifest-loc')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNavigation('/billing/hospice/manifest-loc');
                            }
                          }}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                          role="menuitem"
                        >
                          Manifest LOC Billing
                        </button>
                        <button
                          onClick={() => handleNavigation('/billing/hospice/manifest-rb')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNavigation('/billing/hospice/manifest-rb');
                            }
                          }}
                          className="w-full rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                          role="menuitem"
                        >
                          Manifest R&B Billing
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={accountRef}>
            <button
              onClick={handleAccountClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAccountClick();
                }
              }}
              className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                isAccountActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              }`}
              aria-expanded={isAccountOpen}
              aria-haspopup="true"
            >
              Account
              <ChevronDown className={`h-4 w-4 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAccountOpen && (
              <div 
                className="absolute right-0 top-full mt-1 w-56 rounded-md border border-border bg-popover shadow-lg"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="p-1">
                  <button
                    onClick={() => handleNavigation('/receivables/loc')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigation('/receivables/loc');
                      }
                    }}
                    className="w-full rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    role="menuitem"
                  >
                    LOC Receivables
                  </button>
                  <button
                    onClick={() => handleNavigation('/receivables/rb')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavigation('/receivables/rb');
                      }
                    }}
                    className="w-full rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    role="menuitem"
                  >
                    R&B invoice receivable
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
