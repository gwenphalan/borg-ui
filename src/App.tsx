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

function App() {
  // Example state for a controlled ToggleButton if needed for specific demos
  const [controlledToggleState, setControlledToggleState] = useState(false);
  const [controlledSwitchState, setControlledSwitchState] = useState(false);
  // Add local state for formerly uncontrolled toggles
  const [defaultToggle, setDefaultToggle] = useState(false);
  const [initiallyOnToggle, setInitiallyOnToggle] = useState(true);
  const [disabledToggleOff] = useState(false);
  const [disabledToggleOn] = useState(true);
  // State for TextInput demo
  const [textInputValue, setTextInputValue] = useState("");
  // State for dropdown demo
  const [dropdownValue, setDropdownValue] = useState("Dropdown field data");
  // State for error/warning demo
  const [errorValue, setErrorValue] = useState("");
  const [warningValue, setWarningValue] = useState("");
  // State for disabled input
  const [disabledInputValue, setDisabledInputValue] = useState("Disabled value");
  // State for char limit input
  const [charLimitValue, setCharLimitValue] = useState("");
  // State for autofill dropdown
  const [autofillDropdownValue, setAutofillDropdownValue] = useState("");
  // State for focus demo
  const [focusValue, setFocusValue] = useState("");
  // State for TextArea demo
  const [textAreaValue, setTextAreaValue] = useState("");
  const [textAreaErrorValue, setTextAreaErrorValue] = useState("");
  const [textAreaWarningValue, setTextAreaWarningValue] = useState("");
  const [textAreaDisabledValue, setTextAreaDisabledValue] = useState("Disabled value");
  // Modal demo state
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  // Dropdown demo state
  const [dropdownSelected, setDropdownSelected] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [multiSelectDropdownOpen, setMultiSelectDropdownOpen] = useState(false);
  const [multiSelectDropdown, setMultiSelectDropdown] = useState<string[]>([]);
  const dropdownOptions: DropdownOption[] = [
    { value: 'option1', label: 'Option 1', icon: 'check' },
    { value: 'option2', label: 'Option 2' },
    { isSeparator: true },
    { value: 'option3', label: 'Option 3 (Disabled)', icon: 'error-state', disabled: true },
    { value: 'option4', label: 'Another Option' },
  ];
  // State for removable badge demo
  const [showRemovable, setShowRemovable] = useState(true);
  const [showRemovablePill, setShowRemovablePill] = useState(true);
  // Table demo state
  const [tableFilter, setTableFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const tableData = [
    { name: "Albert Flores", state: "Tag", stateType: "success", social: "facebook", date: "5/19/12" },
    { name: "Jane Cooper", state: "Tag", stateType: "success", social: "facebook", date: "10/6/13" },
    { name: "Dianne Russell", state: "Tag", stateType: "error", social: "twitter", date: "12/10/13" },
    { name: "Floyd Miles", state: "Tag", stateType: "success", social: "twitter", date: "2/11/12" },
    { name: "Esther Howard", state: "Tag", stateType: "error", social: "twitter", date: "8/16/13" },
    { name: "Jerome Bell", state: "Tag", stateType: "error", social: "facebook", date: "8/21/15" },
  ];

  // Example menu items for demonstration
  const menuItems: MenuItem[] = [
    {
      label: "Home",
      href: "/",
      isActive: true,
      icon: <Icon name="check" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Features",
      children: [
        { label: "Feature A", href: "/features/a" },
        { label: "Feature B", href: "/features/b" },
        { label: "-", divider: true },
        { label: "Feature C (Disabled)", disabled: true },
      ],
      icon: <Icon name="arrow" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Docs",
      href: "/docs",
      icon: <Icon name="arrow" size={18} color="var(--content-secondary)" />,
    },
    {
      label: "Account",
      align: "right",
      children: [
        { label: "Profile", href: "/profile" },
        { label: "Settings", href: "/settings" },
        { label: "-", divider: true },
        { label: "Logout", onClick: () => alert("Logged out") },
      ],
    },
    {
      label: "Help",
      href: "/help",
      align: "right",
    },
  ];

  const verticalMenuItems: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", isActive: true },
    { label: "Projects", href: "/projects" },
    {
      label: "Team",
      children: [
        { label: "Members", href: "/team/members" },
        { label: "Invite", href: "/team/invite" },
      ],
    },
    { label: "-", divider: true },
    { label: "Settings", href: "/settings" },
  ];

  // Handler for multi-select
  const handleMultiSelectChange = (val: string | string[]) => {
    if (Array.isArray(val)) setMultiSelectDropdown(val);
  };

  function handleSelectAction() {
    const names = selectedRows.map((i) => tableData[i]?.name).join(", ");
    alert(`Selected: ${names || "None"}`);
  }

  // Add state for DatePicker demo at the top of App
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [multiDates, setMultiDates] = useState<Date[]>([]);

  // Add state for TimePicker demo
  const [basicTime, setBasicTime] = useState<Date | null>(null);
  const [twelveHourTime, setTwelveHourTime] = useState<Date | null>(null);
  const [secondsTime, setSecondsTime] = useState<Date | null>(null);
  const [stepTime, setStepTime] = useState<Date | null>(null);
  const [minMaxTime, setMinMaxTime] = useState<Date | null>(null);
  const [errorTime, setErrorTime] = useState<Date | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen text-[var(--text-light)]">
      <WarpSpeedBackground />
      <HologramContainer>
        <h1 className="text-3xl font-bold mb-4">UI Component Showcase</h1>

        {/* Avatar Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Avatar Component Demo</h2>
          <div className="flex gap-6 items-center mb-6">
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" initials="JD" status="online" size="md" />
            <Avatar initials="AB" status="busy" size="sm" />
            <Avatar src="broken-link.jpg" initials="XY" status="offline" size="lg" />
            <Avatar initials="CD" status="away" size="md" rounded={false} />
          </div>
        </section>

        {/* Badge / Pill Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Badge / Pill Component Demo</h2>
          <div className="flex gap-4 items-center mb-6 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge pill>Default Pill</Badge>
            <Badge variant="info" pill>Info Pill</Badge>
            <Badge variant="success" pill>Success Pill</Badge>
            <Badge variant="warning" pill>Warning Pill</Badge>
            <Badge variant="error" pill>Error Pill</Badge>
            {/* Removable examples */}
            {showRemovable && (
              <Badge removable onRemove={() => setShowRemovable(false)}>
                Removable
              </Badge>
            )}
            {showRemovablePill && (
              <Badge pill removable variant="info" onRemove={() => setShowRemovablePill(false)}>
                Removable Pill
              </Badge>
            )}
          </div>
        </section>

        {/* Menu Component Examples */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Menu Bar (Horizontal, with left/right groups, dropdowns, custom, etc.)</h2>
          <Menu items={menuItems} />
        </section>
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Menu (Vertical Example)</h2>
          <div className="w-64">
            <Menu items={verticalMenuItems} orientation="vertical" />
          </div>
        </section>

        {/* Regular Buttons */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Buttons</h2>
          <div className="flex flex-col gap-4">
            {(['primary', 'secondary', 'destructive', 'info', 'warn'] as const).map((style) => (
              <div key={style} className="flex gap-4 items-center">
                <Button styleType={style} icon="left" iconName="arrow" label={`${style.charAt(0).toUpperCase() + style.slice(1)} Left`} />
                <Button styleType={style} icon="right" iconName="check">{`${style.charAt(0).toUpperCase() + style.slice(1)} Right`}</Button>
                <Button styleType={style} icon="off">{`${style.charAt(0).toUpperCase() + style.slice(1)} No Icon`}</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Icon-Only Buttons */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Icon-Only Buttons</h2>
          <div className="flex gap-4 items-center">
            {(['primary', 'secondary', 'destructive', 'info', 'warn'] as const).map((style) => (
              <Button key={style} styleType={style} icon="left" iconName="check" />
            ))}
          </div>
        </section>

        {/* Toggle Buttons */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Interactive Toggle Buttons</h2>
          <div className="flex flex-col gap-4">
            {(['primary', 'secondary', 'destructive', 'info', 'warn'] as const).map((style) => (
              <div key={style} className="flex gap-4 items-center">
                <ToggleButton styleType={style} icon="left" iconName="arrow" label={`${style.charAt(0).toUpperCase() + style.slice(1)} Toggle Left`} defaultToggled={style === 'primary'} />
                <ToggleButton styleType={style} icon="right" iconName="check" label={`${style.charAt(0).toUpperCase() + style.slice(1)} Toggle Right`} />
                <ToggleButton styleType={style} icon="off" label={`${style.charAt(0).toUpperCase() + style.slice(1)} Toggle No Icon`} defaultToggled={style === 'secondary'} />
              </div>
            ))}
          </div>
        </section>

        {/* Icon-Only Toggle Buttons */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Icon-Only Toggle Buttons</h2>
          <div className="flex gap-4 items-center">
            {(['primary', 'secondary', 'destructive', 'info', 'warn'] as const).map((style) => (
              <ToggleButton key={style} styleType={style} icon="left" iconName="check" defaultToggled={style === 'primary' || style === 'info'} />
            ))}
          </div>
          {/* Example of a controlled toggle button, if you still want to demonstrate that */}
          <div className="flex gap-4 items-center mt-4">
            <p className="text-sm">Controlled Example:</p>
            <ToggleButton
              styleType="primary"
              icon="left"
              iconName="arrow"
              label={`Controlled: ${controlledToggleState ? 'ON' : 'OFF'}`}
              toggled={controlledToggleState}
              onToggledChange={setControlledToggleState}
            />
          </div>
        </section>

        {/* Standalone Icons */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Standalone Icons</h2>
          <div className="flex gap-4 items-center">
            <Icon name="arrow" size={32} color="#00FF9F" />
            <Icon name="check" size={32} color="#FF3264" />
            <Icon name="toggle" size={32} color="#8888FF" />
          </div>
        </section>

        {/* Dropdown Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Dropdown Component Demo</h2>
          <div className="flex flex-col gap-4 w-64">
            <Dropdown
              label="My Dropdown"
              options={dropdownOptions}
              value={dropdownSelected}
              onChange={val => typeof val === 'string' && setDropdownSelected(val)}
              isOpen={dropdownOpen}
              onOpenChange={setDropdownOpen}
              placeholder="Select an option..."
              fullWidth={false}
              buttonClassName="w-64"
            />
            <p className="mt-2 text-content-primary">Selected: {dropdownSelected || 'None'}</p>
            <Dropdown
              label="Multi-Select Dropdown"
              options={dropdownOptions}
              value={multiSelectDropdown}
              onChange={handleMultiSelectChange}
              isOpen={multiSelectDropdownOpen}
              onOpenChange={setMultiSelectDropdownOpen}
              placeholder="Select option(s)..."
              fullWidth={false}
              buttonClassName="w-64"
              multiSelect={true}
            />
            <p className="mt-2 text-content-primary">Multi-Selected: {multiSelectDropdown.length ? multiSelectDropdown.join(', ') : 'None'}</p>
          </div>
        </section>

        {/* Modal Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Modal Component Demo</h2>
          <div className="flex gap-4 mb-4">
            <Button styleType="primary" onClick={() => setIsBasicModalOpen(true)}>
              Open Basic Modal
            </Button>
            <Button styleType="info" onClick={() => setIsStatusModalOpen(true)}>
              Open Info Status Modal
            </Button>
            <Button styleType="secondary" onClick={() => setIsCustomModalOpen(true)}>
              Open Custom Icon Modal
            </Button>
          </div>
          <Modal
            isOpen={isBasicModalOpen}
            onClose={() => setIsBasicModalOpen(false)}
            title="Basic Modal"
            actions={[
              {
                label: "Close",
                onClick: () => setIsBasicModalOpen(false),
                style: "primary",
                iconName: "check",
                iconPosition: "left",
                autoFocus: true,
              },
            ]}
          >
            This is a basic modal. You can put any content here.
          </Modal>
          <Modal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            title="Status Modal"
            status="info"
            actions={[
              {
                label: "OK",
                onClick: () => setIsStatusModalOpen(false),
                style: "info",
                iconName: "info-state",
                iconPosition: "left",
                autoFocus: true,
              },
            ]}
          >
            This modal uses the <b>info</b> status and shows a status icon.
          </Modal>
          <Modal
            isOpen={isCustomModalOpen}
            onClose={() => setIsCustomModalOpen(false)}
            title="Custom Icon Modal"
            icon="toggle"
            actions={[
              {
                label: "Cancel",
                onClick: () => setIsCustomModalOpen(false),
                style: "secondary",
                iconName: "chevron-down",
                iconPosition: "left",
              },
              {
                label: "Confirm",
                onClick: () => setIsCustomModalOpen(false),
                style: "primary",
                iconName: "check",
                iconPosition: "right",
                autoFocus: true,
              },
            ]}
          >
            This modal uses a custom icon and has two actions.
          </Modal>
        </section>

        {/* Toggle Switch Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Toggle Switch</h2>
          <div className="flex flex-col gap-4 items-start">
            <div>
              <p className="mb-1">Default Toggle (uncontrolled):</p>
              <Toggle checked={defaultToggle} onToggle={setDefaultToggle} />
            </div>
            <div>
              <p className="mb-1">Initially On Toggle (uncontrolled):</p>
              <Toggle checked={initiallyOnToggle} onToggle={setInitiallyOnToggle} />
            </div>
            <div>
              <p className="mb-1">Disabled Toggle (off):</p>
              <Toggle checked={disabledToggleOff} disabled={true} onToggle={() => { }} />
            </div>
            <div>
              <p className="mb-1">Disabled Toggle (on):</p>
              <Toggle checked={disabledToggleOn} disabled={true} onToggle={() => { }} />
            </div>
            <div>
              <p className="mb-1">Controlled Toggle:</p>
              <Toggle
                checked={controlledSwitchState}
                onToggle={(newState) => {
                  console.log("Controlled toggle new state:", newState);
                  setControlledSwitchState(newState);
                }}
              />
              <p className="text-sm mt-1">Current controlled state: {controlledSwitchState ? "ON" : "OFF"}</p>
            </div>
          </div>
        </section>

        {/* Checkbox Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Checkbox</h2>
          <div className="flex flex-col gap-4 items-start">
            <CheckboxDemo />
          </div>
        </section>

        {/* Radio Button Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Radio Button</h2>
          <div className="flex flex-col gap-4 items-start">
            <RadioDemo />
          </div>
        </section>

        {/* Text Input Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Text Input</h2>
          <div className="flex flex-col gap-4 w-[400px]">
            {/* Basic controlled text input */}
            <TextInput
              label="Demo Label"
              value={textInputValue}
              onChange={setTextInputValue}
              placeholder="Type here..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1">Current value: {textInputValue}</p>

            {/* Dropdown example */}
            <TextInput
              label="Dropdown Label"
              value={dropdownValue}
              onChange={setDropdownValue}
              dropdownOptions={["Option 1", "Option 2", "Option 3"]}
              placeholder="Select an option..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1">Dropdown value: {dropdownValue}</p>

            {/* Error state example */}
            <TextInput
              label="Error State"
              value={errorValue}
              onChange={setErrorValue}
              error
              placeholder="Error input..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1 text-[var(--status-error)]">Error state value: {errorValue}</p>

            {/* Warning state example */}
            <TextInput
              label="Warning State"
              value={warningValue}
              onChange={setWarningValue}
              warning
              placeholder="Warning input..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1 text-[var(--status-warning)]">Warning state value: {warningValue}</p>

            {/* Disabled input example */}
            <TextInput
              label="Disabled Input"
              value={disabledInputValue}
              onChange={setDisabledInputValue}
              disabled
              placeholder="Disabled..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1 opacity-50">Disabled value: {disabledInputValue}</p>

            {/* Character limit example */}
            <TextInput
              label="Character Limit (10)"
              value={charLimitValue}
              onChange={setCharLimitValue}
              maxLength={10}
              placeholder="Max 10 chars..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1">Char limit value: {charLimitValue}</p>

            {/* Dropdown with autofill */}
            <TextInput
              label="Dropdown Autofill"
              value={autofillDropdownValue}
              onChange={setAutofillDropdownValue}
              dropdownOptions={["lorem ipsum",
                "dolor sit",
                "amet consectetur"]}
              autoComplete="on"
              placeholder="Start typing..."
              className="w-[400px]"
            />
            <p className="text-sm mt-1">Autofill dropdown value: {autofillDropdownValue}</p>

            {/* Focused input outline demo */}
            <TextInput
              label="Focus Outline Demo"
              value={focusValue}
              onChange={setFocusValue}
              placeholder="Focus me..."
              className="w-[400px]"
            />

            {/* Email input with validation */}
            <EmailInputDemo />

            {/* Password input with standards */}
            <PasswordInputDemo />
          </div>
        </section>

        {/* Text Area Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Text Area</h2>
          <div className="flex flex-col gap-4 w-[400px]">
            {/* Basic controlled text area */}
            <TextArea
              label="Demo TextArea"
              value={textAreaValue}
              onChange={setTextAreaValue}
              placeholder="Type here..."
              lineHeight={4}
              maxLength={100}
              className="w-[400px]"
            />
            <p className="text-sm mt-1">Current value: {textAreaValue}</p>

            {/* Error state example */}
            <TextArea
              label="Error State"
              value={textAreaErrorValue}
              onChange={setTextAreaErrorValue}
              error
              placeholder="Error textarea..."
              lineHeight={3}
              maxLength={50}
              errorMessage="This is an error message."
              className="w-[400px]"
            />
            <p className="text-sm mt-1 text-[var(--status-error)]">Error state value: {textAreaErrorValue}</p>

            {/* Warning state example */}
            <TextArea
              label="Warning State"
              value={textAreaWarningValue}
              onChange={setTextAreaWarningValue}
              warning
              placeholder="Warning textarea..."
              lineHeight={3}
              maxLength={50}
              warningMessage="This is a warning message."
              className="w-[400px]"
            />
            <p className="text-sm mt-1 text-[var(--status-warning)]">Warning state value: {textAreaWarningValue}</p>

            {/* Disabled textarea example */}
            <TextArea
              label="Disabled TextArea"
              value={textAreaDisabledValue}
              onChange={setTextAreaDisabledValue}
              disabled
              placeholder="Disabled..."
              lineHeight={3}
              maxLength={50}
              className="w-[400px]"
            />
            <p className="text-sm mt-1 opacity-50">Disabled value: {textAreaDisabledValue}</p>

            {/* Test: long word in input */}
            <TextInput
              label="Long Word Test"
              value={charLimitValue}
              onChange={setCharLimitValue}
              maxLength={100}
              placeholder="Paste a long word here..."
              className="w-[400px]"
            />
            <TextArea
              label="Long Word Test (TextArea)"
              value={textAreaValue}
              onChange={setTextAreaValue}
              lineHeight={3}
              maxLength={100}
              placeholder="Paste a long word here..."
              className="w-[400px]"
            />
          </div>
        </section>

        {/* Accordion Component */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Accordion</h2>
          <Accordion
            items={[
              { title: "Accordion Item 1", content: "This is the content for item 1." },
              { title: "Accordion Item 2", content: "This is the content for item 2." },
              { title: "Accordion Item 3", content: "This is the content for item 3." },
            ]}
          />
        </section>

        {/* Tooltip Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Tooltip Component Demo</h2>
          <div className="flex gap-8 items-center mb-6 flex-wrap">
            <Tooltip content="This is a tooltip!">
              <button className="px-4 py-2 rounded bg-[var(--content-primary)] text-[var(--background-default)]">Hover me (top)</button>
            </Tooltip>
            <Tooltip content="Tooltip on the right" placement="right">
              <span className="inline-block px-4 py-2 rounded bg-[var(--content-secondary)] text-[var(--background-default)]">Right</span>
            </Tooltip>
            <Tooltip content="Tooltip on the left" placement="left">
              <span className="inline-block px-4 py-2 rounded bg-[var(--status-info)] text-[var(--background-default)]">Left</span>
            </Tooltip>
            <Tooltip content={<span>Custom <b>JSX</b> content</span>} placement="bottom">
              <span className="inline-block px-4 py-2 rounded bg-[var(--status-warning)] text-[var(--background-default)]">Bottom</span>
            </Tooltip>
            <Tooltip content="Disabled tooltip" disabled>
              <span className="inline-block px-4 py-2 rounded bg-[var(--border-default)] text-[var(--content-primary)] opacity-60 cursor-not-allowed">Disabled</span>
            </Tooltip>
          </div>
        </section>

        {/* Table Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Table Component Demo</h2>
          <Table
            columns={[
              { key: "name", label: "User", sortable: true, align: "left" },
              { key: "state", label: "State", sortable: false, align: "center", render: (row) => <Badge pill variant={row.stateType === "success" ? "success" : "error"}>{row.state}</Badge> },
              { key: "social", label: "Social", sortable: false, align: "left", render: (row) => <a href="#" className="text-blue-700 underline font-medium">{row.social}</a> },
              { key: "date", label: "Date", sortable: true, align: "right" },
            ]}
            data={tableData}
            pageSize={4}
            filterText={tableFilter}
            onFilterTextChange={setTableFilter}
            showPagination={true}
            className="mb-8"
            selectable
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
          />
          <button
            className="mt-2 px-4 py-2 rounded bg-[var(--content-primary)] text-[var(--background-default)] font-semibold"
            onClick={handleSelectAction}
            type="button"
          >
            Do something with selected
          </button>
        </section>

        {/* Breadcrumbs Component Demo */}
        <section className="w-full mb-6">
          <h2 className="text-xl font-semibold mb-3">Breadcrumbs Component Demo</h2>
          <Breadcrumbs
            className="bg-[var(--background-elevated)] border border-[var(--border-default)]"
            items={[
              {
                label: "Home",
                href: "/",
                icon: <Icon name="home" size={16} color="var(--content-primary)" />,
              },
              {
                label: "Library",
                href: "/library",
                icon: <Icon name="chevron-right" size={16} color="var(--content-secondary)" />,
              },
              {
                label: "Data",
                icon: <Icon name="chevron-right" size={16} color="var(--content-secondary)" />,
              },
            ]}
          />
        </section>

        {/* Card Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Card Component Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card
              title="Default Card"
              subtitle="This is a subtitle."
              actions={<Button>Action</Button>}
            >
              This is a basic card with a title, subtitle, and actions.
            </Card>
            <Card
              title="Card with Image"
              subtitle="With a thumbnail image."
              image={placeholderSvg}
              actions={<Button>Read More</Button>}
            >
              This card displays an image at the top.
            </Card>
            <Card
              title="Primary Variant"
              subtitle="Primary style."
              variant="primary"
              actions={<Button styleType="info">Info</Button>}
            >
              This card uses the primary variant for accent.
            </Card>
            <Card
              title="Outlined Variant"
              subtitle="Outlined style."
              variant="outlined"
              actions={<Button styleType="warn">Warn</Button>}
            >
              This card uses the outlined variant.
            </Card>
            <Card
              title="Clickable Card"
              subtitle="Click me!"
              clickable
              onClick={() => alert("Card clicked!")}
            >
              The entire card is clickable and accessible.
            </Card>
            <Card
              title="Disabled Card"
              subtitle="Not interactive."
              disabled
              actions={<Button disabled>Disabled</Button>}
            >
              This card is disabled and cannot be interacted with.
            </Card>
          </div>
        </section>

        {/* Chip/Tag Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">Chip/Tag Component Demo</h2>
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <Chip label="Default" />
            <Chip label="Primary" variant="primary" />
            <Chip label="Info" variant="info" />
            <Chip label="Warning" variant="warning" />
            <Chip label="Error" variant="error" />
            <Chip label="Small" size="sm" />
            <Chip label="Large" size="lg" />
            <Chip label="With Icon" icon={<Icon name="info-state" size={16} />} />
            <Chip label="Leading" leading={<Icon name="profile" size={16} />} />
            <Chip label="Trailing" trailing={<Icon name="arrow" size={16} />} />
            <Chip label="Clickable" clickable onClick={() => alert("Chip clicked!")} />
            <Chip label="Disabled" disabled />
            <ClosableChipDemo />
          </div>
        </section>

        {/* DatePicker Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">DatePicker Component Demo</h2>
          <div className="flex flex-col gap-6 mb-6 w-[350px]">
            <DatePicker
              label="Single Date"
              value={singleDate}
              onChange={val => setSingleDate(val instanceof Date ? val : null)}
              placeholder="Pick a date"
              clearable
              helperText="Select a single date."
            />
            <DatePicker
              label="Date Range"
              value={dateRange}
              onChange={val => Array.isArray(val) && val.length === 2 && val[0] instanceof Date && val[1] instanceof Date ? setDateRange([val[0], val[1]]) : setDateRange(null)}
              pickerType="range"
              placeholder="Pick a date range"
              clearable
              helperText="Select a start and end date."
            />
            <DatePicker
              label="Multiple Dates"
              value={multiDates}
              onChange={(val) => {
                if (Array.isArray(val)) {
                  const filteredDates = val.filter((d): d is Date => d instanceof Date);
                  setMultiDates(filteredDates as Date[]);
                } else {
                  setMultiDates([]);
                }
              }}
              pickerType="multiple"
              placeholder="Pick multiple dates"
              clearable
              helperText="Select one or more dates."
            />
            <DatePicker
              label="Disabled"
              value={null}
              onChange={() => { }}
              disabled
              placeholder="Disabled"
            />
            <DatePicker
              label="Error State"
              value={singleDate}
              onChange={val => setSingleDate(val instanceof Date ? val : null)}
              error
              helperText="This is an error message."
            />
          </div>
        </section>

        {/* TimePicker Component Demo */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-3">TimePicker Component Demo</h2>
          <div className="flex flex-col gap-6 mb-6 w-[350px]">
            {/* Basic TimePicker */}
            <TimePicker
              label="Basic Time"
              value={basicTime}
              onChange={val => setBasicTime(val instanceof Date ? val : null)}
              placeholder="Pick a time"
              clearable
              helperText="Select a time."
            />
            <p className="text-sm mt-1">Selected: {basicTime ? basicTime instanceof Date ? basicTime.toLocaleTimeString() : String(basicTime) : 'None'}</p>

            {/* 12-hour format */}
            <TimePicker
              label="12-Hour Format"
              value={twelveHourTime}
              onChange={val => setTwelveHourTime(val instanceof Date ? val : null)}
              format="hh:mm A"
              placeholder="hh:mm AM/PM"
              clearable
              helperText="12-hour format."
            />
            <p className="text-sm mt-1">Selected: {twelveHourTime ? twelveHourTime instanceof Date ? twelveHourTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }) : String(twelveHourTime) : 'None'}</p>

            {/* With seconds */}
            <TimePicker
              label="With Seconds"
              value={secondsTime}
              onChange={val => setSecondsTime(val instanceof Date ? val : null)}
              showSeconds
              placeholder="hh:mm:ss"
              clearable
              helperText="Includes seconds."
            />
            <p className="text-sm mt-1">Selected: {secondsTime ? secondsTime instanceof Date ? secondsTime.toLocaleTimeString() : String(secondsTime) : 'None'}</p>

            {/* Step 15 minutes */}
            <TimePicker
              label="Step 15 Minutes"
              value={stepTime}
              onChange={val => setStepTime(val instanceof Date ? val : null)}
              step={15}
              placeholder="Pick a time (15 min steps)"
              clearable
              helperText="Step is 15 minutes."
            />
            <p className="text-sm mt-1">Selected: {stepTime ? stepTime instanceof Date ? stepTime.toLocaleTimeString() : String(stepTime) : 'None'}</p>

            {/* Min/Max Time */}
            <TimePicker
              label="Min/Max Time"
              value={minMaxTime}
              onChange={val => setMinMaxTime(val instanceof Date ? val : null)}
              minTime={new Date(0, 0, 0, 9, 0, 0)}
              maxTime={new Date(0, 0, 0, 17, 0, 0)}
              placeholder="09:00 - 17:00"
              clearable
              helperText="Only between 09:00 and 17:00."
            />
            <p className="text-sm mt-1">Selected: {minMaxTime ? minMaxTime instanceof Date ? minMaxTime.toLocaleTimeString() : String(minMaxTime) : 'None'}</p>

            {/* Error state */}
            <TimePicker
              label="Error State"
              value={errorTime}
              onChange={val => setErrorTime(val instanceof Date ? val : null)}
              error
              helperText="This is an error message."
            />
            <p className="text-sm mt-1 text-[var(--status-error)]">Error state value: {errorTime ? errorTime instanceof Date ? errorTime.toLocaleTimeString() : String(errorTime) : 'None'}</p>

            {/* Disabled */}
            <TimePicker
              label="Disabled"
              value={null}
              onChange={() => { }}
              disabled
              placeholder="Disabled"
            />
          </div>
        </section>
      </HologramContainer>
    </div>
  );
}

export default App;

function EmailInputDemo() {
  const [email, setEmail] = useState("");
  return (
    <div className="w-full">
      <TextInput
        label="Email Address"
        value={email}
        onChange={setEmail}
        type="email"
        placeholder="your@email.com"
        validationRules={{ required: true }}
        errorMessage="Please enter a valid email address."
        className="w-[400px]"
      />
      <p className="text-xs mt-1">Current email: {email}</p>
    </div>
  );
}

function PasswordInputDemo() {
  const [password, setPassword] = useState("");
  return (
    <div className="w-full">
      <TextInput
        label="Password"
        value={password}
        onChange={setPassword}
        type="password"
        placeholder="Enter a strong password"
        validationRules={{
          required: true,
          passwordStrength: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumber: true,
            requireSpecial: true,
          },
        }}
        errorMessage="Password must be at least 8 characters, include upper/lowercase, a number, and a special character."
        className="w-[400px]"
      />
      <p className="text-xs mt-1">Current password: {password ? '●'.repeat(password.length) : ''}</p>
    </div>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  // Indeterminate demo state
  const [indeterminate, setIndeterminate] = useState(true);
  // Cycle: indeterminate -> checked -> unchecked -> indeterminate
  function cycleIndeterminate() {
    if (indeterminate) {
      setIndeterminate(false);
      setChecked(true);
    } else if (checked) {
      setChecked(false);
    } else {
      setIndeterminate(true);
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox checked={checked} onChange={setChecked} label="Controlled Checkbox" aria-label="Example checkbox" />
        <span className="text-xs">{checked ? "Checked" : "Unchecked"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={checked2} onChange={setChecked2} label="Second Checkbox" aria-label="Second checkbox" />
        <span className="text-xs">{checked2 ? "Checked" : "Unchecked"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={indeterminate ? false : checked} indeterminate={indeterminate} onChange={() => {
          if (indeterminate) {
            setIndeterminate(false);
            setChecked(true);
          } else {
            setChecked(!checked);
          }
        }} label="Indeterminate Checkbox" aria-label="Indeterminate checkbox" />
        <span className="text-xs">{indeterminate ? "Indeterminate" : checked ? "Checked" : "Unchecked"}</span>
        <button className="ml-2 px-2 py-1 rounded bg-[var(--content-primary)] text-[var(--background-default)] text-xs" onClick={cycleIndeterminate}>Cycle State</button>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={false} indeterminate={true} onChange={() => { }} disabled label="Disabled (Indeterminate)" aria-label="Disabled indeterminate" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={true} onChange={() => { }} disabled label="Disabled (Checked)" aria-label="Disabled checked" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked={false} onChange={() => { }} disabled label="Disabled (Unchecked)" aria-label="Disabled unchecked" />
      </div>
    </div>
  );
}
export function RadioDemo() {
  const [selected, setSelected] = useState("option1");
  const [selectedNoLabel, setSelectedNoLabel] = useState<string | null>(null);

  // The Radio component's onChange now passes the value of the selected radio
  const handleRadioChange = (value: string) => {
    setSelected(value);
  };

  const handleNoLabelChange = (value: string) => {
    setSelectedNoLabel(value);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <fieldset>
        <legend className="text-sm font-medium text-[var(--content-primary)] mb-2">
          Interactive Group:
        </legend>
        <div className="flex items-center gap-6">
          <Radio
            name="interactiveGroup" // Group name
            value="option1" // Value for this radio
            checked={selected === "option1"}
            onChange={handleRadioChange}
            label="Option 1"
          // aria-label="Option 1" // Not strictly needed if label is present
          />
          <Radio
            name="interactiveGroup" // Same group name
            value="option2" // Value for this radio
            checked={selected === "option2"}
            onChange={handleRadioChange}
            label="Option 2"
          // aria-label="Option 2"
          />
          <Radio
            name="interactiveGroup" // Same group name
            value="option3" // Value for this radio
            checked={selected === "option3"}
            onChange={handleRadioChange}
            label="Option 3"
          // aria-label="Option 3"
          />
        </div>
        <p className="text-xs mt-2 text-[var(--content-secondary)]">
          Current value: <span className="font-mono">{selected}</span>
        </p>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--content-primary)] mb-2">
          States:
        </legend>
        <div className="flex items-center gap-6">
          <Radio
            name="statesGroup" // Different group or unique name
            value="disabledValue" // Needs a value
            checked={false} // Or some state if it were interactive
            onChange={() => { }} // No-op for display
            label="Disabled"
            // aria-label="Disabled"
            disabled
          />
          <Radio
            name="statesGroup" // Part of the same "states" demo group
            value="noLabelInteractive"
            checked={selectedNoLabel === "noLabelInteractive"}
            onChange={handleNoLabelChange}
            aria-label="Interactive No Label Radio" // Crucial when no visible label
          />
          <Radio
            name="statesGroup"
            value="noLabelChecked"
            checked={true} // Example of a checked no-label
            onChange={() => { }}
            aria-label="Checked No Label Radio"
          />
        </div>
        {selectedNoLabel && (
          <p className="text-xs mt-2 text-[var(--content-secondary)]">
            No-label radio selected: <span className="font-mono">{selectedNoLabel}</span>
          </p>
        )}
      </fieldset>
    </div>
  );
}

function ClosableChipDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <Chip label="Closable" closable onClose={() => setVisible(false)} />
  );
}