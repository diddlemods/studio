import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { Lock, Unlock } from 'lucide-react';

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon; // Optional: LucideIcon or custom SVG component
  tier: number;
  dependencies?: string[];
  isUnlocked?: boolean;
  cost?: number;
}

interface SkillNodeProps {
  skill: Skill;
  onUnlock?: (skillId: string) => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({ skill, onUnlock }) => {
  const IconComponent = skill.icon;
  return (
    <Card className={`relative shadow-md hover:shadow-lg transition-shadow duration-200 ${skill.isUnlocked ? 'border-primary' : 'border-border'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            {IconComponent && <IconComponent className={`w-5 h-5 ${skill.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />}
            {skill.name}
          </CardTitle>
          {skill.cost && <span className="text-xs font-semibold text-primary">{skill.cost} SP</span>}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-2 h-16 overflow-y-auto custom-scrollbar">
          {skill.description}
        </CardDescription>
        {onUnlock && !skill.isUnlocked && (
          <button
            onClick={() => onUnlock(skill.id)}
            className="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 p-1 rounded-md flex items-center justify-center gap-1"
          >
            <Lock size={12} /> Unlock
          </button>
        )}
        {skill.isUnlocked && (
           <div className="text-xs text-green-400 flex items-center gap-1">
             <Unlock size={12} /> Unlocked
           </div>
        )}
      </CardContent>
      {/* Visual tier indicator */}
      <div className="absolute top-2 right-2 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
        T{skill.tier}
      </div>
    </Card>
  );
};

export default SkillNode;
