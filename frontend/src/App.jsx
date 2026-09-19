import { lazy, Suspense, Component, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { MotionConfig } from "framer-motion";
import {
  Navbar,
  Footer,
  PageLoader,
  CustomCursor,
  ScrollProgress,
  BackToTop,
} from "./components/UI";
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Home = lazy(() => import("./pages/Home"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const SpaceBackground = lazy(() => import("./components/SpaceBackground"));
class ErrorBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="not-found">
        <h1>Something interrupted the experience.</h1>
        <p>Please refresh to try again.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function RouteFocus() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}
export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <div id="top" />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Suspense fallback={null}>
            <SpaceBackground />
          </Suspense>
          <CustomCursor />
          <PageLoader />
          <ScrollProgress />
          <Navbar />
          <div id="main-content" tabIndex={-1}>
            <Suspense
              fallback={
                <div className="route-loading" role="status">
                  Loading experience…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/contact"
                  element={<Navigate to="/#contact" replace />}
                />
                {[
                  "logo-design",
                  "social-media-design",
                  "branding",
                  "ebooks",
                  "development",
                ].map((page) => (
                  <Route
                    key={page}
                    path={"/" + page}
                    element={<ServicePage key={page} page={page} />}
                  />
                ))}
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route
                  path="*"
                  element={
                    <main className="not-found">
                      <h1>A little off orbit.</h1>
                      <p>This page doesn't exist.</p>
                      <Link className="button" to="/">
                        Return home
                      </Link>
                    </main>
                  }
                />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <BackToTop />
          <RouteFocus />
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}
