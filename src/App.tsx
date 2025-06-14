import { useState } from "react";
import { Button } from "./components/button/button";
import { Card } from "./components/card/card";
import { TextInput } from "./components/text-input/text-input";
import { TextArea } from "./components/text-input/text-area";
import { Toggle } from "./components/toggle/toggle";
import { Checkbox } from "./components/checkbox/checkbox";
import { Radio } from "./components/checkbox/radio";
import { DatePicker } from "./components/date-picker";
import { TimePicker } from "./components/time-picker/time-picker";
import { Dropdown } from "./components/dropdown/Dropdown";
import { Chip } from "./components/chip";
import { Breadcrumbs } from "./components/breadcrumbs";
import { Menu } from "./components/menu/menu";
import { Modal } from "./components/modal/Modal";
import { WarpSpeedBackground } from "./components/background/warp-speed-background";
import { HologramContainer } from "./components/container/hologram-container";
import { MainLayout } from './components/layout/main-layout';
import { Grid, GridItem } from "./components/layout/grid";

function App() {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (value: Date | Date[] | [Date | null, Date | null] | [Date, Date] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (value === null) {
      setSelectedDate(undefined);
    }
  };

  const handleTimeChange = (value: string | number | Date | null) => {
    if (typeof value === 'string') {
      setSelectedTime(value);
    }
  };

  const handleDropdownChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setSelectedDropdownValue(value);
    }
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundAttachment: 'fixed',
      }}
    >
      <WarpSpeedBackground />
      <div className="flex min-h-screen items-center justify-center">
        <HologramContainer>
          <MainLayout>
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

              <section className="space-y-4">
                <h2 className="col-span-full text-2xl font-bold text-[var(--content-primary)]">Interactive Components</h2>
                <Grid>
                  <GridItem>
                    <TextInput
                      label="Username"
                      placeholder="Enter username"
                      value={username}
                      onChange={setUsername}
                    />
                  </GridItem>
                  <GridItem>
                    <TextArea
                      label="Description"
                      placeholder="Enter description"
                      value={description}
                      onChange={setDescription}
                    />
                  </GridItem>
                  <GridItem>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      label="Select date"
                    />
                  </GridItem>
                  <GridItem>
                    <TimePicker
                      value={selectedTime}
                      onChange={handleTimeChange}
                      label="Select time"
                    />
                  </GridItem>
                  <GridItem>
                    <Dropdown
                      label="Select option"
                      options={[
                        { label: "Option 1", value: "1" },
                        { label: "Option 2", value: "2" }
                      ]}
                      value={selectedDropdownValue}
                      onChange={handleDropdownChange}
                      isOpen={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    />
                  </GridItem>
                  <GridItem className="col-span-full flex-row items-center gap-4">
                    <Toggle
                      checked={isNotificationsEnabled}
                      onToggle={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                    />
                    <Checkbox
                      label="Accept terms"
                      checked={isTermsAccepted}
                      onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                    />
                    <Radio
                      label="Select option"
                      name="option"
                      value="option1"
                      checked={selectedOption === 'option1'}
                      onChange={() => setSelectedOption('option1')}
                    />
                    <Chip label="New" variant="primary" />
                  </GridItem>
                </Grid>
              </section>

              <section className="space-y-4">
                <h2 className="col-span-full text-2xl font-bold text-[var(--content-primary)]">Navigation</h2>
                <GridItem className="col-span-full">
                  <Breadcrumbs
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Components", href: "/components" },
                      { label: "Buttons", href: "/components/buttons" }
                    ]}
                  />
                </GridItem>
                <GridItem className="col-span-full">
                  <Menu items={[
                    { label: "Profile", icon: "user" },
                    { label: "Settings", icon: "settings" },
                    { label: "Logout", icon: "logout" }
                  ]} />
                </GridItem>
              </section>

              <section className="text-center">
                <Button
                  variant="default"
                  icon="right"
                  iconName="arrow"
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Modal
                </Button>
              </section>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Welcome to Borg UI"
              >
                <p className="text-[var(--content-secondary)]">
                  This is a modal dialog showcasing the modal component.
                </p>
              </Modal>
            </div>
          </MainLayout>
        </HologramContainer>
      </div>
    </div>
  );
}

export default App;
