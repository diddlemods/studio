'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateEnvironmentalStory, type EnvironmentalStoryOutput } from '@/ai/flows/environmental-storytelling';

import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Leaf } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  playerActions: z.string().min(10, { message: 'Player actions must be at least 10 characters.' }).max(1000),
  worldState: z.string().min(10, { message: 'World state must be at least 10 characters.' }).max(2000),
});

type StoryFormValues = z.infer<typeof formSchema>;

export default function StorytellingPage() {
  const [generatedStory, setGeneratedStory] = useState<EnvironmentalStoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerActions: '',
      worldState: '',
    },
  });

  async function onSubmit(values: StoryFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedStory(null);
    try {
      const result = await generateEnvironmentalStory(values);
      setGeneratedStory(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate environmental story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="AI Environmental Storytelling"
        description="Generate real-time environmental narratives that react to player actions and the game world."
      />
      <div className="grid md:grid-cols-2 gap-8 flex-1 min-h-0">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Story Generator</CardTitle>
            <CardDescription>Input details to generate environmental story elements.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
                <FormField
                  control={form.control}
                  name="playerActions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recent Player Actions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., The player chopped down the ancient Moonwood tree and looted the Whispering Idol from the shrine."
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe significant actions the player has recently taken in the game world.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="worldState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current World State</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., The forest is unnaturally quiet. A faint, eerie glow emanates from the desecrated shrine. Wildlife seems agitated."
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide context about the current state of the game environment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="submit" disabled={isLoading} className="w-full mt-auto">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Leaf className="mr-2 h-4 w-4" />
                  )}
                  Generate Story
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Generated Environmental Story</CardTitle>
            <CardDescription>The AI-crafted narrative will appear here.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Weaving the threads of fate...</p>
                </div>
              )}
              {error && (
                <div className="text-destructive bg-destructive/10 p-4 rounded-md">{error}</div>
              )}
              {generatedStory && !isLoading && (
                <div className="space-y-4 p-1">
                  <p className="text-card-foreground/90 whitespace-pre-wrap">{generatedStory.environmentalStory}</p>
                </div>
              )}
              {!generatedStory && !isLoading && !error && (
                <div className="text-center py-10 text-muted-foreground">
                  <Leaf className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  The whispers of the world will be recorded here.
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
