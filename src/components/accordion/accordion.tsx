import { useState } from "react";
import { Icon } from "../icon/icon";


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
            className={`inline-flex flex-col rounded-[12px] overflow-hidden w-full max-w-[520px] border-2 border-[${"var(--border-default)"}] bg-[${"var(--surface-default)"}]` +
                (className ? ` ${className}` : "")}
            style={{
                outline: `2px solid ${"var(--border-default)"}`,
                outlineOffset: -2,
                background: "var(--surface-default)",
                ...style
            }}
        >
            {items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div key={idx} className="w-full">
                        <button
                            className={
                                `w-full px-6 py-4 flex items-center gap-2 font-orbitron text-lg font-extrabold leading-6 ` +
                                (isOpen ? "rounded-[12px] z-10 relative" : "rounded-none")
                            }
                            style={{
                                background: isOpen ? "var(--content-primary)" : "var(--surface-default)",
                                color: isOpen ? "var(--text-dark)" : "var(--content-primary)",
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
                                    color={isOpen ? "var(--text-dark)" : "var(--content-primary)"}
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
                                    background: "var(--surface-default)",
                                    borderRadius: 0,
                                    marginTop: 0
                                }}
                            >
                                <div
                                    className="flex-1 font-orbitron text-base font-bold leading-6 text-left break-words"
                                    style={{ color: "var(--content-secondary)", fontWeight: 800 }}
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
