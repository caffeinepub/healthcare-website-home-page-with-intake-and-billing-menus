import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Home from './pages/Home';
import Intake from './pages/Intake';
import Billing from './pages/Billing';
import Header from './components/Header';
import Footer from './components/Footer';

// Layout component that wraps all pages
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

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const intakeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intake',
  component: Intake,
});

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: Billing,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, intakeRoute, billingRoute]);

// Create the router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
