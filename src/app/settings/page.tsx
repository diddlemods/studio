'use client';

import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface UISetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialUiSettings: UISetting[] = [
  { id: 'minimap', label: 'Show Mini-map', description: 'Display a small map in the corner of the screen.', enabled: true },
  { id: 'questLog', label: 'Show Compact Quest Log', description: 'Display a summarized quest log on the main UI.', enabled: true },
  { id: 'damageNumbers', label: 'Show Damage Numbers', description: 'Display damage numbers during combat.', enabled: true },
  { id: 'buffIcons', label: 'Show Buff/Debuff Icons', description: 'Display status effect icons on relevant entities.', enabled: false },
  { id: 'tooltips', label: 'Enable Detailed Tooltips', description: 'Show extended information on hover.', enabled: true },
];


export default function SettingsPage() {
  const [uiSettings, setUiSettings] = useState<UISetting[]>(initialUiSettings);

  const handleSettingChange = (id: string, checked: boolean) => {
    setUiSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: checked } : setting
      )
    );
  };

  return (
    <div>
      <PageHeader
        title="Settings & UI Customization"
        description="Tailor your Mimir's Echo experience to your preferences."
      />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">UI Modules</CardTitle>
            <CardDescription>Toggle visibility of different UI elements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {uiSettings.map((setting, index) => (
              <div key={setting.id}>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1">
                    <Label htmlFor={setting.id} className="text-base">{setting.label}</Label>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={setting.enabled}
                    onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
                    aria-label={setting.label}
                  />
                </div>
                {index < uiSettings.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Accessibility</CardTitle>
            <CardDescription>Adjust settings for better accessibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="font-size">Font Size</Label>
              <select id="font-size" className="p-2 rounded-md border bg-input text-foreground">
                <option value="small">Small</option>
                <option value="medium" selected>Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="contrast-mode">High Contrast Mode</Label>
              <Switch id="contrast-mode" />
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              More accessibility options (e.g., color blindness filters, text-to-speech) would be implemented here in a full application.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Theme</CardTitle>
            <CardDescription>Customize the application's appearance (colors are currently fixed by design).</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
              The application currently uses a fixed dark theme with Muted Purple, Dark Gray, and Pale Violet-Red accents as per the design specification.
              A theme switcher could be added here if dynamic theming becomes a requirement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
