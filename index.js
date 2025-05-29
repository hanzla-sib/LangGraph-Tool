import { Ollama } from "@langchain/community/llms/ollama";
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { tool } from "@langchain/core/tools";
import { StateGraph, messagesStateReducer, Annotation } from "@langchain/langgraph";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";

// Define the graph state
const GraphState = Annotation.Root({
  messages: Annotation({
    reducer: messagesStateReducer,
  }),
});

const multiply = tool(
  async ({ a, b }) => {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Both arguments must be numbers");
    }
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiplies two numbers together",
    schema: z.object({
      a: z.number().describe("The first number to multiply"),
      b: z.number().describe("The second number to multiply"),
    }),
  }
);

const divide = tool(
  async ({ a, b }) => {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Both arguments must be numbers");
    }
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  },
  {
    name: "divide",
    description: "Divides the first number by the second number",
    schema: z.object({
      a: z.number().describe("The numerator"),
      b: z.number().describe("The denominator"),
    }),
  }
);

const add = tool(
  async ({ a, b }) => {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Both arguments must be numbers");
    }
    return a + b;
  },
  {
    name: "add",
    description: "Adds two numbers together",
    schema: z.object({
      a: z.number().describe("The first number to add"),
      b: z.number().describe("The second number to add"),
    }),
  }
);

const subtract = tool(
  async ({ a, b }) => {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("Both arguments must be numbers");
    }
    return a - b;
  },
  {
    name: "subtract",
    description: "Subtracts the second number from the first number",
    schema: z.object({
      a: z.number().describe("The number to subtract from"),
      b: z.number().describe("The number to subtract"),
    }),
  }
);

// Initialize Ollama with a local model
const llm = new Ollama({
  model: "llama3.1",
  baseUrl: "http://localhost:11434",
});

const tools = [multiply, divide, add, subtract];
const toolNode = new ToolNode(tools);

// Bind tools to the LLM
const llmWithTools = llm.bindTools(tools);

// Define the agent node
async function callModel(state) {
  const { messages } = state;
  const response = await llmWithTools.invoke(messages);
  return { messages: [response] };
}

// Function to determine if we should continue or end
function shouldContinue(state) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  
  // If the last message has tool calls, continue to tools
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  // Otherwise, end the conversation
  return "__end__";
}

// Create the graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

// Compile the graph
const app = workflow.compile();

// Function to run the agent
async function runAgent(query) {
  console.log(`\n🤖 User Query: ${query}`);
  console.log("=" + "=".repeat(50));
  
  const initialState = {
    messages: [new HumanMessage(query)]
  };
  
  const result = await app.invoke(initialState);
  const finalMessage = result.messages[result.messages.length - 1];
  
  console.log(`\n✅ Final Answer: ${finalMessage.content}`);
  return finalMessage.content;
}

// Example usage and test cases
async function main() {
  try {
    console.log("🚀 Starting LangGraph Calculator Agent with Ollama");
    console.log("📊 Available tools: multiply, divide, add, subtract");
    
    // Test cases
    const testQueries = [
      "What is 15 + 25?",
      "Calculate 144 divided by 12",
      "What's 7 times 8?", 
      "Subtract 30 from 100",
      "Calculate (10 + 5) * 3",
      "What's 50 / 2 + 10 * 3?"
    ];
    
    for (const query of testQueries) {
      await runAgent(query);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between queries
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the main function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { app, runAgent };