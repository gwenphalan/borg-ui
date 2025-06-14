#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const TEMPLATES = {
  vite: {
    name: 'Vite + React',
    command: 'npm create vite@latest . -- --template react-ts',
    dependencies: ['@vitejs/plugin-react', 'vite'],
    devDependencies: true
  },
  next: {
    name: 'Next.js',
    command: 'npx create-next-app@latest . --typescript --tailwind --eslint',
    dependencies: ['next'],
    devDependencies: false
  },
  cra: {
    name: 'Create React App',
    command: 'npx create-react-app . --template typescript',
    dependencies: ['react-scripts'],
    devDependencies: false
  }
};

const BORG_UI_FILES = {
  'src/App.tsx': `import { useState } from "react";
import { HologramContainer, WarpSpeedBackground } from "@unimatrix-01/ui";
import { MainLayout } from "./MainLayout";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={\`min-h-screen \${isDarkMode ? 'dark' : ''}\`}>
      <WarpSpeedBackground />
      <HologramContainer>
        <MainLayout isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />
      </HologramContainer>
    </div>
  );
}

export default App;`,

  'src/MainLayout.tsx': `import type { ReactNode } from "react";
import { Menu, Icon, Button } from "@unimatrix-01/ui";
import type { MenuItem } from "@unimatrix-01/ui";

interface MainLayoutProps {
  children?: ReactNode;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function MainLayout({ children, isDarkMode, onThemeToggle }: MainLayoutProps) {
  const menuItems: MenuItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Icon name="placeholder" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Features",
      children: [
        { label: "Feature A", href: "/features/a" },
        { label: "Feature B", href: "/features/b" },
      ],
      icon: <Icon name="placeholder" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Settings",
      align: "right" as const,
      children: [
        { label: "Profile", href: "/profile" },
        { label: "Settings", href: "/settings" },
        { label: "-", divider: true },
        { label: "Logout", onClick: () => alert("Logged out") },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-[var(--background-elevated)] border-b border-[var(--border-default)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[var(--content-primary)]">Borg UI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                icon="left"
                iconName={isDarkMode ? "sun" : "moon"}
                onClick={onThemeToggle}
                styleType="secondary"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
          <Menu items={menuItems} />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-[var(--background-elevated)] border-t border-[var(--border-default)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-[var(--content-secondary)]">© 2024 Borg UI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Terms</a>
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Privacy</a>
              <a href="#" className="text-[var(--content-secondary)] hover:text-[var(--content-primary)]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}`,

  'src/App.css': `/* Borg UI App Styles */
:root {
  /* Light Theme Variables */
  --background-default: #ffffff;
  --background-elevated: #f8f9fa;
  --border-default: #e9ecef;
  --content-primary: #212529;
  --content-secondary: #6c757d;
  --interactive-accentfocus: #0d6efd;
  --status-error: #dc3545;
  --status-info: #0dcaf0;
  --status-warning: #ffc107;
  --surface-default: #ffffff;
  --text-light: #f8f9fa;
  --text-background-default: #ffffff;
  --text-dark: #212529;
}

.dark {
  /* Dark Theme Variables */
  --background-default: #1a1a1a;
  --background-elevated: #2d2d2d;
  --border-default: #404040;
  --content-primary: #e9ecef;
  --content-secondary: #adb5bd;
  --interactive-accentfocus: #0d6efd;
  --status-error: #dc3545;
  --status-info: #0dcaf0;
  --status-warning: #ffc107;
  --surface-default: #2d2d2d;
  --text-light: #f8f9fa;
  --text-background-default: #1a1a1a;
  --text-dark: #212529;
}

/* Global Styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background-default);
  color: var(--content-primary);
}

/* Smooth Transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-elevated);
}

::-webkit-scrollbar-thumb {
  background: var(--content-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--content-primary);
}`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Borg UI styles */
@import './App.css';

/* Additional global styles */
html {
  scroll-behavior: smooth;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--interactive-accentfocus);
  outline-offset: 2px;
}

/* Selection styles */
::selection {
  background-color: var(--interactive-accentfocus);
  color: var(--text-light);
}`
};

async function main() {
  console.log('🚀 Welcome to Borg UI Setup!');
  console.log('This script will help you set up a new Borg UI project.\n');

  // Ask for project name
  const projectName = await new Promise(resolve => {
    rl.question('What would you like to name your project? ', resolve);
  });

  // Create project directory
  const projectDir = path.join(process.cwd(), projectName);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  }
  process.chdir(projectDir);

  // Ask for template
  console.log('\nAvailable templates:');
  Object.entries(TEMPLATES).forEach(([key, template]) => {
    console.log(`- ${key}: ${template.name}`);
  });

  const templateKey = await new Promise(resolve => {
    rl.question('\nWhich template would you like to use? (vite/next/cra) ', answer => {
      resolve(answer.toLowerCase());
    });
  });

  const template = TEMPLATES[templateKey];
  if (!template) {
    console.error('Invalid template selected!');
    process.exit(1);
  }

  // Create project
  console.log(`\nCreating ${template.name} project...`);
  execSync(template.command, { stdio: 'inherit' });

  // Install Borg UI
  console.log('\nInstalling Borg UI...');
  execSync('npm install @unimatrix-01/ui', { stdio: 'inherit' });

  // Install additional dependencies
  if (template.dependencies.length > 0) {
    console.log('\nInstalling additional dependencies...');
    const installCommand = template.devDependencies
      ? `npm install -D ${template.dependencies.join(' ')}`
      : `npm install ${template.dependencies.join(' ')}`;
    execSync(installCommand, { stdio: 'inherit' });
  }

  // Create Borg UI files
  console.log('\nSetting up Borg UI files...');
  Object.entries(BORG_UI_FILES).forEach(([filePath, content]) => {
    const fullPath = path.join(projectDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  });

  // Update package.json scripts
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.scripts = {
    ...packageJson.scripts,
    'borg:setup': 'node ./node_modules/@unimatrix-01/ui/scripts/setup.js'
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('\n✨ Borg UI setup complete!');
  console.log('\nTo start your project:');
  console.log(`  cd ${projectName}`);
  console.log('  npm run dev');
  console.log('\nHappy coding! 🚀');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 