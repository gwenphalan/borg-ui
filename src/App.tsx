import { useState } from "react";
import { Button } from "./components/button";
import { ToggleButton } from "./components/button/toggle-button";
import { Icon } from "./components/icon";
import { Toggle } from "./components/toggle";
import { TextInput } from "./components/text-input/text-input";
import { TextArea } from "./components/text-input/text-area";
import { Accordion } from "./components/accordion/accordion";
import { Menu } from "./components/menu/menu";
import type { MenuItem } from "./components/menu/menu";
import { HologramContainer } from "./components/container/hologram-container";
import { Modal } from "./components/modal/Modal";
import { Dropdown } from "./components/dropdown/Dropdown";
import type { DropdownOption } from "./components/dropdown/types";
import { Checkbox } from "./components/checkbox/checkbox";
import { Radio } from "./components/checkbox/radio";
import { Avatar } from "./components/avatar/avatar";
import { Badge } from "./components/badge/badge";
import { Tooltip } from "./components/tooltip";
import { Table } from "./components/table";
import { Breadcrumbs } from "./components/breadcrumbs";
import { Card } from "./components/card";
import placeholderSvg from "./assets/images/icons/placeholder.svg";
import { Chip } from "./components/chip";
import { DatePicker } from "./components/date-picker";
import { TimePicker } from "./components/time-picker/time-picker";
import { WarpSpeedBackground } from "./components/background/warp-speed-background";
import { MainLayout } from './components/layout/main-layout';

function App() {
  return (
    <MainLayout
      title="Borg UI"
      menuItems={[
        { label: "Home", href: "/" },
        { label: "Features", href: "/features" },
        { label: "Documentation", href: "/docs" },
        { label: "GitHub", href: "https://github.com/gwenphalan", external: true }
      ]}
    >
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[var(--content-primary)] mb-4">
            Welcome to Borg UI
          </h1>
          <p className="text-[var(--content-secondary)] max-w-2xl mx-auto">
            A modern, accessible, and customizable UI component library built with React, TypeScript, and Tailwind CSS.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Modern Design"
            subtitle="Built with modern web standards"
          >
            <p className="text-[var(--content-secondary)]">
              Clean, accessible, and responsive components that follow the latest web design trends.
            </p>
          </Card>

          <Card
            title="TypeScript"
            subtitle="Fully typed components"
          >
            <p className="text-[var(--content-secondary)]">
              Written in TypeScript for better developer experience and type safety.
            </p>
          </Card>

          <Card
            title="Customizable"
            subtitle="Theme and style customization"
          >
            <p className="text-[var(--content-secondary)]">
              Easily customize the look and feel of components to match your brand.
            </p>
          </Card>
        </section>

        <section className="text-center">
          <Button
            styleType="primary"
            icon="right"
            iconName="arrow"
            onClick={() => window.open('https://github.com/gwenphalan', '_blank')}
          >
            Get Started
          </Button>
        </section>
      </div>
    </MainLayout>
  );
}

export default App;
