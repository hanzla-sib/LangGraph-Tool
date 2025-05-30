import { Ollama } from "@langchain/ollama";
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { tool } from "@langchain/core/tools";
import { StateGraph, messagesStateReducer, Annotation } from "@langchain/langgraph";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph";

import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Custom weather tool
const weatherTool = tool(
  async ({ location }) => {
    // This is a mock weather API - in production you'd use a real weather service
    const weatherData = {
      "san francisco": "Sunny, 72°F (22°C), Light breeze from the west",
      "sf": "Sunny, 72°F (22°C), Light breeze from the west",
      "new york": "Partly cloudy, 68°F (20°C), Moderate humidity",
      "ny": "Partly cloudy, 68°F (20°C), Moderate humidity",
      "london": "Overcast, 59°F (15°C), Light rain expected",
      "tokyo": "Clear skies, 75°F (24°C), High humidity",
      "paris": "Foggy, 62°F (17°C), Low visibility in the morning"
    };
    
    const normalizedLocation = location.toLowerCase();
    const weather = weatherData[normalizedLocation] || `Weather data not available for ${location}. Try: San Francisco, New York, London, Tokyo, or Paris.`;
    
    return `Current weather in ${location}: ${weather}`;
  },
  {
    name: "get_weather",
    description: "Get current weather information for a specific location",
    schema: z.object({
      location: z.string().describe("The city or location to get weather for"),
    }),
  }
);

// Custom calculator tool
const calculatorTool = tool(
  async ({ expression }) => {
    try {
      // Simple evaluation - in production you'd want a safer math parser
      const result = Function(`"use strict"; return (${expression})`)();
      return `The result of ${expression} is ${result}`;
    } catch (error) {
      return `Error calculating ${expression}: ${error.message}`;
    }
  },
  {
    name: "calculator",
    description: "Perform basic mathematical calculations",
    schema: z.object({
      expression: z.string().describe("Mathematical expression to evaluate (e.g., '2 + 2', '10 * 5')"),
    }),
  }
);

// Define the tools for the agent to use
const agentTools = [weatherTool, calculatorTool];
const agentModel = new Ollama({
  model: "llama3.1:latest", // Make sure this model is available in your Ollama
  temperature: 0,
  maxRetries: 2,
});
// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});

// Now it's time to use!
const agentFinalState = await agent.invoke(
  { messages: [new HumanMessage("what is the current weather in sf")] },
  { configurable: { thread_id: "42" } },
);

console.log(
  agentFinalState.messages[agentFinalState.messages.length - 1].content,
);

const agentNextState = await agent.invoke(
  { messages: [new HumanMessage("what about ny")] },
  { configurable: { thread_id: "42" } },
);

console.log(
  agentNextState.messages[agentNextState.messages.length - 1].content,
);