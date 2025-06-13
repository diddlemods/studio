
'use server';
/**
 * @fileOverview AI flow for generating mythological entries.
 *
 * - generateMythologicalEntry - A function that generates a descriptive entry for a mythological entity or concept.
 * - GenerateMythologicalEntryInput - Input schema for the flow.
 * - GenerateMythologicalEntryOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMythologicalEntryInputSchema = z.object({
  query: z.string().describe('The name or concept of the mythological entity/place to generate an entry for (e.g., "Odin", "Minotaur", "Valhalla").'),
  mythology: z.string().describe('The specific mythological tradition this entity belongs to (e.g., "Norse", "Greek", "Egyptian").'),
});
export type GenerateMythologicalEntryInput = z.infer<typeof GenerateMythologicalEntryInputSchema>;

const GenerateMythologicalEntryOutputSchema = z.object({
  name: z.string().describe('The primary name of the mythological entity or concept.'),
  mythology: z.string().describe('The mythological tradition it belongs to.'),
  type: z.string().describe('The type of entity (e.g., God, Monster, Place, Concept, Hero).'),
  description: z.string().describe('A detailed description of the entity, its characteristics, story, and significance within its mythology.'),
  suggested_citations: z.string().optional().describe('Suggested primary or secondary sources where information about this entity can be found (e.g., "Prose Edda", "Hesiod\'s Theogony"). Treat this as if citing from a reliable mythological database or compendium.'),
});
export type GenerateMythologicalEntryOutput = z.infer<typeof GenerateMythologicalEntryOutputSchema>;

export async function generateMythologicalEntry(input: GenerateMythologicalEntryInput): Promise<GenerateMythologicalEntryOutput> {
  return generateMythologicalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMythologicalEntryPrompt',
  input: { schema: GenerateMythologicalEntryInputSchema },
  output: { schema: GenerateMythologicalEntryOutputSchema },
  prompt: `You are an expert mythologist compiling entries for a comprehensive digital encyclopedia of mythology.
  A user is querying for information about "{{query}}" within "{{mythology}}" mythology.

  Generate a detailed and accurate encyclopedia entry based on this query.
  
  The entry should include:
  1.  **Name**: The most common name for "{{query}}".
  2.  **Mythology**: Confirm "{{mythology}}".
  3.  **Type**: Classify "{{query}}" (e.g., God, Goddess, Monster, Hero, Place, Concept, Artifact).
  4.  **Description**: Provide a rich description covering key attributes, roles, significant myths or stories associated with "{{query}}", and its importance or symbolism.
  5.  **Suggested Citations**: List 1-3 key ancient texts, sagas, poems, or well-regarded scholarly works where information about "{{query}}" can be primarily found. Format this as a simple string. For example: "The Poetic Edda; Snorri Sturluson's Prose Edda". This simulates drawing from a well-cited database.

  Ensure the information is consistent with established knowledge of "{{mythology}}" mythology.
  Focus on providing a well-structured and informative entry in the specified output format.
  If the query is too vague or not clearly part of the specified mythology, try your best to provide relevant information or state the ambiguity.
  For example, if user queries "Dragon" in "Norse" mythology, you might focus on figures like Fafnir or Jormungandr.
  `,
});

const generateMythologicalEntryFlow = ai.defineFlow(
  {
    name: 'generateMythologicalEntryFlow',
    inputSchema: GenerateMythologicalEntryInputSchema,
    outputSchema: GenerateMythologicalEntryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI failed to produce an output for the mythological entry.");
    }
    return output;
  }
);
