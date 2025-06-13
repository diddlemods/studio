import PageHeader from '@/components/PageHeader';
import CraftingInterface from '@/components/crafting/CraftingInterface';

export default function CraftingPage() {
  return (
    <div>
      <PageHeader
        title="Advanced Crafting System"
        description="Discover recipes, gather materials, and craft powerful items and potent alchemical concoctions."
      />
      <CraftingInterface />
    </div>
  );
}
