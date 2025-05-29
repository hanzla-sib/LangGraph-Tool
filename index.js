import { Ollama } from "@langchain/community/llms/ollama";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

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
  model: "llama3.1", // or "llama2", "codellama", "mistral", etc.
  baseUrl: "http://localhost:11434", // default Ollama URL
});

const tools = [multiply, divide, add, subtract];
const toolNames = tools.map((tool) => tool.name);

const toolsByName = Object.fromEntries(
  tools.map((tool) => [tool.name, tool])
);

const llmWithTools = llm.bindTools(tools);