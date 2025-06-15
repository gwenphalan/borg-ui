import { useState } from "react";

export interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    size?: "sm" | "md" | "lg";
    status?: "online" | "offline" | "busy" | "away";
    rounded?: boolean;
    className?: string;
    onError?: () => void;
}


const statusBorderMap: Record<string, string> = {
    online: "text-content-primary",
    offline: "text-status-error",
    busy: "text-status-warning",
    away: "border-gray-400",
};

const sizeMap: Record<string, string> = {
    sm: "w-8 h-8 text-base",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-xl",
};

const borderSizeMap: Record<string, string> = {
    sm: "w-12 h-12 border-4",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
};

/* const statusPositionMap: Record<string, string> = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
} */;

export function Avatar({
    src,
    alt,
    initials,
    size = "md",
    status,
    rounded = true,
    className = "",
    onError,
}: AvatarProps) {
    const [imgError, setImgError] = useState(false);

    const showImage = src && !imgError;
    const fallbackInitials =
        initials?.slice(0, 2).toUpperCase() ||
        (alt?.[0] ? alt[0].toUpperCase() : "?");

    const borderClass = status ? statusBorderMap[status] : "border-default";
    const shapeClass = rounded ? "rounded-full" : "rounded-md";

    return (
        <div className={["relative inline-flex items-center justify-center", className].join(" ")}>
            {status && (
                <div
                    className={[
                        "absolute z-0",
                        borderSizeMap[size],
                        shapeClass,
                        "border-solid",
                        borderClass,
                    ].join(" ")}
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "transparent",
                        pointerEvents: "none",
                    }}
                />
            )}
            <div
                className={[
                    "relative z-10 bg-background-elevated overflow-hidden flex items-center justify-center",
                    sizeMap[size],
                    shapeClass,
                ].join(" ")}
                style={{ color: "var(--content-primary)" }}
                aria-label={alt || initials || "Avatar"}
                role="img"
            >
                {showImage ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className={["object-cover w-full h-full", shapeClass].join(" ")}
                        loading="lazy"
                        onError={() => {
                            setImgError(true);
                            onError?.();
                        }}
                    />
                ) : (
                    <span className="font-semibold text-content-primary select-none">
                        {fallbackInitials}
                    </span>
                )}
            </div>
        </div>
    );
} 