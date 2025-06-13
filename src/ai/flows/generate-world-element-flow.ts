
'use server';
/**
 * @fileOverview AI flow for generating detailed world-building elements.
 *
 * - generateWorldElement - A function that creates a structured description of a world element based on user prompts.
 * - GenerateWorldElementInput - Input schema for the flow.
 * - GenerateWorldElementOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WorldElementTypeEnum = z.enum(['GOD', 'HISTORY_EVENT', 'REALM', 'FACTION', 'CREATURE', 'ITEM', 'CUSTOM_CATEGORY'], {
    description: "The type of world element to generate."
});
export type WorldElementType = z.infer<typeof WorldElementTypeEnum>;

const GenerateWorldElementInputSchema = z.object({
  elementType: WorldElementTypeEnum,
  customCategoryName: z.string().optional().describe('Name for the custom category, if elementType is CUSTOM_CATEGORY.'),
  descriptionPrompts: z.string().describe('Detailed prompts, keywords, themes, and desired attributes for the element. For example, for a GOD: "Name: Solara, Domain: Sun, healing, prophecy, Personality: Benevolent, stern, Symbols: Golden sun disk, phoenix". For a REALM: "Name: Aethelgard, Climate: Temperate, forested, Inhabitants: Elves, humans, Key Locations: Crystal Spire, Whispering Woods, Magic: Wild, nature-based".'),
  existingLoreContext: z.string().optional().describe('Optional existing lore or world context that this new element should be consistent with.'),
});
export type GenerateWorldElementInput = z.infer<typeof GenerateWorldElementInputSchema>;

const GenerateWorldElementOutputSchema = z.object({
  name: z.string().describe('The primary name of the generated world element.'),
  category: z.string().describe('The category or type of the element (e.g., God, Realm, Faction, or the customCategoryName if provided).'),
  description: z.string().describe('A comprehensive description of the world element, incorporating the provided prompts and context.'),
  details: z.record(z.any()).optional().describe('A structured object containing specific attributes and details relevant to the element type. For a GOD, this might include fields like `domain`, `symbols`, `personality`, `relationships`. For a REALM, `climate`, `inhabitants`, `key_features`. This should be a JSON-like structure.'),
});
export type GenerateWorldElementOutput = z.infer<typeof GenerateWorldElementOutputSchema>;

export async function generateWorldElement(input: GenerateWorldElementInput): Promise<GenerateWorldElementOutput> {
  return generateWorldElementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorldElementPrompt',
  input: { schema: GenerateWorldElementInputSchema },
  output: { schema: GenerateWorldElementOutputSchema },
  prompt: `You are a creative world-building assistant for a fantasy RPG.
  The user wants to generate a new world element.

  Element Type: {{elementType}}
  {{#if customCategoryName}}Custom Category Name: {{customCategoryName}}{{/if}}
  User's Description Prompts & Key Details:
  {{descriptionPrompts}}

  {{#if existingLoreContext}}
  Existing Lore Context (ensure consistency with this):
  {{existingLoreContext}}
  {{/if}}

  Based on the above, generate a detailed and engaging world element.
  1.  **Name**: Devise a fitting name for the element based on the prompts.
  2.  **Category**: This should be "{{elementType}}". If elementType is CUSTOM_CATEGORY, use "{{customCategoryName}}" as the category.
  3.  **Description**: Write a comprehensive narrative description. Expand on the user's prompts, add flavour, and make it immersive. If existing lore context is provided, ensure the description is consistent with it.
  4.  **Details (Structured Object)**: Create a JSON-like object for specific attributes.
      -   If type is GOD: include fields like 'domain' (string or string[]), 'symbols' (string[]), 'alignment' (string), 'relationships' (string describing relations to other entities), 'powers_abilities' (string[]).
      -   If type is HISTORY_EVENT: include 'date_era' (string), 'key_figures_involved' (string[]), 'causes' (string), 'consequences' (string), 'locations_affected' (string[]).
      -   If type is REALM/WORLD/VERSE: include 'climate' (string), 'terrain_features' (string[]), 'dominant_species_cultures' (string[]), 'key_locations' (string[]), 'magic_properties' (string), 'travel_between_verses_notes' (string, if applicable for inter-verse travel).
      -   If type is FACTION: include 'leader' (string), 'goals' (string[]), 'allies' (string[]), 'enemies' (string[]), 'base_of_operations' (string), 'ideology' (string).
      -   If type is CREATURE: include 'habitat' (string), 'abilities' (string[]), 'diet' (string), 'temperament' (string), 'loot_drops' (string[]).
      -   If type is ITEM: include 'item_type' (e.g., weapon, armor, artifact), 'properties' (string[]), 'rarity' (string), 'materials' (string[]), 'lore_significance' (string).
      -   If type is CUSTOM_CATEGORY: try to infer relevant detail fields from the descriptionPrompts or provide a general 'attributes' field.
      This 'details' object should be rich and based on the provided prompts.

  Strive for creativity and internal consistency. The output must strictly follow the JSON schema for GenerateWorldElementOutput.
  The "details" field is crucial for structured data that can be used in a game.
  `,
});


const generateWorldElementFlow = ai.defineFlow(
  {
    name: 'generateWorldElementFlow',
    inputSchema: GenerateWorldElementInputSchema,
    outputSchema: GenerateWorldElementOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
     if (!output) {
        throw new Error("The AI failed to produce an output for the world element.");
    }
    // Ensure the category is correctly set if it's a custom category
    if (input.elementType === 'CUSTOM_CATEGORY' && input.customCategoryName) {
      output.category = input.customCategoryName;
    } else {
      output.category = input.elementType;
    }
    return output;
  }
);
