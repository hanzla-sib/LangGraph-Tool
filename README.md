# 🚀 LangChain Tools Tutorial

A simple, beginner-friendly example showing how AI can use tools to get information and perform calculations using LangChain.

## 📋 Table of Contents
- [What is LangChain?](#what-is-langchain)
- [What is LangGraph?](#what-is-langgraph)
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Code Explanation](#code-explanation)
- [Tools Used](#tools-used)
- [How It Works](#how-it-works)
- [Understanding the Output](#understanding-the-output)
- [Next Steps](#next-steps)

## 🤖 What is LangChain?

**LangChain** is a framework that helps developers build applications with Large Language Models (LLMs). It provides:
- **Tools**: Functions that AI can call to get information or perform tasks
- **Chains**: Sequences of operations that can be linked together
- **Agents**: AI systems that can decide which tools to use and when
- **Memory**: Ways to store and recall information across conversations

## 🔗 What is LangGraph?

**LangGraph** is an extension of LangChain that helps build **stateful, multi-actor applications** with LLMs. Think of it as:
- **State Management**: Keeps track of conversation history and context
- **Graph-based Workflows**: Creates complex workflows where AI can make decisions
- **Multi-step Reasoning**: AI can plan, execute, and reflect on multiple steps
- **Tool Integration**: Seamlessly connects AI with external tools and APIs

**Key Differences:**
- **LangChain**: Basic tools and chains for simple AI applications
- **LangGraph**: Advanced state management for complex, multi-step AI workflows

## 🎯 Project Overview

This tutorial demonstrates the **foundation** of what makes LangGraph powerful - **AI agents that can use tools**. While this example uses basic LangChain, it shows the core concepts that LangGraph builds upon:

- ✅ **Tool Creation**: How to create functions AI can call
- ✅ **Tool Binding**: How to give AI access to tools
- ✅ **Conversation Flow**: How AI decides when to use tools
- ✅ **State Management**: How to maintain conversation context

## 📋 Prerequisites

Before you start, make sure you have:

1. **Node.js** (version 18 or higher)
   ```bash
   node --version
   ```

2. **Ollama** installed and running
   - Download from: https://ollama.ai/
   - Install the `llama3.1:latest` model:
   ```bash
   ollama pull llama3.1:latest
   ```

3. **Basic JavaScript knowledge** (understanding of functions, async/await)

## 🛠️ Installation

1. **Clone or download** this project
2. **Navigate** to the project directory:
   ```bash
   cd c:\projects\LangGraph-Tools\LangGraph-Tool
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## 🚀 How to Run

1. **Make sure Ollama is running** (should start automatically)
2. **Run the example**:
   ```bash
   node index.js
   ```

3. **Watch the magic happen!** The AI will:
   - Get weather information for New York
   - Calculate 25 + 17
   - Provide a final answer

## 🔍 Code Explanation

### 📁 File Structure
```
LangGraph-Tool/
├── index.js          # Main tutorial code
├── package.json       # Dependencies
└── README.md         # This file
```

### 🛠️ Step 1: Tool Creation
```javascript
const weatherTool = tool(
  ({ location }) => {
    // This function runs when AI calls the tool
    return `The weather in ${location} is sunny and 72°F`;
  },
  {
    name: "get_weather",              // Tool name AI will see
    description: "Get current weather", // What the tool does
    schema: z.object({                // What data it expects
      location: z.string()
    })
  }
);
```

### 🤖 Step 2: AI Model Setup
```javascript
const aiModel = new ChatOllama({
  model: "llama3.1:latest"
});

// Give AI access to tools
const aiWithTools = aiModel.bindTools([weatherTool, mathTool]);
```

### 💬 Step 3: Conversation Loop
```javascript
async function askAI(question) {
  let messages = [{ role: "user", content: question }];
  
  while (true) {
    const aiResponse = await aiWithTools.invoke(messages);
    
    if (aiResponse.tool_calls) {
      // AI wants to use tools - run them
      // Add results back to conversation
    } else {
      // AI is done - show final answer
      break;
    }
  }
}
```

## 🔧 Tools Used

### 1. **Weather Tool** 🌤️
- **Purpose**: Get weather information for any city
- **Input**: City name (string)
- **Output**: Weather description
- **Example**: `"The weather in New York is sunny and 72°F"`

### 2. **Math Tool** 🧮
- **Purpose**: Add two numbers together
- **Input**: Two numbers (a, b)
- **Output**: Calculation result
- **Example**: `"25 + 17 = 42"`

## ⚙️ How It Works

1. **User asks a question** → `"What's the weather in New York? Also, what is 25 + 17?"`

2. **AI analyzes the question** → Realizes it needs both weather and math tools

3. **AI calls tools** → 
   - `get_weather(location: "New York")`
   - `add_numbers(a: 25, b: 17)`

4. **Tools execute and return results** →
   - Weather: `"The weather in New York is sunny and 72°F"`
   - Math: `"25 + 17 = 42"`

5. **AI combines results** → Provides a complete answer using both tool results

## 📊 Understanding the Output

When you run the code, you'll see:

```bash
🎯 Welcome to LangChain Tools Tutorial!

❓ Question: What's the weather in New York? Also, what is 25 + 17?
==================================================

📍 Step 1: AI is thinking...
💭 AI says: I'll help you with both questions!

🔧 AI wants to use 2 tool(s):

⚡ Running tool: get_weather
   📝 With data: {"location": "New York"}
   🌤️  Getting weather for: New York
   ✅ Result: The weather in New York is sunny and 72°F

⚡ Running tool: add_numbers
   📝 With data: {"a": 25, "b": 17}
   🧮  Calculating: 25 + 17
   ✅ Result: 25 + 17 = 42

📍 Step 2: AI is thinking...

🎯 Final Answer: Based on the information I gathered:

1. The weather in New York is sunny and 72°F
2. 25 + 17 = 42

====================================================
✨ Done!
```

## 🎓 Key Learning Points

1. **Tools are just functions** that AI can call
2. **AI decides automatically** which tools to use and when
3. **Conversation flows naturally** - AI can use multiple tools in sequence
4. **Results are passed back** to AI for final response generation
5. **Error handling** ensures the system keeps working even if tools fail

## 🚀 Next Steps

Now that you understand the basics, you can:

### 🔧 **Extend This Example:**
- Add more tools (calculator, database lookup, API calls)
- Create tools that call real APIs (weather, stock prices, etc.)
- Add tools that can write files or send emails

### 📈 **Move to LangGraph:**
- Build **stateful conversations** that remember context
- Create **multi-step workflows** with decision points
- Add **human-in-the-loop** interactions
- Build **complex agent systems** with multiple AI actors

### 🌟 **Real-World Applications:**
- **Customer Service Bots** that can check orders and update accounts
- **Research Assistants** that can search databases and compile reports
- **Automation Systems** that can monitor and control external systems
- **Personal Assistants** that can manage calendars and send messages

## 📚 Additional Resources

- **LangChain Documentation**: https://js.langchain.com/
- **LangGraph Documentation**: https://langchain-ai.github.io/langgraph/
- **Ollama Documentation**: https://ollama.ai/
- **LangChain Tools Guide**: https://js.langchain.com/docs/modules/tools/

## 🤝 Contributing

This is a learning project! Feel free to:
- Add more example tools
- Improve the documentation
- Create more complex examples
- Share your own LangChain/LangGraph projects

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy coding! 🎉** 

*Remember: This simple example is the foundation for building powerful AI agents with LangGraph. Master these concepts, and you'll be ready to build amazing AI applications!*
