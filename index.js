import { Tool } from "@langchain/core/tools";
import { z } from "zod";
const multiply = Tool(
  async (a, b) => {
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

const divide = Tool(
  async (a, b) => {
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

const add = Tool(
  async (a, b) => {
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
const subtract = Tool(
  async (a, b) => {
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
