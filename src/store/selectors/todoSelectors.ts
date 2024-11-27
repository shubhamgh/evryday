// /src/store/selectors/todoSelectors.ts
import { selector } from "recoil";
import { todoListState } from "../atoms/todoAtom";
import { filterState } from "../atoms/filterAtom";

export const filteredTodosSelector = selector({
  key: "filteredTodosSelector",
  get: ({ get }) => {
    const todos = get(todoListState);
    const filter = get(filterState);

    if (filter === "Completed") {
      return todos.filter((todo) => todo.completed);
    }
    if (filter === "Pending") {
      return todos.filter((todo) => !todo.completed);
    }
    return todos; // "All"
  },
});
