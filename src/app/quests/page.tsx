'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateQuest, type GenerateQuestOutput } from '@/ai/flows/generate-quest';

import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  playerProgression: z.string().min(10, { message: 'Player progression must be at least 10 characters.' }).max(1000),
  gameLore: z.string().min(10, { message: 'Game lore must be at least 10 characters.' }).max(2000),
});

type QuestFormValues = z.infer<typeof formSchema>;

export default function QuestsPage() {
  const [generatedQuest, setGeneratedQuest] = useState<GenerateQuestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerProgression: '',
      gameLore: '',
    },
  });

  async function onSubmit(values: QuestFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedQuest(null);
    try {
      const result = await generateQuest(values);
      setGeneratedQuest(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate quest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dynamic Quest Generation"
        description="Craft unique quests based on player progression and game lore."
      />
      <div className="grid md:grid-cols-2 gap-8 flex-1 min-h-0">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Quest Generator</CardTitle>
            <CardDescription>Input details to generate a new quest.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
                <FormField
                  control={form.control}
                  name="playerProgression"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Progression</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Player has just defeated the Ice Jotunn and acquired the Frostheart Amulet."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the player's current status, achievements, or significant items.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gameLore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Lore</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., The ancient runes speak of a hidden valkyrie sanctuary guarded by elemental spirits..."
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide relevant snippets of your game's lore or world-building details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full mt-auto">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate Quest
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Generated Quest</CardTitle>
            <CardDescription>The AI-crafted quest will appear here.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Generating your epic quest...</p>
                </div>
              )}
              {error && (
                <div className="text-destructive bg-destructive/10 p-4 rounded-md">{error}</div>
              )}
              {generatedQuest && !isLoading && (
                <div className="space-y-6 p-1">
                  <div className="border-b border-border pb-4">
                    <h3 className="text-2xl font-headline font-semibold text-primary">{generatedQuest.title}</h3>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                    <p className="text-card-foreground/90 whitespace-pre-wrap">{generatedQuest.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Reward</h4>
                    <p className="text-card-foreground/90 whitespace-pre-wrap">{generatedQuest.reward}</p>
                  </div>
                </div>
              )}
              {!generatedQuest && !isLoading && !error && (
                <div className="text-center py-10 text-muted-foreground">
                  <Wand2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  Your generated quest will appear here once you provide the details.
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
