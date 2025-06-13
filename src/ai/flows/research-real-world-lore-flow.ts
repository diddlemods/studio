
'use server';
/**
 * @fileOverview AI flow for researching real-world topics.
 *
 * - researchRealWorldTopic - A function that takes a topic, uses a (mocked) web search tool, and returns a summary with sources.
 * - ResearchRealWorldTopicInput - Input schema for the flow.
 * - ResearchRealWorldTopicOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for the search tool's output
const SearchResultItemSchema = z.object({
  title: z.string().describe('The title of the search result.'),
  snippet: z.string().describe('A brief snippet of the content.'),
  url: z.string().url().describe('The URL of the search result.'),
});

const SearchToolOutputSchema = z.object({
  results: z.array(SearchResultItemSchema).describe('A list of search results.'),
});

// Define the search tool (mocked implementation)
const searchWebTool = ai.defineTool(
  {
    name: 'searchWebTool',
    description: 'Fetches search results from the web for a given query. Use this to find information on real-world topics.',
    inputSchema: z.object({ query: z.string().describe('The search query.') }),
    outputSchema: SearchToolOutputSchema,
  },
  async ({ query }) => {
    console.log(`[searchWebTool] Called with query: ${query}`);
    // In a real application, this would call a search engine API (e.g., Google Search API, Bing API, SerpApi).
    // For now, returning mock data.
    if (query.toLowerCase().includes('viking longships')) {
      return {
        results: [
          { title: 'Viking Longships - Wikipedia', snippet: 'Longships were a type of ship invented and used by the Norsemen (commonly known as Vikings) for trade, commerce, exploration, and warfare during the Viking Age.', url: 'https://en.wikipedia.org/wiki/Longship' },
          { title: 'The Viking Longship: A Marvel of Engineering | History Hit', snippet: 'An exploration of the design and capabilities of Viking longships.', url: 'https://www.historyhit.com/the-viking-longship-a-marvel-of-engineering/' },
        ],
      };
    }
    if (query.toLowerCase().includes('ancient egyptian mythology')) {
         return {
        results: [
          { title: 'Ancient Egyptian religion - Wikipedia', snippet: 'Ancient Egyptian religion was a complex system of polytheistic beliefs and rituals that formed an integral part of ancient Egyptian culture.', url: 'https://en.wikipedia.org/wiki/Ancient_Egyptian_religion' },
          { title: 'Egyptian Mythology | Gods, Characters, & Stories | Britannica', snippet: 'An overview of major gods, goddesses, and myths of ancient Egypt.', url: 'https://www.britannica.com/topic/Egyptian-mythology' },
        ],
      };
    }
    return {
      results: [
        { title: `Mock Result for: ${query}`, snippet: `This is a placeholder snippet about ${query}. Replace searchWebTool with a real implementation.`, url: 'https://example.com/mock-search' },
      ],
    };
  }
);

// Input and Output Schemas for the main flow
const ResearchRealWorldTopicInputSchema = z.object({
  topic: z.string().describe('The real-world topic to research.'),
});
export type ResearchRealWorldTopicInput = z.infer<typeof ResearchRealWorldTopicInputSchema>;

const ResearchRealWorldTopicOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the researched topic.'),
  sources: z.array(
    z.object({
      title: z.string().optional().describe('The title of the source, if available.'),
      url: z.string().url().describe('The URL of the source.'),
    })
  ).describe('A list of up to 3 key sources used for the summary.'),
});
export type ResearchRealWorldTopicOutput = z.infer<typeof ResearchRealWorldTopicOutputSchema>;


// Define the prompt that uses the tool
const researchPrompt = ai.definePrompt({
  name: 'researchRealWorldTopicPrompt',
  input: { schema: ResearchRealWorldTopicInputSchema },
  output: { schema: ResearchRealWorldTopicOutputSchema },
  tools: [searchWebTool],
  prompt: `You are a research assistant. The user wants to learn about the topic: "{{topic}}".
  1. Use the "searchWebTool" to find relevant information about the topic: "{{topic}}".
  2. After reviewing the search results, synthesize the information into a concise summary.
  3. List up to 3 of the most relevant and authoritative sources you found, including their titles (if available from the search result) and URLs.
  
  Present the information clearly in the specified output format.`,
});


// Define the main flow
const researchRealWorldTopicFlow = ai.defineFlow(
  {
    name: 'researchRealWorldTopicFlow',
    inputSchema: ResearchRealWorldTopicInputSchema,
    outputSchema: ResearchRealWorldTopicOutputSchema,
  },
  async (input) => {
    const llmResponse = await researchPrompt(input);
    const output = llmResponse.output();
    
    if (!output) {
        throw new Error("The AI failed to produce an output for the research topic.");
    }
    
    // Ensure sources are correctly formatted if the LLM provides them directly or through tool usage interpretation.
    // The prompt guides the LLM to populate the sources based on tool results.
    return output;
  }
);

// Exported wrapper function
export async function researchRealWorldTopic(input: ResearchRealWorldTopicInput): Promise<ResearchRealWorldTopicOutput> {
  return researchRealWorldTopicFlow(input);
}
