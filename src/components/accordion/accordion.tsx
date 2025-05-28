import { useState } from "react";
import { Icon } from "../icon/icon";

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
    text_dark: "#003D1E"
};

export interface AccordionItem {
    title: string;
    content: string;
}

export interface AccordionProps {
    items: AccordionItem[];
    className?: string;
    style?: React.CSSProperties;
    defaultOpenIndex?: number;
}

export function Accordion({ items, className = "", style, defaultOpenIndex = -1 }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

    return (
        <div
            className={`inline-flex flex-col rounded-[12px] overflow-hidden w-full max-w-[520px] border-2 border-[${styleMap.border_default}] bg-[${styleMap.surface_default}]` +
                (className ? ` ${className}` : "")}
            style={{
                outline: `2px solid ${styleMap.border_default}`,
                outlineOffset: -2,
                background: styleMap.surface_default,
                ...style
            }}
        >
            {items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div key={idx} className="w-full">
                        <button
                            className={
                                `w-full px-6 py-4 flex items-center gap-2 font-[Orbitron] text-[18px] font-extrabold leading-6 ` +
                                (isOpen ? "rounded-[12px] z-10 relative" : "rounded-none")
                            }
                            style={{
                                background: isOpen ? styleMap.content_primary : styleMap.surface_default,
                                color: isOpen ? styleMap.text_dark : styleMap.content_primary,
                                boxShadow: isOpen ? "0px 2px 6px rgba(0,0,0,0.48)" : undefined,
                                borderRadius: 10,
                                outline: "none",
                                transition: "none"
                            }}
                            onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                            aria-expanded={isOpen}
                            tabIndex={0}
                        >
                            <span className="flex-1 text-left break-words" style={{ fontWeight: 900 }}>{item.title}</span>
                            <span className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
                                <Icon
                                    name="chevron-down"
                                    size={32}
                                    color={isOpen ? styleMap.text_dark : styleMap.content_primary}
                                    className={isOpen ? "rotate-180" : "rotate-0"}
                                />
                            </span>
                        </button>
                        {isOpen && (
                            <div
                                className="w-full px-6 pt-4 pb-6 inline-flex gap-3"
                                style={{
                                    alignSelf: "stretch",
                                    overflow: "hidden",
                                    background: styleMap.surface_default,
                                    borderRadius: 0,
                                    marginTop: 0
                                }}
                            >
                                <div
                                    className="flex-1 font-[Orbitron] text-[16px] font-bold leading-6 text-left break-words"
                                    style={{ color: styleMap.content_secondary, fontWeight: 800 }}
                                >
                                    {item.content}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Accordion;
