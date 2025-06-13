
import type { LucideIcon } from 'lucide-react';
import { Home, Swords, Trees, Network, FlaskConical, Coins, Settings2, ScrollText } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  matchSegments?: number; // For active link matching
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home, matchSegments: 0 },
  { label: 'Quests', href: '/quests', icon: Swords },
  { label: 'Storytelling', href: '/storytelling', icon: Trees },
  { label: 'Lore Generation', href: '/lore', icon: ScrollText },
  { label: 'Skill Tree', href: '/skill-tree', icon: Network },
  { label: 'Crafting', href: '/crafting', icon: FlaskConical },
  { label: 'Economy', href: '/economy', icon: Coins },
  { label: 'Settings', href: '/settings', icon: Settings2 },
];

