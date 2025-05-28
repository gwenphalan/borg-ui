import { useEffect, useRef, useCallback } from "react";

interface StarTileData {
    tileA: HTMLDivElement;
    tileB: HTMLDivElement;
    posA: number; // Current X position for tileA
    posB: number; // Current X position for tileB
    speed: number;
}

interface StarLayer {
    id: string;
    baseCount: number;
    speed: number;
    starSpread: number;
    starOpacity: number;
    width: number; // Width of the div element holding the stars
    height: number; // Height of the div element holding the stars
}

// Define baseLayers outside the component to prevent re-creation on re-renders
const BASE_LAYERS: ReadonlyArray<StarLayer> = [
    {
        id: "stars0",
        baseCount: 800,
        speed: 0.5,
        starSpread: 0,
        starOpacity: 0.5,
        width: 5,
        height: 1,
    },
    {
        id: "stars1",
        baseCount: 800,
        speed: 1.5,
        starSpread: 0,
        starOpacity: 0.5,
        width: 20,
        height: 1,
    },
    {
        id: "stars2",
        baseCount: 700,
        speed: 5.0,
        starSpread: 0,
        starOpacity: 0.7,
        width: 60,
        height: 1,
    },
    {
        id: "stars3",
        baseCount: 200,
        speed: 10.0,
        starSpread: 0,
        starOpacity: 0.9,
        width: 100,
        height: 2,
    },
    {
        id: "stars4",
        baseCount: 100,
        speed: 15.0,
        starSpread: 0,
        starOpacity: 1.0,
        width: 140,
        height: 3,
    },
];

export function WarpSpeedBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const tilesRef = useRef<StarTileData[]>([]);
    const widthRef = useRef<number>(
        typeof window !== "undefined" ? window.innerWidth : 0,
    );
    const heightRef = useRef<number>(
        typeof window !== "undefined" ? window.innerHeight : 0,
    );
    const initialArea = useRef<number>(
        typeof window !== "undefined"
            ? window.innerWidth * window.innerHeight
            : 0,
    );
    const animationFrame = useRef<number | undefined>(undefined);
    const sessionSeed = useRef<number | undefined>(undefined);
    const resizeTimeout = useRef<number | undefined>(undefined);

    // Mulberry32 PRNG (no changes needed)
    const mulberry32 = useCallback((a: number) => {
        return function () {
            let t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }, []);

    // Create a tile (div) with box-shadow stars
    const createStarTile = useCallback(
        (
            id: string,
            count: number,
            starPlacementWidth: number, // Width of the area stars are spread over
            starPlacementHeight: number, // Height of the area stars are spread over
            randomFunc: () => number,
            layer: StarLayer,
        ): HTMLDivElement => {
            const tile = document.createElement("div");
            tile.className = id;
            tile.style.position = "absolute";
            tile.style.top = "0px";
            // tile.style.left is no longer set here; transform will be used
            tile.style.width = layer.width + "px";
            tile.style.height = layer.height + "px";
            tile.style.background = "transparent";
            tile.style.pointerEvents = "none";
            // Hint to the browser that the transform property will change
            tile.style.willChange = "transform";

            let boxShadow = "";
            for (let i = 0; i < count; i++) {
                const x = randomFunc() * starPlacementWidth;
                const y = randomFunc() * starPlacementHeight;
                boxShadow += `${x}px ${y}px 0px ${layer.starSpread}px rgba(255,255,255,${layer.starOpacity})`;
                if (i < count - 1) boxShadow += ", ";
            }
            tile.style.boxShadow = boxShadow;
            return tile;
        },
        [],
    ); // Empty dependency array as it has no external reactive dependencies

    const initializeStars = useCallback(() => {
        let seed = sessionSeed.current;
        if (!seed) {
            const storedSeed =
                typeof sessionStorage !== "undefined"
                    ? sessionStorage.getItem("starryNightSeed")
                    : null;
            if (storedSeed) {
                seed = parseInt(storedSeed, 10);
            } else {
                seed = Date.now();
                if (typeof sessionStorage !== "undefined") {
                    sessionStorage.setItem("starryNightSeed", seed.toString());
                }
            }
            sessionSeed.current = seed;
        }
        const randomFunc = mulberry32(seed);

        // Clear existing tiles
        tilesRef.current.forEach(({ tileA, tileB }) => {
            tileA?.parentNode?.removeChild(tileA);
            tileB?.parentNode?.removeChild(tileB);
        });
        tilesRef.current = [];

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = ""; // Simple way to clear previous content

        widthRef.current = window.innerWidth;
        heightRef.current = window.innerHeight;
        const currentArea = widthRef.current * heightRef.current;
        if (initialArea.current === 0 && typeof window !== "undefined") {
            // Initialize initialArea if it wasn't set due to SSR
            initialArea.current = window.innerWidth * window.innerHeight || 1; // Avoid division by zero
        }


        BASE_LAYERS.forEach((layer) => {
            const scaledCount = Math.round(
                layer.baseCount * (currentArea / Math.max(1, initialArea.current)), // Avoid division by zero
            );
            const tileA = createStarTile(
                layer.id + "a",
                scaledCount,
                widthRef.current,
                heightRef.current,
                randomFunc,
                layer,
            );
            const tileB = createStarTile(
                layer.id + "b",
                scaledCount,
                widthRef.current,
                heightRef.current,
                randomFunc,
                layer,
            );

            const posA = 0;
            const posB = widthRef.current;

            tileA.style.transform = `translateX(${posA}px)`;
            tileB.style.transform = `translateX(${posB}px)`;

            container.appendChild(tileA);
            container.appendChild(tileB);
            tilesRef.current.push({
                tileA,
                tileB,
                speed: layer.speed,
                posA,
                posB,
            });
        });
    }, [createStarTile, mulberry32]); // mulberry32 and createStarTile are memoized

    // Animate tiles
    const animate = useCallback(() => {
        const screenWidth = widthRef.current;
        tilesRef.current.forEach((starLayer) => {
            starLayer.posA -= starLayer.speed;
            starLayer.posB -= starLayer.speed;

            // If tileA has moved completely off-screen to the left
            if (starLayer.posA <= -screenWidth) {
                starLayer.posA = starLayer.posB + screenWidth;
            }
            // If tileB has moved completely off-screen to the left
            if (starLayer.posB <= -screenWidth) {
                starLayer.posB = starLayer.posA + screenWidth;
            }

            starLayer.tileA.style.transform = `translateX(${starLayer.posA}px)`;
            starLayer.tileB.style.transform = `translateX(${starLayer.posB}px)`;
        });
        animationFrame.current = requestAnimationFrame(animate);
    }, []); // No reactive dependencies that change over time

    useEffect(() => {
        // Ensure initial values are set on client
        if (typeof window !== "undefined") {
            widthRef.current = window.innerWidth;
            heightRef.current = window.innerHeight;
            initialArea.current = window.innerWidth * window.innerHeight || 1;
        }

        initializeStars();
        animationFrame.current = requestAnimationFrame(animate);

        function handleResize() {
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
            resizeTimeout.current = window.setTimeout(() => {
                // Update initialArea on resize to prevent stars from shrinking/growing indefinitely
                // if the user resizes multiple times before the timeout.
                // Or, keep initialArea truly initial and let star density scale.
                // For this effect, re-calculating initialArea on resize might not be desired
                // if the goal is to scale relative to the *very first* load area.
                // Let's stick to the original logic: initialArea is set once.
                initializeStars();
            }, 250);
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            tilesRef.current.forEach(({ tileA, tileB }) => {
                tileA?.parentNode?.removeChild(tileA);
                tileB?.parentNode?.removeChild(tileB);
            });
            tilesRef.current = [];
            if (resizeTimeout.current) {
                clearTimeout(resizeTimeout.current);
            }
        };
    }, [initializeStars, animate]); // Add memoized functions as dependencies

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-screen h-screen z-[-1] pointer-events-none overflow-hidden"
            style={{
                background: "linear-gradient(to top, #3b3b3b 0%, #000000 100%)",
            }}
            aria-hidden="true"
        />
    );
}
