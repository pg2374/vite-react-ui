import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

type Todo = {
  id: string;
  content: string;
};

type CreateTodoInput = {
  content: string;
};

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

// Mock client for local development
const mockClient = {
  models: {
    Todo: {
      observeQuery: () => ({
        subscribe: ({ next }: { next: (data: { items: Todo[] }) => void }) => {
          next({ items: [{ id: "1", content: "Mock Todo Item" }] });
          return { unsubscribe: () => {} };
        },
      }),
      create: (data: CreateTodoInput): Promise<Todo> => {
        console.log("Creating mock todo:", data);
        return Promise.resolve({ id: Date.now().toString(), ...data });
      },
    },
  },
};

// Only configure Amplify in production
// Define a type for our client based on the Schema
type AmplifyClient = ReturnType<typeof generateClient<Schema>>;

// Initialize with undefined, then assign in the try block
let generatedClient: AmplifyClient | undefined;
if (!isDevelopment) {
  try {
    // We're relying on Amplify's auto-configuration in production
    generatedClient = generateClient<Schema>();
  } catch (error) {
    console.error("Failed to generate Amplify client:", error);
  }
}

// Use the appropriate client based on environment
const client = isDevelopment
  ? mockClient
  : (generatedClient as unknown as typeof mockClient);

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (isDevelopment) {
      // Mock data for development
      setTodos([{ id: "1", content: "Mock Todo Item" }]);
    } else {
      // Real data in production
      client.models.Todo.observeQuery().subscribe({
        next: (data: { items: Todo[] }) => setTodos([...data.items]),
      });
    }
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      if (isDevelopment) {
        setTodos([...todos, { id: Date.now().toString(), content }]);
      } else {
        // Use the real client in production
        client.models.Todo.create({ content });
      }
    }
  }

  return (
    <main>
      <h1>My todos {isDevelopment ? "(Development Mode)" : ""}</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
