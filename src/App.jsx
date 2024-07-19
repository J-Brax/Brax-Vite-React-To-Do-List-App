import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [inputValue, setInputValue] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateTasks = (newTasks) => {
    setUndoStack([...undoStack, tasks]);
    setTasks(newTasks);
  };

  const addTask = () => {
    if (inputValue === "") {
      alert("Please enter a task");
      return;
    }
    updateTasks([...tasks, { text: inputValue, checked: false }]);
    console.log(`Task added: ${inputValue}`);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    } else if (e.ctrlKey && e.key === 'z') {
      handleUndo();
    } else if (e.ctrlKey && e.key === 'y') {
      handleRedo();
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      setRedoStack([...redoStack, tasks]);
      setTasks(undoStack[undoStack.length - 1]);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      setUndoStack([...undoStack, tasks]);
      setTasks(redoStack[redoStack.length - 1]);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
    }
  };

  const handleTaskClick = (index) => {
    const newTasks = tasks.map((task, i) => 
      i === index ? { ...task, checked: !task.checked } : task
    );
    updateTasks(newTasks);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks);
  };

  return (
    <div className="container">
      <img className="logo" src="/src/assets/logo.png" alt="Logo" />
      <div className="todo-app">
        <h1>
          <img className="brax" src="/src/assets/brax-text.png" alt="Brax logo" /> to-do list
        </h1>
        <div className="row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task"
          />
          <button onClick={addTask}>Enter</button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              className={task.checked ? "checked" : ""}
              onClick={() => handleTaskClick(index)}
            >
              {task.text}
              <span onClick={(e) => {
                e.stopPropagation();
                handleRemoveTask(index);
              }}>×</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
