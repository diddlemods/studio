import PageHeader from '@/components/PageHeader';
import SkillTreeDisplay from '@/components/skill-tree/SkillTreeDisplay';

export default function SkillTreePage() {
  return (
    <div>
      <PageHeader
        title="Interactive Skill Tree"
        description="Visualize dependencies and plan your character's progression through various skills."
      />
      <SkillTreeDisplay />
    </div>
  );
}
