
'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, PackagePlus, Coins, TrendingUp, TrendingDown, Info } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface MarketItem {
  id: string;
  name: string;
  iconUrl: string;
  currentPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  supply: number;
  demand: number;
  category: string;
}

interface PlayerListing {
  id: string;
  itemId: string;
  itemName: string;
  iconUrl: string;
  quantity: number;
  pricePerUnit: number;
  listedAt: Date;
}

type PlayerInventoryItem = { id: string; name: string; iconUrl: string; quantity: number };

// Mock Data
const mockMarketItems: MarketItem[] = [
  { id: 'health_potion_1', name: 'Minor Healing Potion', iconUrl: 'https://placehold.co/40x40.png?text=🧪', currentPrice: 10, priceTrend: 'stable', supply: 150, demand: 200, category: 'Potions' },
  { id: 'iron_sword', name: 'Iron Sword', iconUrl: 'https://placehold.co/40x40.png?text=⚔️', currentPrice: 50, priceTrend: 'up', supply: 30, demand: 45, category: 'Weapons' },
  { id: 'herb_a', name: 'Sunpetal', iconUrl: 'https://placehold.co/40x40.png?text=🌿', currentPrice: 3, priceTrend: 'down', supply: 500, demand: 300, category: 'Materials' },
  { id: 'gem_a', name: 'Mystic Shard', iconUrl: 'https://placehold.co/40x40.png?text=💎', currentPrice: 75, priceTrend: 'up', supply: 20, demand: 50, category: 'Materials' },
];

const mockPlayerInventory: PlayerInventoryItem[] = [
    { id: 'health_potion_1', name: 'Minor Healing Potion', iconUrl: 'https://placehold.co/40x40.png?text=🧪', quantity: 5 },
    { id: 'iron_ore', name: 'Iron Ore', iconUrl: 'https://placehold.co/40x40.png?text=⛏️', quantity: 50 },
];

interface SellItemsCardProps {
  selectedInventoryItemId: string;
  setSelectedInventoryItemId: React.Dispatch<React.SetStateAction<string>>;
  listingQuantity: number;
  setListingQuantity: React.Dispatch<React.SetStateAction<number>>;
  listingPrice: number;
  setListingPrice: React.Dispatch<React.SetStateAction<number>>;
  handleListItem: () => void;
  playerInventory: PlayerInventoryItem[];
}


const MarketDisplay: React.FC = () => {
  const { toast } = useToast();
  const [marketItems, setMarketItems] = useState<MarketItem[]>(mockMarketItems);
  const [playerListings, setPlayerListings] = useState<PlayerListing[]>([]);
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<string>('');
  const [listingQuantity, setListingQuantity] = useState<number>(1);
  const [listingPrice, setListingPrice] = useState<number>(10);
  // This state would ideally come from a shared player state/context
  const [currentMockPlayerInventory, setCurrentMockPlayerInventory] = useState<PlayerInventoryItem[]>(mockPlayerInventory);


  const handleListItem = () => {
    const itemToSell = currentMockPlayerInventory.find(item => item.id === selectedInventoryItemId);
    if (!itemToSell || listingQuantity <= 0 || listingPrice <= 0) {
       toast({ title: "Invalid Input", description: "Please select an item and ensure quantity/price are valid.", variant: "destructive" });
      return;
    }
    if (listingQuantity > itemToSell.quantity) {
      toast({ title: "Insufficient Quantity", description: `Not enough ${itemToSell.name} in inventory. You have ${itemToSell.quantity}.`, variant: "destructive" });
      return;
    }

    const newListing: PlayerListing = {
      id: `listing_${Date.now()}`,
      itemId: itemToSell.id,
      itemName: itemToSell.name,
      iconUrl: itemToSell.iconUrl,
      quantity: listingQuantity,
      pricePerUnit: listingPrice,
      listedAt: new Date(),
    };
    setPlayerListings(prev => [...prev, newListing]);
    
    // Update player inventory (mock update)
    setCurrentMockPlayerInventory(prevInv => 
      prevInv.map(item => 
        item.id === selectedInventoryItemId 
          ? {...item, quantity: item.quantity - listingQuantity}
          : item
      ).filter(item => item.quantity > 0) // Optionally remove items with 0 quantity
    );

    toast({ title: "Item Listed!", description: `Listed ${listingQuantity}x ${itemToSell.name} for ${listingPrice} each.` });
    setSelectedInventoryItemId('');
    setListingQuantity(1);
    setListingPrice(10);
  };
  
  const categories = useMemo(() => [...new Set(marketItems.map(item => item.category))], [marketItems]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredMarketItems = useMemo(() => {
    if (filterCategory === 'All') return marketItems;
    return marketItems.filter(item => item.category === filterCategory);
  }, [marketItems, filterCategory]);

  return (
    <Tabs defaultValue="market" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4">
        <TabsTrigger value="market">Market Overview</TabsTrigger>
        <TabsTrigger value="myListings">My Listings</TabsTrigger>
        <TabsTrigger value="sellItems" className="hidden md:inline-flex">Sell Items</TabsTrigger>
      </TabsList>

      <TabsContent value="market">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><LineChart /> Market Overview</CardTitle>
            <CardDescription>View current prices, supply, and demand for items.</CardDescription>
             <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px] mt-2">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Supply</TableHead>
                    <TableHead>Demand</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarketItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Image data-ai-hint="item icon" src={item.iconUrl} alt={item.name} width={32} height={32} className="rounded-sm"/>
                        {item.name}
                      </TableCell>
                      <TableCell><Coins className="inline mr-1 h-3 w-3 text-yellow-400" />{item.currentPrice}</TableCell>
                      <TableCell>
                        {item.priceTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {item.priceTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                        {item.priceTrend === 'stable' && <Info className="h-4 w-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell>{item.supply}</TableCell>
                      <TableCell>{item.demand}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => toast({title: "Action: Buy", description: `Buy ${item.name}`})}>Buy</Button>
                        <Button variant="outline" size="sm" className="ml-2" onClick={() => toast({title: "Action: Sell", description: `Sell ${item.name}`})}>Sell</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                   {filteredMarketItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No items in this category.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="myListings">
         <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Active Listings</CardTitle>
            <CardDescription>Manage items you have put up for sale.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {playerListings.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">You have no active listings.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price/Unit</TableHead>
                      <TableHead>Listed At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerListings.map(listing => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                           <Image data-ai-hint="item icon" src={listing.iconUrl} alt={listing.itemName} width={24} height={24} className="rounded-sm"/>
                           {listing.itemName}
                        </TableCell>
                        <TableCell>{listing.quantity}</TableCell>
                        <TableCell><Coins className="inline mr-1 h-3 w-3 text-yellow-400" />{listing.pricePerUnit}</TableCell>
                        <TableCell>{listing.listedAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => {
                            setPlayerListings(prev => prev.filter(l => l.id !== listing.id));
                            // Mock: Add item back to inventory if needed or handle differently
                            toast({title: "Listing Removed", description: `${listing.itemName} removed from market.`});
                          }}>Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* SellItemsCard for mobile, always rendered inside a TabContent for discoverability */}
      <TabsContent value="sellItems">
        <SellItemsCard 
          selectedInventoryItemId={selectedInventoryItemId} 
          setSelectedInventoryItemId={setSelectedInventoryItemId} 
          listingQuantity={listingQuantity} 
          setListingQuantity={setListingQuantity} 
          listingPrice={listingPrice} 
          setListingPrice={setListingPrice} 
          handleListItem={handleListItem}
          playerInventory={currentMockPlayerInventory} 
        />
      </TabsContent>
    </Tabs>
  );
};

const SellItemsCard: React.FC<SellItemsCardProps> = ({
  selectedInventoryItemId, 
  setSelectedInventoryItemId, 
  listingQuantity, 
  setListingQuantity, 
  listingPrice, 
  setListingPrice, 
  handleListItem,
  playerInventory
}) => (
 <Card>
    <CardHeader>
      <CardTitle className="font-headline flex items-center gap-2"><PackagePlus /> List Item for Sale</CardTitle>
      <CardDescription>Choose an item from your inventory to sell on the market.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="item-to-sell">Item</Label>
        <Select value={selectedInventoryItemId} onValueChange={setSelectedInventoryItemId}>
          <SelectTrigger id="item-to-sell">
            <SelectValue placeholder="Select an item from your inventory" />
          </SelectTrigger>
          <SelectContent>
            {playerInventory.length > 0 ? playerInventory.map(item => (
              <SelectItem key={item.id} value={item.id}>
                <div className="flex items-center gap-2">
                  <Image data-ai-hint="item icon" src={item.iconUrl} alt={item.name} width={20} height={20} className="rounded-sm"/>
                  {item.name} (Owned: {item.quantity})
                </div>
              </SelectItem>
            )) : <SelectItem value="no-items" disabled>No items in inventory</SelectItem>}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" value={listingQuantity} onChange={e => setListingQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
      </div>
      <div>
        <Label htmlFor="price">Price per Unit</Label>
        <Input id="price" type="number" value={listingPrice} onChange={e => setListingPrice(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
      </div>
      <Button onClick={handleListItem} className="w-full" disabled={!selectedInventoryItemId || selectedInventoryItemId === "no-items"}>List Item</Button>
    </CardContent>
  </Card>
);


export default MarketDisplay;
