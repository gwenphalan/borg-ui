import type { ReactNode, CSSProperties } from "react";
import { HologramContext } from "./hologram-context";
import { cn } from "@/lib/utils";

// --- HologramEffect Component ---
// This component provides hologram effects for overlays/modals only
// It should be used to wrap overlay content, not container content
export function HologramEffect({ children }: { children: ReactNode }) {
  // --- Configurable Bloom Parameters ---
  const bloomStdDeviation = "10";
  const bloomAmplitude = "3.5";
  const bloomExponent = "0.8";
  const bloomOpacity = "0.4";
  const containerBorderColor = "rgba(94, 255, 148, 0.6)";
  const containerBoxShadowColor = "rgba(94, 255, 148, 0.15)";
  const containerBoxShadowBlur = "10px";
  const bgScanlineColor = "rgba(255,255,255,0.08)";
  const bgGradientDark1 = "rgba(18, 16, 16, 0)";
  const bgGradientDark2 = "rgba(0, 0, 0, 0.25)";
  const bgGradientGreen1 = "rgba(1, 15, 0, 0.8)";
  const bgGradientGreen2 = "rgba(0, 32, 0, 0.8)";
  const bgScanlinesAnimationDuration = "8s";

  // --- Configurable Overlay Effect Parameters ---
  const overlayGridLineDarkColor = "rgba(18, 16, 16, 0)";
  const overlayGridLineDarkerColor = "rgba(0, 0, 0, 0.25)";
  const overlayGridRedTint = "rgba(255, 0, 0, 0.08)";
  const overlayGridGreenTint = "rgba(0, 255, 0, 0.04)";
  const overlayGridBlueTint = "rgba(0, 0, 255, 0.08)";
  const flickerOverlayBgColor = "rgba(18, 16, 16, 0.18)";
  const flickerAnimationDuration = "0.07s";

  return (
    <div style={{ position: "relative", height: '100%' }}>
      <svg width="0" height="0" className="absolute">
        <filter id="content-color-bloom-v6">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0.2126 0.7152 0.0722 0 0"
            result="coloredSourceWithLuminanceAlpha"
          />
          <feComponentTransfer in="coloredSourceWithLuminanceAlpha" result="glowMask">
            <feFuncA type="gamma" amplitude={bloomAmplitude} exponent={bloomExponent} offset="0" />
          </feComponentTransfer>
          <feGaussianBlur
            in="glowMask"
            stdDeviation={bloomStdDeviation}
            result="blurredGlowPreOpacity"
          />
          <feColorMatrix
            in="blurredGlowPreOpacity"
            type="matrix"
            values={`1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${bloomOpacity} 0`}
            result="blurredColoredGlowWithOpacity"
          />
          <feComposite
            operator="lighter"
            in="SourceGraphic"
            in2="blurredColoredGlowWithOpacity"
          />
        </filter>
      </svg>
      <div className="hologram-content-wrapper" style={{ filter: "url(#content-color-bloom-v6)", position: "relative", zIndex: 1, height: '100%' }}>
        {children}
      </div>
      <div className="hologram-overlays">
        <div className="hologram-scanlines-overlay"></div>
        <div className="hologram-flicker-overlay"></div>
      </div>
      <style>{`
        .hologram-container {
          width: 100%;
          max-width: 100vw;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          border-left: 4px solid ${containerBorderColor};
          border-right: 4px solid ${containerBorderColor};
          box-shadow: 0 0 ${containerBoxShadowBlur} ${containerBoxShadowColor};
          position: relative;
          background:
            repeating-linear-gradient(to bottom, ${bgScanlineColor} 0px, ${bgScanlineColor} 1px, transparent 1px, transparent 4px),
            linear-gradient(to bottom, ${bgGradientDark1} 60%, ${bgGradientDark2} 60%),
            linear-gradient(to top, ${bgGradientGreen1}, ${bgGradientGreen2});
          background-size: 100% 5px, 100% 2px, cover;
          animation: scanlines-bg ${bgScanlinesAnimationDuration} linear infinite;
        }
        @media (min-width: 640px) { .hologram-container { width: 90vw; max-width: 90vw; padding: 2rem; } }
        @media (min-width: 1024px) { .hologram-container { width: 1200px; max-width: 1200px; padding: 2.5rem; } }
        @media (min-width: 1280px) { .hologram-container { padding: 3rem; } }

        .hologram-content-wrapper {
          position: relative;
          z-index: 1;
        }
        .hologram-overlays {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* Elevate overlay so it sits above content wrapper */
          z-index: 2;
          pointer-events: none;
          overflow: hidden;
        }
        .hologram-scanlines-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(${overlayGridLineDarkColor} 50%, ${overlayGridLineDarkerColor} 50%), linear-gradient(90deg, ${overlayGridRedTint}, ${overlayGridGreenTint}, ${overlayGridBlueTint});
          background-size: 100% 2px, 3px 100%;
        }
        .hologram-flicker-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${flickerOverlayBgColor};
          opacity: 0;
          animation: flicker ${flickerAnimationDuration} infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.6; } 5% { opacity: 0.7; } 10% { opacity: 0.5; }
          15% { opacity: 0.8; } 20% { opacity: 0.4; } 25% { opacity: 0.75; }
          30% { opacity: 0.65; } 35% { opacity: 0.7; } 40% { opacity: 0.5; }
          45% { opacity: 0.8; } 50% { opacity: 0.8; } 55% { opacity: 0.45; }
          60% { opacity: 0.5; } 65% { opacity: 0.7; } 70% { opacity: 0.6; }
          75% { opacity: 0.55; } 80% { opacity: 0.75; } 85% { opacity: 0.7; }
          90% { opacity: 0.75; } 95% { opacity: 0.6; } 100% { opacity: 0.5; }
        }
        @keyframes scanlines-bg {
          from { background-position: 0 0, 0 0, 0 0; }
          to { background-position: 0 5px, 0 0, 0 0; }
        }
      `}</style>
    </div>
  );
}

// --- HologramContainer Component ---
// Simple container with hologram styling, no filter effects
export interface HologramContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HologramContainer({
  children,
  className = "",
  style,
}: HologramContainerProps) {
  return (
    <HologramContext.Provider value={true}>
      <div className={cn("flex flex-col", className)}>
        <HologramEffect>
          <div
            className="hologram-container min-h-screen overflow-hidden flex-1 flex flex-col"
            style={style}
          >
            {children}
          </div>
        </HologramEffect>
      </div>
    </HologramContext.Provider>
  );
}
