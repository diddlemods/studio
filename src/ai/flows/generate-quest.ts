'use server';

/**
 * @fileOverview Generates quests based on player progression and game lore.
 *
 * - generateQuest - A function that generates a quest.
 * - GenerateQuestInput - The input type for the generateQuest function.
 * - GenerateQuestOutput - The return type for the generateQuest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestInputSchema = z.object({
  playerProgression: z
    .string()
    .describe('Description of the player current game progression.'),
  gameLore: z.string().describe('The game lore to be used to create the quest.'),
});
export type GenerateQuestInput = z.infer<typeof GenerateQuestInputSchema>;

const GenerateQuestOutputSchema = z.object({
  title: z.string().describe('The title of the generated quest.'),
  description: z.string().describe('The description of the generated quest.'),
  reward: z.string().describe('The reward for completing the quest.'),
});
export type GenerateQuestOutput = z.infer<typeof GenerateQuestOutputSchema>;

export async function generateQuest(input: GenerateQuestInput): Promise<GenerateQuestOutput> {
  return generateQuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestPrompt',
  input: {schema: GenerateQuestInputSchema},
  output: {schema: GenerateQuestOutputSchema},
  prompt: `You are a quest generator for a Norse mythology-themed RPG.

    Using the game lore and the player's current progression, generate a relevant and engaging quest.

    Game Lore: {{{gameLore}}}
    Player Progression: {{{playerProgression}}}

    Quest Title:
    Quest Description:
    Quest Reward: `,
});

const generateQuestFlow = ai.defineFlow(
  {
    name: 'generateQuestFlow',
    inputSchema: GenerateQuestInputSchema,
    outputSchema: GenerateQuestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
