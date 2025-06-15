import { Button } from "../components/button/button";
import { Card } from "../components/card/card";
import { Badge } from "../components/badge/badge";
import { Avatar } from "../components/avatar/avatar";
import { Chip } from "../components/chip";
import { Grid, GridItem } from "../components/layout/grid";
import siteInfo from "../data/site-info.json";
import { useNavigate } from "react-router-dom";

interface HomeProps {
    styleMap: Record<string, string>;
}

export function Home({ styleMap }: HomeProps) {
    const navigate = useNavigate();

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
        <section className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold font-orbitron" style={{ color: styleMap.content_primary }}>
                        {siteInfo.site.name}
                    </h1>
                    <p className="text-2xl font-medium" style={{ color: styleMap.text_light }}>
                        {siteInfo.site.tagline}
                    </p>
                    <p className="text-lg max-w-4xl mx-auto leading-relaxed" style={{ color: styleMap.content_secondary }}>
                        {siteInfo.site.description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <Badge variant="info">v{siteInfo.site.version}</Badge>
                    <Badge variant="success">{siteInfo.stats.components} Components</Badge>
                    <Badge variant="warning">{siteInfo.stats.variants} Variants</Badge>
                    <Badge variant="default">MIT License</Badge>
                </div>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button variant="primary" size="lg" onClick={() => handleNavigate("features")}>
                        Explore Components
                    </Button>
                    <Button variant="outline-primary" size="lg" onClick={() => handleNavigate("documentation")}>
                        View Documentation
                    </Button>
                </div>
            </div>

            {/* Author Section */}
            <Card title="Meet the Creator" variant="primary">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        <Avatar
                            src={siteInfo.author.avatar}
                            alt={siteInfo.author.name}
                            size="lg"
                            status="online"
                        />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold" style={{ color: styleMap.content_primary }}>
                                {siteInfo.author.name}
                            </h3>
                            <p className="text-lg" style={{ color: styleMap.content_secondary }}>
                                {siteInfo.author.title}
                            </p>
                        </div>
                        <p className="text-base leading-relaxed" style={{ color: styleMap.text_light }}>
                            {siteInfo.author.bio}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {siteInfo.author.skills.map((skill) => (
                                <Chip key={skill} label={skill} variant="primary" />
                            ))}
                        </div>
                        {/* TODO: Add social media links with proper icons */}
                        <div className="flex gap-4 pt-2">
                            <Button variant="outline-primary" size="sm">
                                GitHub →
                            </Button>
                            <Button variant="outline-primary" size="sm">
                                Portfolio →
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Key Features Grid */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center" style={{ color: styleMap.content_primary }}>
                    Why Choose Borg UI?
                </h2>
                <Grid>
                    {siteInfo.features.map((feature, index) => (
                        <GridItem key={index}>
                            <Card variant="outlined" className="h-full">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full" style={{ backgroundColor: styleMap.interactive_accentfocus }}>
                                            <div className="w-6 h-6" style={{ color: styleMap.background_default }}>
                                                ⚡
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold" style={{ color: styleMap.content_primary }}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p style={{ color: styleMap.content_secondary }}>
                                        {feature.description}
                                    </p>
                                    {/* TODO: Add interactive demos for each feature */}
                                </div>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                    <div className="text-4xl font-bold font-orbitron" style={{ color: styleMap.content_primary }}>
                        {siteInfo.stats.components}
                    </div>
                    <div style={{ color: styleMap.content_secondary }}>Components</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-4xl font-bold font-orbitron" style={{ color: styleMap.content_primary }}>
                        {siteInfo.stats.variants}
                    </div>
                    <div style={{ color: styleMap.content_secondary }}>Variants</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-4xl font-bold font-orbitron" style={{ color: styleMap.content_primary }}>
                        {siteInfo.stats.sizes}
                    </div>
                    <div style={{ color: styleMap.content_secondary }}>Sizes</div>
                </div>
                <div className="text-center space-y-2">
                    <div className="text-4xl font-bold font-orbitron" style={{ color: styleMap.content_primary }}>
                        {siteInfo.stats.features}
                    </div>
                    <div style={{ color: styleMap.content_secondary }}>Features</div>
                </div>
            </div>

            {/* TODO: Add testimonials section */}
            {/* TODO: Add getting started quick guide */}
            {/* TODO: Add live component playground */}
        </section>
    );
} 