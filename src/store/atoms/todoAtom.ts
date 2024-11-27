// /src/store/atoms/todoAtom.ts
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const todoListState = atom<Todo[]>({
  key: 'todoListState',
  default: [],
  effects_UNSTABLE: [persistAtom], // Enable persistence
});
