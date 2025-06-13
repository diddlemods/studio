
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { researchRealWorldTopic, type ResearchRealWorldTopicOutput, type ResearchRealWorldTopicInput } from '@/ai/flows/research-real-world-lore-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Search, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters.' }).max(100),
});

type ResearchFormValues = z.infer<typeof formSchema>;

export default function RealWorldResearchSection() {
  const [researchResult, setResearchResult] = useState<ResearchRealWorldTopicOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: ResearchFormValues) {
    setIsLoading(true);
    setError(null);
    setResearchResult(null);
    try {
      const result = await researchRealWorldTopic(values);
      setResearchResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to research topic. The AI might be busy or an error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Search /> Research Topic</CardTitle>
          <CardDescription>Enter a real-world topic to get an AI-generated summary and potential sources.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic to Research</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Viking longships, Ancient Egyptian mythology" {...field} />
                    </FormControl>
                    <FormDescription>
                      The AI will use a (simulated) web search to find information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full mt-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Research Topic
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BookOpen /> Research Results</CardTitle>
          <CardDescription>The AI-generated summary and sources will appear here.</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Researching, please wait...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {researchResult && !isLoading && (
              <div className="space-y-6 p-1">
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-2">Summary</h4>
                  <p className="text-card-foreground/90 whitespace-pre-wrap">{researchResult.summary}</p>
                </div>
                {researchResult.sources && researchResult.sources.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Potential Sources</h4>
                    <ul className="space-y-2">
                      {researchResult.sources.map((source, index) => (
                        <li key={index} className="text-sm">
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                            {source.title || source.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {!researchResult && !isLoading && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                Your research results will appear here.
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
