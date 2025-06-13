// 'use server'

/**
 * @fileOverview AI-driven environmental storytelling flow.
 *
 * - generateEnvironmentalStory - A function that generates environmental stories based on the game world and player actions.
 * - EnvironmentalStoryInput - The input type for the generateEnvironmentalStory function.
 * - EnvironmentalStoryOutput - The return type for the generateEnvironmentalStory function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalStoryInputSchema = z.object({
  playerActions: z
    .string()
    .describe('A description of the player actions in the game world.'),
  worldState: z.string().describe('The current state of the game world.'),
});

export type EnvironmentalStoryInput = z.infer<typeof EnvironmentalStoryInputSchema>;

const EnvironmentalStoryOutputSchema = z.object({
  environmentalStory: z
    .string()
    .describe('The generated environmental story based on the game world and player actions.'),
});

export type EnvironmentalStoryOutput = z.infer<typeof EnvironmentalStoryOutputSchema>;

export async function generateEnvironmentalStory(
  input: EnvironmentalStoryInput
): Promise<EnvironmentalStoryOutput> {
  return environmentalStoryFlow(input);
}

const environmentalStoryPrompt = ai.definePrompt({
  name: 'environmentalStoryPrompt',
  input: {schema: EnvironmentalStoryInputSchema},
  output: {schema: EnvironmentalStoryOutputSchema},
  prompt: `You are a dynamic environmental storyteller, creating immersive narratives based on the game world and player actions.

  Based on the current state of the world:
  {{worldState}}

  and the recent player actions:
  {{playerActions}}

  generate a short environmental story that reflects these events. This story should describe how the environment subtly reacts to the player's presence and choices, creating a believable and dynamic world.
  `,
});

const environmentalStoryFlow = ai.defineFlow(
  {
    name: 'environmentalStoryFlow',
    inputSchema: EnvironmentalStoryInputSchema,
    outputSchema: EnvironmentalStoryOutputSchema,
  },
  async input => {
    const {output} = await environmentalStoryPrompt(input);
    return output!;
  }
);
