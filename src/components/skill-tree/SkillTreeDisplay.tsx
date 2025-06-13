'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import SkillNode, { type Skill } from './SkillNode';
import { ArrowDown, Shield, Zap, Wand, Axe, Leaf, Eye } from 'lucide-react'; // Example icons
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for skills
const initialSkills: Skill[] = [
  { id: 'combat_basics', name: 'Combat Basics', description: 'Fundamental combat training.', icon: Axe, tier: 1, isUnlocked: true, cost: 1 },
  { id: 'sword_mastery_1', name: 'Sword Mastery I', description: 'Basic proficiency with swords.', icon: Axe, tier: 2, dependencies: ['combat_basics'], cost: 2 },
  { id: 'shield_proficiency', name: 'Shield Proficiency', description: 'Learn to effectively use shields.', icon: Shield, tier: 2, dependencies: ['combat_basics'], cost: 2 },
  { id: 'swift_strike', name: 'Swift Strike', description: 'A quick, less powerful attack.', icon: Zap, tier: 3, dependencies: ['sword_mastery_1'], cost: 3 },
  { id: 'power_attack', name: 'Power Attack', description: 'A slow but powerful attack.', icon: Axe, tier: 3, dependencies: ['sword_mastery_1'], cost: 3 },
  { id: 'fortress_stance', name: 'Fortress Stance', description: 'Improve defensive capabilities with a shield.', icon: Shield, tier: 3, dependencies: ['shield_proficiency'], cost: 3 },

  { id: 'magic_initiate', name: 'Magic Initiate', description: 'Introduction to the arcane arts.', icon: Wand, tier: 1, isUnlocked: true, cost: 1 },
  { id: 'fireball', name: 'Fireball', description: 'Hurl a flaming projectile.', icon: Wand, tier: 2, dependencies: ['magic_initiate'], cost: 2 },
  { id: 'ice_shard', name: 'Ice Shard', description: 'Launch a piercing shard of ice.', icon: Wand, tier: 2, dependencies: ['magic_initiate'], cost: 2 },
  { id: 'arcane_bolt', name: 'Arcane Bolt', description: 'A basic magical attack.', icon: Zap, tier: 3, dependencies: ['fireball'], cost: 3 },

  { id: 'survival_basics', name: 'Survival Basics', description: 'Learn the fundamentals of surviving in the wild.', icon: Leaf, tier: 1, cost: 1 },
  { id: 'herbalism', name: 'Herbalism', description: 'Identify and gather common herbs.', icon: Leaf, tier: 2, dependencies: ['survival_basics'], cost: 2 },
  { id: 'tracking', name: 'Tracking', description: 'Learn to track creatures and people.', icon: Eye, tier: 2, dependencies: ['survival_basics'], cost: 2 },
];

const SkillTreeDisplay: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [filter, setFilter] = useState<string>("all"); // "all", "combat", "magic", "survival"

  const handleUnlockSkill = (skillId: string) => {
    setSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.id === skillId ? { ...skill, isUnlocked: true } : skill
      )
    );
    // Here you would typically also deduct skill points, check dependencies etc.
  };

  const maxTier = useMemo(() => Math.max(...skills.map(s => s.tier)), [skills]);

  const filteredSkills = useMemo(() => {
    if (filter === "all") return skills;
    return skills.filter(skill => {
      if (filter === "combat") return skill.id.startsWith("combat_") || skill.id.includes("sword") || skill.id.includes("shield") || skill.id.includes("attack");
      if (filter === "magic") return skill.id.startsWith("magic_") || skill.id.includes("fireball") || skill.id.includes("ice_shard") || skill.id.includes("arcane");
      if (filter === "survival") return skill.id.startsWith("survival_") || skill.id.includes("herbalism") || skill.id.includes("tracking");
      return true;
    });
  }, [skills, filter]);


  const tiers: Skill[][] = [];
  for (let i = 1; i <= maxTier; i++) {
    tiers.push(filteredSkills.filter(skill => skill.tier === i));
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="combat">Combat</SelectItem>
            <SelectItem value="magic">Magic</SelectItem>
            <SelectItem value="survival">Survival</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tiers.map((tierSkills, index) => (
        tierSkills.length > 0 && (
          <div key={`tier-${index + 1}`} className="relative">
            <h2 className="text-2xl font-headline text-primary mb-4">Tier {index + 1}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tierSkills.map(skill => (
                <SkillNode key={skill.id} skill={skill} onUnlock={handleUnlockSkill} />
              ))}
            </div>
            {index < tiers.length -1 && tiers[index+1].length > 0 && (
              <div className="flex justify-center mt-6">
                <ArrowDown className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
            )}
          </div>
        )
      ))}
      {filteredSkills.length === 0 && (
        <p className="text-muted-foreground text-center py-10">No skills in this category.</p>
      )}
    </div>
  );
};

export default SkillTreeDisplay;
