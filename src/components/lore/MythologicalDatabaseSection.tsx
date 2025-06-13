
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateMythologicalEntry, type GenerateMythologicalEntryOutput, type GenerateMythologicalEntryInput } from '@/ai/flows/generate-mythological-entry-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ScrollText, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  query: z.string().min(3, { message: 'Query must be at least 3 characters.' }).max(200, {message: 'Query is too long.'}),
  mythology: z.string().min(3, { message: 'Mythology type must be at least 3 characters.'}).max(50, {message: 'Mythology type is too long.'}),
});

type MythologyFormValues = z.infer<typeof formSchema>;

export default function MythologicalDatabaseSection() {
  const [generatedEntry, setGeneratedEntry] = useState<GenerateMythologicalEntryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MythologyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      mythology: '',
    },
  });

  async function onSubmit(values: MythologyFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedEntry(null);
    try {
      const result = await generateMythologicalEntry(values);
      setGeneratedEntry(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate mythological entry. The AI might be busy or an error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><ScrollText /> Generate Mythological Entry</CardTitle>
          <CardDescription>
            Describe the mythological entity or concept you want to generate an entry for.
            The AI will act as if querying a consistent database and provide suggested citations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Query</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Odin, The Minotaur, Valhalla" {...field} />
                    </FormControl>
                    <FormDescription>
                      What entity, place, or concept are you looking for?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mythology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mythology Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Norse, Greek, Egyptian" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify the mythological tradition.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full mt-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ScrollText className="mr-2 h-4 w-4" />
                )}
                Generate Entry
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><FileText /> Generated Entry</CardTitle>
          <CardDescription>The AI-crafted mythological entry will appear here.</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Crafting the myth...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {generatedEntry && !isLoading && (
              <div className="space-y-6 p-1">
                <div className="border-b border-border pb-4">
                  <h3 className="text-2xl font-headline font-semibold text-primary">{generatedEntry.name}</h3>
                  <p className="text-sm text-muted-foreground">Type: {generatedEntry.type} | Mythology: {generatedEntry.mythology}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                  <p className="text-card-foreground/90 whitespace-pre-wrap">{generatedEntry.description}</p>
                </div>
                {generatedEntry.suggested_citations && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Suggested Citations / Sources</h4>
                    <p className="text-card-foreground/90 whitespace-pre-wrap text-xs">{generatedEntry.suggested_citations}</p>
                  </div>
                )}
              </div>
            )}
            {!generatedEntry && !isLoading && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                Your generated mythological entry will appear here.
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
