import { Dispatch } from "redux";

import { TodoListsLocalType, TodolistDomainType } from "../App";
import { todoListsAPI } from "../api/todolists-api";

export type FilterValuesType = "all" | "active" | "completed";

type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
//export to store.ts
export type TodoListsActionsType =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ChangeTodolistTitleActionType
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodoListsAC>;

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: TodoListsActionsType,
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter(tl => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      return [{ ...action.todoList, filter: "all" }, ...state];
    }
    case "CHANGE-TODOLIST-TITLE": {
      const todolist = state.find(tl => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find(tl => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter;
      }
      return [...state];
    }
    case "SET_TODO_LISTS": {
      return action.todoLists.map(tl => ({ ...tl, filter: "all" }));
    }

    default:
      return state;
  }
};

export const removeTodolistAC = (todolistId: string) =>
  ({ type: "REMOVE-TODOLIST", id: todolistId } as const);

export const addTodolistAC = (todoList: TodoListsLocalType) =>
  ({ type: "ADD-TODOLIST", todoList } as const);

export const changeTodolistTitleAC = (
  id: string,
  title: string,
): ChangeTodolistTitleActionType => {
  return { type: "CHANGE-TODOLIST-TITLE", id: id, title: title };
};
export const changeTodolistFilterAC = (
  id: string,
  filter: FilterValuesType,
) => {
  return {
    type: "CHANGE-TODOLIST-FILTER",
    id: id,
    filter: filter,
  } as const;
};

export const setTodoListsAC = (
  todoLists: Array<TodoListsLocalType>,
) => ({ type: "SET_TODO_LISTS", todoLists } as const);

export const fetchTodoListsThunk = async (
  //!жестко устанавливаю возможность,что dispatch принимает только setTodoListAC
  //! это первый вариант типизации санки
  dispatch: Dispatch<ReturnType<typeof setTodoListsAC>>,
) => {
  let res;
  try {
    res = await todoListsAPI.getTodLists();
    dispatch(setTodoListsAC(res.data));
  } catch (error) {
    throw Error(`${error}`);
  }

  // todoListsAPI.getTodLists().then(res => {

  //   dispatch(setTodoListsAC(res.data));
  // });
};
export const addTodoListTC =
  //! второй вариант типизации - это использовать ActionsType, который содержит типы всех текущих для todolists-reducer.ts action creators


    (title: string) =>
    async (dispatch: Dispatch<TodoListsActionsType>) => {
      try {
        const res = await todoListsAPI.postTodoList(title);
        res.data.resultCode === 0 &&
          dispatch(addTodolistAC(res.data.data.item));
      } catch (error) {
        throw Error(`${error}`);
      }
    };

export const deleteTodoListTC =
  //! третий вариант типизации - это создать в store.ts общий AppActionType, который состоит from TodoListActionType and TaskActionType
  (id: string) => async (dispatch: Dispatch) => {
    try {
      const res = await todoListsAPI.deleteTodoList(id);
      res.data.resultCode === 0 && dispatch(removeTodolistAC(id));
    } catch (error) {
      throw Error(`${error}`);
    }
  };
