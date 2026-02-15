import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IntakeRedirect from './pages/IntakeRedirect';
import Billing from './pages/Billing';
import HospiceBilling from './pages/HospiceBilling';
import ManifestLocBilling from './pages/ManifestLocBilling';
import ManifestRbBilling from './pages/ManifestRbBilling';
import LocInvoiceReceivable from './pages/LocInvoiceReceivable';
import RbInvoiceReceivable from './pages/RbInvoiceReceivable';
import Ub04Form from './pages/Ub04Form';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Layout component with Header and Footer
function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Root route with layout and Outlet
const rootRoute = createRootRoute({
  component: Layout,
});

// Define all routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const intakeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intake',
  component: IntakeRedirect,
});

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: Billing,
});

const hospiceBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing/hospice',
  component: HospiceBilling,
});

const manifestLocBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing/hospice/manifest-loc',
  component: ManifestLocBilling,
});

const manifestRbBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing/hospice/manifest-rb',
  component: ManifestRbBilling,
});

const locInvoiceReceivableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receivables/loc',
  component: LocInvoiceReceivable,
});

const rbInvoiceReceivableRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receivables/rb',
  component: RbInvoiceReceivable,
});

const ub04FormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ub04-form',
  component: Ub04Form,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  intakeRoute,
  billingRoute,
  hospiceBillingRoute,
  manifestLocBillingRoute,
  manifestRbBillingRoute,
  locInvoiceReceivableRoute,
  rbInvoiceReceivableRoute,
  ub04FormRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
