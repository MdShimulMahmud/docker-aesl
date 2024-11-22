/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/todos";

const App = () => {
  const [todos, setTodos] = useState([]);

  // Fetch all todos
  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  };

  // Add a new todo
  const addTodo = async (task) => {
    if (task.trim()) {
      const response = await axios.post(API_URL, { task });
      setTodos([...todos, response.data]);
    }
  };

  // Toggle completion
  const toggleTodo = async (id, completed) => {
    const response = await axios.put(`${API_URL}/${id}`, {
      completed: !completed,
    });
    setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <InputForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>
    </div>
  );
};

const Header = () => (
  <header>
    <h1>Todo App</h1>
  </header>
);

const InputForm = ({ onAdd }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(task);
    setTask("");
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button type="submit">Add</button>
    </form>
  );
};

const TodoList = ({ todos, onToggle, onDelete }) => (
  <ul className="todo-list">
    {todos.map((todo) => (
      <TodoItem
        key={todo._id}
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    ))}
  </ul>
);

const TodoItem = ({ todo, onToggle, onDelete }) => (
  <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
    <span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id, todo.completed)}
      />
      {todo.task}
    </span>
    <span>
      <button
        className="complete"
        onClick={() => onToggle(todo._id, todo.completed)}
      >
        {todo.completed ? "Undo" : "Complete"}
      </button>
      <button className="delete" onClick={() => onDelete(todo._id)}>
        Delete
      </button>
    </span>
  </li>
);

export default App;
