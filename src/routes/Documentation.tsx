import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { TextInput } from '../components/text-input/text-input';
import { Icon } from '../components/icon/icon';
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs';
import { Button } from '../components/button/button';
import { Dropdown } from '../components/dropdown/Dropdown';
import type { DropdownOption } from '../components/dropdown/types';

interface DocumentationProps {
    styleMap: Record<string, string>;
}

// In a real app, this would be fetched from GitHub API or a manifest file
const versions: DropdownOption[] = [
    { value: '1.0.12', label: 'v1.0.12 (latest)' },
    { value: '1.0.11', label: 'v1.0.11' },
    { value: '1.0.10', label: 'v1.0.10' },
    { value: '0.9.0', label: 'v0.9.0', disabled: true },
];

// This uses Vite's import.meta.glob to statically analyze the imports
const docModules = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default', eager: true });

function getDocContent(path: string): string | null {
    const modulePath = `/docs/${path}`;
    return (docModules[modulePath] as string) || null;
}

interface NavItemData {
    title: string;
    path?: string;
    children?: NavItemData[];
}

interface NavItemProps {
    item: NavItemData;
    currentPath: string;
    styleMap: Record<string, string>;
}

function NavItem({ item, currentPath, styleMap }: NavItemProps) {
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = !!item.children;
    const isActive = !isFolder && item.path === currentPath;

    if (isFolder) {
        return (
            <div className="my-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-background-default focus:outline-none focus:ring-2 focus:ring-interactive-accentfocus"
                >
                    <span className="font-semibold" style={{ color: styleMap.content_primary }}>{item.title}</span>
                    <Icon name="chevron" size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
                </button>
                <div
                    className={`pl-4 border-l-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
                    style={{ borderColor: styleMap.border_default }}
                >
                    {item.children && item.children.map(child => (
                        <NavItem key={child.path || child.title} item={child} currentPath={currentPath} styleMap={styleMap} />
                    ))}
                </div>
            </div>
        );
    }

    const docRoute = item.path?.replace(/\.md$/, '');
    return (
        <Link
            to={`/docs/${docRoute}`}
            className={`block p-2 my-1 rounded-md text-sm ${isActive ? 'bg-content-primary text-background-default font-semibold' : 'hover:bg-background-default'}`}
        >
            {item.title}
        </Link>
    );
}

interface TocItem {
    level: number;
    text: string;
    id: string;
}

export function Documentation({ styleMap }: DocumentationProps) {
    const { '*': docPath = 'quickstart' } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState(versions[0].value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [docContent, setDocContent] = useState('');
    const [toc, setToc] = useState<TocItem[]>([]);

    const docStructure: NavItemData[] = [
        { title: 'Quickstart', path: 'quickstart.md' },
        {
            title: 'Getting Started',
            children: [
                { title: 'Setup', path: 'getting-started/setup.md' },
            ]
        },
        {
            title: 'Components',
            children: [
                { title: 'Button', path: 'components/button.md' },
            ]
        },
    ];

    const markdownComponents: Components = {
        h1: ({ ...props }) => <h1 className="text-4xl font-bold mb-6" style={{ color: styleMap.content_primary }} {...props} />,
        h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2" style={{ color: styleMap.content_primary, borderColor: styleMap.border_default }} {...props} />,
        h3: ({ ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3" style={{ color: styleMap.content_primary }} {...props} />,
        p: ({ ...props }) => <p className="mb-4 leading-relaxed" style={{ color: styleMap.text_light }} {...props} />,
        ul: ({ ...props }) => <ul className="list-disc list-outside pl-6 mb-4 space-y-2" style={{ color: styleMap.text_light }} {...props} />,
        ol: ({ ...props }) => <ol className="list-decimal list-outside pl-6 mb-4 space-y-2" style={{ color: styleMap.text_light }} {...props} />,
        li: ({ ...props }) => <li className="mb-2" {...props} />,
        code: (props) => {
            const { inline, className, children, ...rest } = props as { inline?: boolean; className?: string; children?: ReactNode };
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="my-4 rounded-lg bg-surface-default overflow-hidden border" style={{ borderColor: styleMap.border_default }}>
                    <pre className="p-4 text-sm overflow-x-auto"><code {...rest} className={className}>{children}</code></pre>
                </div>
            ) : (
                <code {...rest} className={`px-1.5 py-1 rounded text-sm bg-surface-default ${className || ''}`}>{children}</code>
            );
        },
        pre: ({ children }) => <>{children}</>,
        a: ({ ...props }) => <a className="text-interactive-accentfocus hover:underline" {...props} />,
        strong: ({ ...props }) => <strong className="font-bold text-content-primary" {...props} />,
        blockquote: ({ ...props }) => <blockquote className="border-l-4 pl-4 my-4 italic" style={{ borderColor: styleMap.interactive_accentfocus, color: styleMap.content_secondary }} {...props} />,
    };

    useEffect(() => {
        const content = getDocContent(docPath + '.md');
        if (content) {
            setDocContent(content);
            const headings = content.match(/^#{1,3}\s+(.+)$/gm) || [];
            const newToc: TocItem[] = headings.map(heading => {
                const level = heading.match(/^#+/)?.[0].length || 1;
                const text = heading.replace(/^#+\s+/, '');
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return { level, text, id };
            });
            setToc(newToc);
        } else {
            setDocContent(`## Page Not Found

The document at \`${docPath}.md\` could not be found.`);
            setToc([]);
        }
    }, [docPath, selectedVersion]);

    const breadcrumbs = useMemo(() => {
        const pathParts = docPath.split('/');
        const items = [{ label: 'Docs', href: '/docs' }];
        let currentUrl = '/docs';
        for (const part of pathParts) {
            if (part) {
                currentUrl += `/${part}`;
                items.push({ label: part.replace(/-/g, ' '), href: currentUrl });
            }
        }
        return items;
    }, [docPath]);

    const handleVersionChange = (newValue: string | string[]) => {
        if (typeof newValue === 'string') {
            setSelectedVersion(newValue);
            // Here you might reload docs for the new version
        }
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 transition-all duration-300 overflow-y-auto border-r flex flex-col ${isSidebarOpen ? 'w-72 p-4' : 'w-0 p-0'}`}
                style={{ borderColor: styleMap.border_default, backgroundColor: 'transparent' }}
            >
                <div className="mb-4">
                    <Dropdown
                        options={versions}
                        value={selectedVersion ?? ''}
                        onChange={handleVersionChange}
                        isOpen={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                    />
                </div>

                <TextInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search documentation..."
                    type="search"
                    className="mb-4"
                />

                <nav className="flex-1 space-y-1">
                    {docStructure.map(item => (
                        <NavItem key={item.path || item.title} item={item} currentPath={docPath + '.md'} styleMap={styleMap} />
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                        </Button>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => window.open('https://github.com/gwenphalan/borg-ui', '_blank')}
                        >
                            Edit on GitHub
                        </Button>
                    </div>

                    <Breadcrumbs items={breadcrumbs} className="mb-8" />

                    <div className="flex gap-8">
                        <article className="flex-1 prose prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                            >
                                {docContent}
                            </ReactMarkdown>
                        </article>

                        {toc.length > 0 && (
                            <aside className="w-56 hidden xl:block flex-shrink-0">
                                <div className="sticky top-24">
                                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: styleMap.content_secondary }}>
                                        On this page
                                    </h3>
                                    <nav>
                                        <ul className="space-y-2">
                                            {toc.map((item) => (
                                                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}>
                                                    <a
                                                        href={`#${item.id}`}
                                                        className="text-sm block hover:text-content-primary transition-colors"
                                                        style={{ color: styleMap.content_secondary }}
                                                    >
                                                        {item.text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 