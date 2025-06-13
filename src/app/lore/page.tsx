
import PageHeader from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealWorldResearchSection from '@/components/lore/RealWorldResearchSection';
import MythologicalDatabaseSection from '@/components/lore/MythologicalDatabaseSection';
import WorldElementBuilderSection from '@/components/lore/WorldElementBuilderSection';

export default function LoreGenerationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="AI-Assisted Lore Generation"
        description="Craft detailed lore for your world with AI-powered tools for research, entity creation, and world-building."
      />
      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="research">Real-World Research</TabsTrigger>
          <TabsTrigger value="mythology">Mythological Entries</TabsTrigger>
          <TabsTrigger value="worldbuilding">World Element Builder</TabsTrigger>
        </TabsList>
        <TabsContent value="research">
          <RealWorldResearchSection />
        </TabsContent>
        <TabsContent value="mythology">
          <MythologicalDatabaseSection />
        </TabsContent>
        <TabsContent value="worldbuilding">
          <WorldElementBuilderSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
