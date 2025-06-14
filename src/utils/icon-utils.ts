import React from 'react';

export function isIconElement(element: React.ReactNode): element is React.ReactElement<{ color?: string; size?: number | string }> {
    return React.isValidElement(element) && (element.type as { displayName?: string })?.displayName === 'Icon';
} 