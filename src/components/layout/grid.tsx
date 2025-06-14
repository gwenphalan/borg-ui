import React from "react";
import { cn } from "../../lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Grid = ({ children, className, ...props }: GridProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const GridItem = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            {children}
        </div>
    );
}; 