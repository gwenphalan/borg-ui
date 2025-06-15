import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button/button";
import { Card } from "../components/card/card";
import { TextInput } from "../components/text-input/text-input";
import { Badge } from "../components/badge/badge";
import { Table } from "../components/table/table";
import { Chip } from "../components/chip";
import { Grid, GridItem } from "../components/layout/grid";
import { ToggleButton } from "../components/button/toggle-button";
import componentsData from "../data/components.json";

interface FeaturesProps {
    styleMap: Record<string, string>;
}

export function Features({ styleMap }: FeaturesProps) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Filter components based on search and category
    const filteredComponents = componentsData.components.filter(component => {
        const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(componentsData.components.map(c => c.category)))];

    // Group components by category
    const componentsByCategory = filteredComponents.reduce((acc, component) => {
        if (!acc[component.category]) {
            acc[component.category] = [];
        }
        acc[component.category].push(component);
        return acc;
    }, {} as Record<string, typeof componentsData.components>);

    const tableColumns = [
        { key: "name", label: "Component", sortable: true },
        { key: "category", label: "Category", sortable: true },
        { key: "description", label: "Description", sortable: false },
        { key: "variants", label: "Variants", sortable: false },
        { key: "accessibility", label: "Accessibility", sortable: false },
    ];

    const tableData = filteredComponents.map(component => ({
        ...component,
        variants: component.variants.length,
        accessibility: component.accessibility
    }));

    const handleNavigate = (section: string, componentId?: string) => {
        if (section === "features") {
            navigate("/features");
        } else if (section === "documentation" || section === "docs") {
            if (componentId) {
                navigate(`/docs/${componentId}`);
            } else {
                navigate("/docs");
            }
        } else {
            navigate("/");
        }
    };

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold" style={{ color: styleMap.content_primary }}>
                    Component Library
                </h2>
                <div className="flex items-center gap-4">
                    <TextInput
                        label=""
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search components..."
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: styleMap.content_primary }}>
                    Filter by Category
                </h3>
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <ToggleButton
                            key={category}
                            styleType="primary"
                            label={category === "all" ? "All Categories" : category}
                            toggled={selectedCategory === category}
                            onToggledChange={() => setSelectedCategory(category)}
                            size="sm"
                        />
                    ))}
                </div>
            </div>

            {/* Component Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="outlined">
                    <div className="text-center space-y-2">
                        <div className="text-2xl font-bold" style={{ color: styleMap.content_primary }}>
                            {filteredComponents.length}
                        </div>
                        <div className="text-sm" style={{ color: styleMap.content_secondary }}>
                            Components Found
                        </div>
                    </div>
                </Card>
                <Card variant="outlined">
                    <div className="text-center space-y-2">
                        <div className="text-2xl font-bold" style={{ color: styleMap.content_primary }}>
                            {filteredComponents.reduce((sum, c) => sum + c.variants.length, 0)}
                        </div>
                        <div className="text-sm" style={{ color: styleMap.content_secondary }}>
                            Total Variants
                        </div>
                    </div>
                </Card>
                <Card variant="outlined">
                    <div className="text-center space-y-2">
                        <div className="text-2xl font-bold" style={{ color: styleMap.content_primary }}>
                            {Object.keys(componentsByCategory).length}
                        </div>
                        <div className="text-sm" style={{ color: styleMap.content_secondary }}>
                            Categories
                        </div>
                    </div>
                </Card>
                <Card variant="outlined">
                    <div className="text-center space-y-2">
                        <div className="text-2xl font-bold" style={{ color: styleMap.content_primary }}>
                            {filteredComponents.reduce((sum, c) => sum + c.features.length, 0)}
                        </div>
                        <div className="text-sm" style={{ color: styleMap.content_secondary }}>
                            Total Features
                        </div>
                    </div>
                </Card>
            </div>

            {/* Component Categories */}
            <div className="space-y-8">
                {Object.entries(componentsByCategory).map(([category, components]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-2xl font-semibold flex items-center gap-3" style={{ color: styleMap.content_primary }}>
                            {category}
                            <Badge variant="default">{components.length}</Badge>
                        </h3>
                        <Grid>
                            {components.map((component) => (
                                <GridItem key={component.id}>
                                    <Card
                                        variant="outlined"
                                        className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => handleNavigate("documentation", component.id)}
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xl font-semibold" style={{ color: styleMap.content_primary }}>
                                                    {component.name}
                                                </h4>
                                                <Badge variant="info">{component.variants.length} variants</Badge>
                                            </div>
                                            <p style={{ color: styleMap.content_secondary }}>
                                                {component.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {component.features.slice(0, 3).map((feature) => (
                                                    <Chip key={feature} label={feature} variant="secondary" size="sm" />
                                                ))}
                                                {component.features.length > 3 && (
                                                    <Chip label={`+${component.features.length - 3} more`} variant="default" size="sm" />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: styleMap.status_info }}></div>
                                                    <span className="text-xs" style={{ color: styleMap.content_secondary }}>
                                                        {component.accessibility}
                                                    </span>
                                                </div>
                                                <Button variant="outline-primary" size="sm">
                                                    View Documentation →
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </GridItem>
                            ))}
                        </Grid>
                    </div>
                ))}
            </div>

            {/* Component Table */}
            <Card title="All Components" variant="primary">
                <Table
                    columns={tableColumns}
                    data={tableData}
                    pageSize={10}
                />
            </Card>

            {/* TODO: Add component comparison feature */}
            {/* TODO: Add component usage analytics */}
            {/* TODO: Add component dependency graph */}
            {/* TODO: Add live component preview/playground */}
            {/* TODO: Add component export/import functionality */}
        </section>
    );
} 