/**
 * LangChain Tools Tutorial - Simple Loop Example
 * Copyright (c) 2025 LangGraph Tutorial Project
 * Licensed under MIT License - see LICENSE file for details
 * 
 * Educational Purpose: Learn basic LangChain tools before LangGraph
 * Repository: https://github.com/hanzla-sib/LangGraph-Tool
 */

// 📚 SIMPLE LANGCHAIN TOOLS TUTORIAL
// This example shows how AI can use tools to get information and do calculations

import { tool } from "@langchain/core/tools";
import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";
import { ToolMessage } from "@langchain/core/messages";

console.log("🎯 Welcome to LangChain Tools Tutorial!");
console.log("This shows how AI can use tools to help answer questions\n");

// 🛠️ STEP 1: Create Tools
// Tools are functions that the AI can call to get information or do tasks

// Weather Tool - pretends to get weather information
const weatherTool = tool(
  ({ location }) => {
    console.log(`  🌤️  Getting weather for: ${location}`);
    return `The weather in ${location} is sunny and 72°F`;
  },
  {
    name: "get_weather",
    description: "Get current weather for a location",
    schema: z.object({
      location: z.string().describe("City name like 'San Francisco'"),
    }),
  }
);

// Math Tool - adds two numbers
const mathTool = tool(
  ({ a, b }) => {
    console.log(`  🧮  Calculating: ${a} + ${b}`);
    return `${a} + ${b} = ${a + b}`;
  },
  {
    name: "add_numbers",
    description: "Add two numbers together",
    schema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
  }
);

// 🤖 STEP 2: Set up AI Model
console.log("🤖 Setting up AI model...");
const aiModel = new ChatOllama({
  model: "llama3.1:latest",
});

// Give the AI access to our tools
const aiWithTools = aiModel.bindTools([weatherTool, mathTool]);

// 💬 STEP 3: Simple Function to Chat with AI
async function askAI(question) {
  console.log(`\n❓ Question: ${question}`);
  console.log("=" + "=".repeat(50));
  
  // Start conversation
  let messages = [{ role: "user", content: question }];
  let stepNumber = 1;
  
  while (true) {
    console.log(`\n📍 Step ${stepNumber}: AI is thinking...`);
    
    // Get AI's response
    const aiResponse = await aiWithTools.invoke(messages);
    
    // Show what AI said
    if (aiResponse.content) {
      console.log(`💭 AI says: ${aiResponse.content}`);
    }
    
    // Check if AI wants to use tools
    if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
      console.log(`\n🔧 AI wants to use ${aiResponse.tool_calls.length} tool(s):`);
      
      // Add AI's message to conversation
      messages.push(aiResponse);
      
      // Run each tool the AI requested
      for (const toolRequest of aiResponse.tool_calls) {
        console.log(`\n⚡ Running tool: ${toolRequest.name}`);
        console.log(`   📝 With data:`, toolRequest.args);
        
        try {
          let result;
          
          // Run the correct tool
          if (toolRequest.name === "get_weather") {
            result = await weatherTool.invoke(toolRequest.args);
          } else if (toolRequest.name === "add_numbers") {
            result = await mathTool.invoke(toolRequest.args);
          }
          
          console.log(`   ✅ Result: ${result}`);
          
          // Tell AI what the tool returned
          messages.push(new ToolMessage({
            content: result,
            tool_call_id: toolRequest.id
          }));
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
          messages.push(new ToolMessage({
            content: `Error: ${error.message}`,
            tool_call_id: toolRequest.id
          }));
        }
      }
      
      stepNumber++;
      
    } else {
      // AI is done - no more tools needed
      console.log(`\n🎯 Final Answer: ${aiResponse.content}`);
      console.log("\n" + "=".repeat(52));
      console.log("✨ Done!");
      break;
    }
  }
}

// 🚀 STEP 4: Test it!
console.log("\n🚀 Let's test our AI with tools!");

// Try asking a question that needs both tools
await askAI("What's the weather in New York? Also, what is 25 + 17?");