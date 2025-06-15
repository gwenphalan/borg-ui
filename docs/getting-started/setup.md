# Setup Guide

## Prerequisites

- Node.js 16.0 or higher
- React 18.0 or higher

## Installation Steps

### 1. Install the package

```bash
npm install @unimatrix-01/ui
```

### 2. Import the styles

Add this to your main entry file:

```tsx
import "@unimatrix-01/ui/styles.css";
```

### 3. Set up the theme provider

Wrap your app with the ThemeProvider:

```tsx
import { ThemeProvider } from "@unimatrix-01/ui";

function App() {
  return <ThemeProvider>{/* Your app content */}</ThemeProvider>;
}
```
