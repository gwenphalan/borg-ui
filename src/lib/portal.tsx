import { useState, useEffect, type ReactPortal } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
    selector?: string;
}

export function Portal({
    children,
    selector = "body",
}: PortalProps): ReactPortal | null {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const element = document.querySelector(selector);

    return element ? createPortal(children, element) : null;
} 