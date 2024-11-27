// /src/components/TodoList.tsx
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { todoListState, Todo } from '../../store/atoms/todoAtom';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useRecoilState(todoListState);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    const newItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newItem]);
    setNewTodo(''); // Reset input
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            {todo.text} {todo.completed ? '(Completed)' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
