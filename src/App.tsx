import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WarpSpeedBackground } from "./components/background/warp-speed-background";
import { HologramContainer } from "./components/container/hologram-container";
import { MainLayout } from './components/layout/main-layout';
import { ThemeProvider } from "./hooks/use-theme";

// Import route components
import { Home } from "./routes/Home";
import { Features } from "./routes/Features";
import { Documentation } from "./routes/Documentation";

function App() {
  const styleMap: Record<string, string> = {
    background_default: "var(--background-default)",
    background_elevated: "var(--background-elevated)",
    border_default: "var(--border-default)",
    content_primary: "var(--content-primary)",
    content_secondary: "var(--content-secondary)",
    interactive_accentfocus: "var(--interactive-accentfocus)",
    status_error: "var(--status-error)",
    status_info: "var(--status-info)",
    status_warning: "var(--status-warning)",
    surface_default: "var(--surface-default)",
    text_light: "var(--text-light)",
    text_background_default: "var(--text-background-default)",
    text_dark: "var(--text-dark)"
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-screen bg-fixed">
          <WarpSpeedBackground />
          <div className="relative z-10 flex flex-col">
            <HologramContainer className="flex-1 min-h-screen">
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home styleMap={styleMap} />} />
                  <Route path="/features" element={<Features styleMap={styleMap} />} />
                  <Route path="/docs/*" element={<Documentation styleMap={styleMap} />} />
                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </HologramContainer>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
