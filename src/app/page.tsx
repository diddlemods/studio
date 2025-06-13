import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Swords, Trees, Network, FlaskConical, Coins, Settings2 } from "lucide-react";

const features = [
  {
    title: "Dynamic Quest Generation",
    description: "Generate quests using game lore and player progression, with dynamically-adjusting narratives.",
    href: "/quests",
    icon: Swords,
    ai: true,
  },
  {
    title: "AI Environmental Storytelling",
    description: "Generate real-time environmental storytelling with AI agents reacting to the game world.",
    href: "/storytelling",
    icon: Trees,
    ai: true,
  },
  {
    title: "Interactive Skill Tree",
    description: "Visualize skill dependencies and plan progression with an interactive skill-tree display.",
    href: "/skill-tree",
    icon: Network,
  },
  {
    title: "Advanced Crafting System",
    description: "Explore recipe discovery and complex material interactions in a core crafting and alchemy system.",
    href: "/crafting",
    icon: FlaskConical,
  },
  {
    title: "Player-Driven Economy",
    description: "Simulate a dynamic economy with supply, demand, and player-set prices.",
    href: "/economy",
    icon: Coins,
  },
  {
    title: "Customizable UI",
    description: "Modular UI system allowing for customization of information displays for usability.",
    href: "/settings",
    icon: Settings2,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-headline font-bold mb-4 text-primary">Welcome to Mimir's Echo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered toolkit for crafting immersive RPG experiences. Explore dynamic content generation, intricate game systems, and more.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-2">
                <feature.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
              </div>
              {feature.ai && (
                <span className="inline-block bg-accent/20 text-accent px-2 py-0.5 text-xs font-medium rounded-full">GenAI Powered</span>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-base text-card-foreground/80">
                {feature.description}
              </CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full group">
                  Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <footer className="text-center mt-16 py-8 border-t border-border">
        <p className="text-muted-foreground">Mimir's Echo &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
