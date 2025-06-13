
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateWorldElement, type GenerateWorldElementOutput, type GenerateWorldElementInput } from '@/ai/flows/generate-world-element-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Globe, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WorldElementTypeEnum = z.enum(['GOD', 'HISTORY_EVENT', 'REALM', 'FACTION', 'CREATURE', 'ITEM', 'CUSTOM_CATEGORY']);

const formSchema = z.object({
  elementType: WorldElementTypeEnum,
  descriptionPrompts: z.string().min(10, { message: 'Description prompts must be at least 10 characters.' }).max(1500),
  existingLoreContext: z.string().max(2000).optional(),
  customCategoryName: z.string().max(50).optional(),
});

type WorldElementFormValues = z.infer<typeof formSchema>;

export default function WorldElementBuilderSection() {
  const [generatedElement, setGeneratedElement] = useState<GenerateWorldElementOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<WorldElementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      elementType: 'GOD',
      descriptionPrompts: '',
      existingLoreContext: '',
      customCategoryName: '',
    },
  });

  const watchedElementType = form.watch('elementType');

  async function onSubmit(values: WorldElementFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedElement(null);

    const input: GenerateWorldElementInput = {
      elementType: values.elementType,
      descriptionPrompts: values.descriptionPrompts,
      existingLoreContext: values.existingLoreContext,
      customCategoryName: values.elementType === 'CUSTOM_CATEGORY' ? values.customCategoryName : undefined,
    };

    try {
      const result = await generateWorldElement(input);
      setGeneratedElement(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate world element. The AI might be busy or an error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Globe /> World Element Builder</CardTitle>
          <CardDescription>
            Define a new element for your game world. Provide prompts and context for consistent generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
              <FormField
                control={form.control}
                name="elementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Element Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an element type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WorldElementTypeEnum.options.map(option => (
                          <SelectItem key={option} value={option}>{option.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>What kind of world element are you creating?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedElementType === 'CUSTOM_CATEGORY' && (
                <FormField
                  control={form.control}
                  name="customCategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Magical Phenomenon, Ancient Technology" {...field} />
                      </FormControl>
                      <FormDescription>Name your custom category.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="descriptionPrompts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description Prompts & Key Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., For a God: Name ideas, domain, personality, symbols, relationships. For a Realm: Name, climate, inhabitants, key locations, magic properties."
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed prompts, themes, and desired attributes for the AI to work with.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="existingLoreContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Lore Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste any relevant existing lore that this new element should be consistent with."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Helps the AI maintain consistency with your established world.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full mt-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Element
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Sparkles /> Generated World Element</CardTitle>
          <CardDescription>The AI-crafted world element will appear here.</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Building your world...</p>
              </div>
            )}
            {error && (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {generatedElement && !isLoading && (
              <div className="space-y-6 p-1">
                <div className="border-b border-border pb-4">
                  <h3 className="text-2xl font-headline font-semibold text-primary">{generatedElement.name}</h3>
                  <p className="text-sm text-muted-foreground">Category: {generatedElement.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                  <p className="text-card-foreground/90 whitespace-pre-wrap">{generatedElement.description}</p>
                </div>
                {generatedElement.details && Object.keys(generatedElement.details).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Specific Details</h4>
                    <pre className="text-xs bg-muted/50 p-3 rounded-md whitespace-pre-wrap font-code">
                      {JSON.stringify(generatedElement.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            {!generatedElement && !isLoading && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
                Your generated world element will appear here.
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
