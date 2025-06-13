'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, CheckCircle, XCircle, ShoppingCart, FlaskConical } from 'lucide-react';
import Image from 'next/image';

interface Material {
  id: string;
  name: string;
  iconUrl: string; // URL to material icon
  description: string;
  quantityOwned: number;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  iconUrl: string; // URL to crafted item icon
  materialsNeeded: { materialId: string; quantity: number }[];
  result: { itemId: string; name: string; quantity: number };
  category: 'Alchemy' | 'Blacksmithing' | 'Enchanting';
}

// Mock Data
const mockMaterials: Material[] = [
  { id: 'herb_a', name: 'Sunpetal', iconUrl: 'https://placehold.co/40x40.png?text=🌿', description: 'A common herb that glows faintly.', quantityOwned: 10, },
  { id: 'herb_b', name: 'Moonbloom', iconUrl: 'https://placehold.co/40x40.png?text=🌙', description: 'A rare herb found only under moonlight.', quantityOwned: 3 },
  { id: 'ore_a', name: 'Iron Ore', iconUrl: 'https://placehold.co/40x40.png?text=⛏️', description: 'Basic ore for crafting.', quantityOwned: 25 },
  { id: 'gem_a', name: 'Mystic Shard', iconUrl: 'https://placehold.co/40x40.png?text=💎', description: 'A fragment of concentrated magic.', quantityOwned: 5 },
];

const mockRecipes: Recipe[] = [
  {
    id: 'potion_health_minor',
    name: 'Minor Healing Potion',
    description: 'Restores a small amount of health.',
    iconUrl: 'https://placehold.co/64x64.png?text=🧪',
    materialsNeeded: [{ materialId: 'herb_a', quantity: 2 }],
    result: { itemId: 'health_potion_1', name: 'Minor Healing Potion', quantity: 1 },
    category: 'Alchemy',
  },
  {
    id: 'potion_mana_minor',
    name: 'Minor Mana Potion',
    description: 'Restores a small amount of mana.',
    iconUrl: 'https://placehold.co/64x64.png?text=🧪',
    materialsNeeded: [{ materialId: 'herb_b', quantity: 1 }, { materialId: 'gem_a', quantity: 1 }],
    result: { itemId: 'mana_potion_1', name: 'Minor Mana Potion', quantity: 1 },
    category: 'Alchemy',
  },
  {
    id: 'sword_iron',
    name: 'Iron Sword',
    description: 'A sturdy iron sword.',
    iconUrl: 'https://placehold.co/64x64.png?text=⚔️',
    materialsNeeded: [{ materialId: 'ore_a', quantity: 5 }],
    result: { itemId: 'iron_sword', name: 'Iron Sword', quantity: 1 },
    category: 'Blacksmithing',
  },
];

const CraftingInterface: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [recipes] = useState<Recipe[]>(mockRecipes);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [craftingStatus, setCraftingStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedRecipe = useMemo(() => recipes.find(r => r.id === selectedRecipeId), [recipes, selectedRecipeId]);

  const canCraft = useMemo(() => {
    if (!selectedRecipe) return false;
    return selectedRecipe.materialsNeeded.every(needed => {
      const ownedMaterial = materials.find(m => m.id === needed.materialId);
      return ownedMaterial && ownedMaterial.quantityOwned >= needed.quantity;
    });
  }, [selectedRecipe, materials]);

  const handleCraft = () => {
    if (!selectedRecipe || !canCraft) {
      setCraftingStatus({ type: 'error', message: 'Cannot craft item. Check materials.' });
      return;
    }

    // Simulate crafting: deduct materials
    let updatedMaterials = [...materials];
    selectedRecipe.materialsNeeded.forEach(needed => {
      updatedMaterials = updatedMaterials.map(m =>
        m.id === needed.materialId ? { ...m, quantityOwned: m.quantityOwned - needed.quantity } : m
      );
    });
    setMaterials(updatedMaterials);
    setCraftingStatus({ type: 'success', message: `Successfully crafted ${selectedRecipe.result.quantity}x ${selectedRecipe.result.name}!` });
    
    // Clear status after a few seconds
    setTimeout(() => setCraftingStatus(null), 3000);
  };

  const filteredRecipes = useMemo(() => {
    if (filterCategory === 'all') return recipes;
    return recipes.filter(r => r.category === filterCategory);
  }, [recipes, filterCategory]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Recipes List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><FlaskConical /> Recipes</CardTitle>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Alchemy">Alchemy</SelectItem>
              <SelectItem value="Blacksmithing">Blacksmithing</SelectItem>
              <SelectItem value="Enchanting">Enchanting</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-3">
            <div className="space-y-2">
              {filteredRecipes.map(recipe => (
                <Button
                  key={recipe.id}
                  variant={selectedRecipeId === recipe.id ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setSelectedRecipeId(recipe.id)}
                >
                  <Image data-ai-hint="potion bottle" src={recipe.iconUrl} alt={recipe.name} width={32} height={32} className="mr-2 rounded-sm" />
                  <div>
                    <p className="font-semibold">{recipe.name}</p>
                    <p className="text-xs text-muted-foreground">{recipe.category}</p>
                  </div>
                </Button>
              ))}
               {filteredRecipes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recipes in this category.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Crafting Details */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Crafting Details</CardTitle>
          {!selectedRecipe && <CardDescription>Select a recipe to see details.</CardDescription>}
        </CardHeader>
        <CardContent>
          {selectedRecipe ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Image data-ai-hint="potion bottle" src={selectedRecipe.iconUrl} alt={selectedRecipe.name} width={64} height={64} className="rounded-md border border-border p-1" />
                <div>
                  <h3 className="text-2xl font-semibold font-headline text-primary">{selectedRecipe.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRecipe.description}</p>
                </div>
              </div>
              
              <Separator />

              <div>
                <h4 className="text-md font-semibold mb-2">Materials Needed:</h4>
                <ul className="space-y-2">
                  {selectedRecipe.materialsNeeded.map(needed => {
                    const material = materials.find(m => m.id === needed.materialId);
                    const hasEnough = material && material.quantityOwned >= needed.quantity;
                    return (
                      <li key={needed.materialId} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-2">
                          <Image data-ai-hint="herb mineral" src={material?.iconUrl || 'https://placehold.co/32x32.png'} alt={material?.name || ''} width={24} height={24} className="rounded-sm" />
                          <span>{material?.name || 'Unknown Material'}</span>
                        </div>
                        <span className={`text-sm font-medium ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                          {needed.quantity} / {material?.quantityOwned || 0}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Separator />
              
              {craftingStatus && (
                <Alert variant={craftingStatus.type === 'success' ? 'default' : 'destructive'} className={craftingStatus.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' : ''}>
                  {craftingStatus.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{craftingStatus.type === 'success' ? 'Success!' : 'Error!'}</AlertTitle>
                  <AlertDescription>{craftingStatus.message}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleCraft} disabled={!canCraft || !selectedRecipe} className="w-full">
                <Wand2 className="mr-2 h-4 w-4" /> Craft {selectedRecipe.result.quantity}x {selectedRecipe.result.name}
              </Button>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FlaskConical className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p>Select a recipe from the list to begin crafting.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materials Inventory - Optional display */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><ShoppingCart /> My Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {materials.map(material => (
                <div key={material.id} className="p-3 border border-border rounded-md bg-card flex flex-col items-center text-center">
                  <Image data-ai-hint="herb mineral" src={material.iconUrl} alt={material.name} width={40} height={40} className="mb-2 rounded-sm" />
                  <p className="text-sm font-medium">{material.name}</p>
                  <p className="text-xs text-muted-foreground">Owned: {material.quantityOwned}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CraftingInterface;
