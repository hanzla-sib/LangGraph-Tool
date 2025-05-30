// 🎯 SUPER SIMPLE LANGGRAPH FOR BEGINNERS
// Your first LangGraph! Easy to understand nodes and edges 🚀

import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, END, START } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";

console.log("🎯 Welcome to SIMPLE LangGraph!");
console.log("Perfect for learning! Let's build your first AI workflow! 🚀\n");

// 🤖 STEP 1: Set up AI (just like before)
const ai = new ChatOllama({
  model: "llama3.1:latest",
});

// 📊 STEP 2: Define What Flows Between Nodes
// Think of this like a box that carries information
const State = Annotation.Root({
  messages: Annotation({
    reducer: (old, newMessages) => old.concat(newMessages), // Add new messages to old ones
    default: () => [],                                       // Start with empty list
  })
});

// 🧠 STEP 3: Create Node 1 - The Thinking Node
async function thinkingNode(state) {
  console.log("\n🧠 THINKING NODE: AI is thinking...");
  
  // Get the last message (what user asked)
  const userMessage = state.messages[state.messages.length - 1];
  console.log(`❓ User asked: "${userMessage.content}"`);
  
  // Ask AI to respond
  const aiResponse = await ai.invoke([userMessage]);
  console.log(`💭 AI responded: "${aiResponse.content}"`);
  
  // Return the AI's response to add to our message flow
  return {
    messages: [aiResponse]
  };
}

// 🎯 STEP 4: Create Node 2 - The Final Answer Node
async function answerNode(state) {
  console.log("\n🎯 ANSWER NODE: Preparing final answer...");
  
  // Get the AI's response from the previous node
  const aiMessage = state.messages[state.messages.length - 1];
  
  // Create a nice final message
  const finalMessage = new AIMessage(`✨ Final Answer: ${aiMessage.content}`);
  console.log(`🎉 ${finalMessage.content}`);
  
  return {
    messages: [finalMessage]
  };
}

// 🏗️ STEP 5: Build the Graph (Connect the Nodes)
console.log("🏗️ Building the simple graph...");

const simpleGraph = new StateGraph(State)
  // Add our two nodes
  .addNode("thinking", thinkingNode)
  .addNode("answer", answerNode)
  
  // Connect them with edges (arrows)
  .addEdge(START, "thinking")     // START → Thinking Node
  .addEdge("thinking", "answer")  // Thinking → Answer Node  
  .addEdge("answer", END);        // Answer → END

// Compile the graph (make it ready to use)
const app = simpleGraph.compile();

// 🚀 STEP 6: Function to Use Our Graph
async function askQuestion(question) {
  console.log(`\n❓ Your Question: "${question}"`);
  console.log("=" + "=".repeat(50));
  
  // Create initial state with user's question
  const startState = {
    messages: [new HumanMessage(question)]
  };
  
  console.log("🚀 Running the graph...");
  
  // Run the graph!
  const result = await app.invoke(startState);
  
  console.log("\n" + "=".repeat(52));
  console.log("✅ Graph finished!");
  
  return result;
}

// 🎮 STEP 7: Test It!
console.log("\n🎮 Let's test our simple graph!");

await askQuestion("What is 2 + 2?");

console.log("\n" + "=".repeat(52));
console.log("🎉 Congratulations! You just ran your first LangGraph!");
console.log("🔗 This is how AI agents work with nodes and edges!");

// 🎯 BONUS: Let's try another question
console.log("\n🎮 Let's try another question!");
await askQuestion("Tell me a joke about programming");

console.log("\n🌟 Amazing! You're learning LangGraph! 🌟");
