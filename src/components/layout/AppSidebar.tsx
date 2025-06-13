
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

import AppLogo from '@/components/AppLogo';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar, // Import useSidebar hook
} from '@/components/ui/sidebar';
import { SheetTitle } from '@/components/ui/sheet';
import { navItems, type NavItem as NavItemType } from '@/config/nav';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  const IconComponent = item.icon as LucideIcon;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "justify-start w-full",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
        tooltip={{ children: item.label, className:"font-body" }}
      >
        <Link href={item.href}>
          <IconComponent size={18} />
          <span className="font-body">{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar(); // Get isMobile state

  const isActive = (itemPath: string, matchSegments?: number) => {
    if (itemPath === '/') return pathname === '/';
    if (matchSegments !== undefined) {
      const pathSegments = pathname.split('/').filter(Boolean);
      const itemSegments = itemPath.split('/').filter(Boolean);
      return itemSegments.every((segment, index) => pathSegments[index] === segment) && pathSegments.length >= itemSegments.length;
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2" aria-label="Mimir's Echo Home">
          <AppLogo className="h-8 w-auto" />
        </Link>
        {/* Conditionally render SheetTitle only on mobile */}
        {isMobile && <SheetTitle className="sr-only">Main Navigation</SheetTitle>}
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} isActive={isActive(item.href, item.matchSegments)} />
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* Placeholder for footer content if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}
