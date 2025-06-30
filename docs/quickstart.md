---
title: Quickstart
order: 1
---

# Quickstart Guide

Welcome to **Borg UI**! This guide will help you get started with our component library.

## Installation

```bash
npm install @unimatrix-01/ui
```

## Basic Setup

Import the CSS and start using components:

```tsx
import "@unimatrix-01/ui/styles.css";
import { Button, Card } from "@unimatrix-01/ui";

function App() {
  return (
    <Card title="Hello World">
      <Button variant="primary">Click me!</Button>
    </Card>
  );
}
```

## Next Steps

- Explore the [Component Usage](/docs/components) section
- Check out our [Theming Guide](/docs/advanced/theming)
- View the [API Reference](/docs/api)
