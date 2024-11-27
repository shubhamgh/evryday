import React from "react";
import { useRecoilValue } from "recoil";
import { filteredTodosSelector } from "../../store/selectors/todoSelectors";

const CompletedTodos: React.FC = () => {
  const completedTodos = useRecoilValue(filteredTodosSelector);

  return (
    <div>
      <h2>Completed Todos</h2>
      <ul>
        {completedTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTodos;
