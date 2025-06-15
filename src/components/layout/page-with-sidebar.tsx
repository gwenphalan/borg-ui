import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../button/button";
import { useMediaQuery } from "../../hooks/use-media-query";
import { Overlay } from "../overlay/Overlay";
import { HologramEffect } from "../container/hologram-container";

interface PageWithSidebarProps {
    sidebarContent: ReactNode;
    children: ReactNode;
    toolbarLeftContent?: ReactNode;
    toolbarRightContent?: ReactNode;
    showToolbarBorder?: boolean;
    showSidebarBorder?: boolean;
    showPageBottomBorder?: boolean;
    className?: string;
    toolbarClassName?: string;
    sidebarContainerClassName?: string;
    mainContentClassName?: string;
}

export function PageWithSidebar({
    sidebarContent,
    children,
    toolbarLeftContent,
    toolbarRightContent,
    showToolbarBorder = true,
    showSidebarBorder = true,
    showPageBottomBorder = true,
    className,
    toolbarClassName,
    sidebarContainerClassName,
    mainContentClassName,
}: PageWithSidebarProps) {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const sidebarToggleRef = useRef<HTMLButtonElement>(null);

    const sidebar = (
        <div className="w-full min-w-[16rem] flex-1 flex flex-col h-full overflow-y-auto">
            {sidebarContent}
        </div>
    );

    const toolbar = (
        <div
            className={cn(
                "flex items-center justify-between p-4 flex-shrink-0",
                showToolbarBorder && "border-b border-content-secondary",
                toolbarClassName
            )}
        >
            <div className="flex items-center gap-4">
                <Button
                    ref={sidebarToggleRef}
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    iconName={isSidebarOpen ? 'close-sidebar' : 'open-sidebar'}
                    iconSize={isMobile ? 24 : 36}
                    className="w-12 h-12 p-0 rounded-full"
                />
                {toolbarLeftContent}
            </div>
            <div className="flex items-center gap-4">
                {toolbarRightContent}
            </div>
        </div>
    );

    return (
        <div
            className={cn(
                "flex flex-col flex-1",
                showPageBottomBorder && "border-b border-content-secondary",
                className
            )}
        >
            {toolbar}
            <div className="flex flex-1 min-h-0">
                {isMobile && (
                    <Overlay
                        reference={sidebarToggleRef.current}
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                        placement="bottom-start"
                    >
                        <HologramEffect>
                            <div className="w-72 h-[calc(100vh-8rem)] p-4 flex flex-col">
                                {sidebar}
                            </div>
                        </HologramEffect>
                    </Overlay>
                )}

                {!isMobile && (
                    <div
                        className={cn(
                            "relative flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-x-hidden",
                            isSidebarOpen ? 'w-72' : 'w-0',
                            sidebarContainerClassName
                        )}
                    >
                        <aside
                            className={cn(
                                "h-full overflow-y-auto overflow-x-hidden transition-opacity duration-300 ease-in-out px-4 pt-4 pb-2",
                                isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
                                showSidebarBorder && "border-r border-content-secondary"
                            )}
                        >
                            {sidebar}
                        </aside>
                    </div>
                )}

                <main className={cn("flex-1 min-w-0 overflow-y-auto p-4 md:p-8", mainContentClassName)}>
                    {children}
                </main>
            </div>
        </div>
    );
} 