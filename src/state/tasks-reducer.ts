import { Dispatch } from "redux";
import { TasksStateType } from "../App";
import {
  TaskStatus,
  TaskType,
  todoListsAPI,
} from "../api/todolists-api";
import { AppRootStateType, AppThunk } from "./store";
import {
  addTodolistAC,
  removeTodolistAC,
  setTodoListsAC,
} from "./todolists-reducer";

export type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  todolistId: string;
  taskId: string;
};

export type AddTaskActionType = {
  type: "ADD-TASK";
  task: TaskType;
};

export type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS";
  todolistId: string;
  taskId: string;
  status: TaskStatus;
};

export type TasksActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof setTodoListsAC>
  | ReturnType<typeof setTasksAC>;

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: TasksActionsType,
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      const tasks = stateCopy[action.todolistId];
      const newTasks = tasks.filter(t => t.id != action.taskId);
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }
    case "ADD-TASK": {
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    }
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map(task =>
          task.id === action.taskId
            ? { ...task, status: action.status }
            : task,
        ),
      };
    }
    case "CHANGE-TASK-TITLE": {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      let newTasksArray = todolistTasks.map(t =>
        t.id === action.taskId ? { ...t, title: action.title } : t,
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.todoList.id]: [],
      };
    }
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }
    case "SET_TODO_LISTS": {
      const copy = { ...state };
      action.todoLists.forEach(tl => {
        copy[tl.id] = [];
      });
      return copy;
    }
    case "SET_TASKS": {
      const copy = { ...state };
      copy[action.todoListId] = action.tasks;
      return copy;
    }
    default:
      return state;
  }
};

export const removeTaskAC = (
  taskId: string,
  todolistId: string,
): RemoveTaskActionType => {
  return {
    type: "REMOVE-TASK",
    taskId: taskId,
    todolistId: todolistId,
  };
};
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return { type: "ADD-TASK", task };
};
export const changeTaskStatusAC = (
  taskId: string,
  status: TaskStatus,
  todolistId: string,
): ChangeTaskStatusActionType => {
  return { type: "CHANGE-TASK-STATUS", status, todolistId, taskId };
};
export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todolistId: string,
) =>
  ({ type: "CHANGE-TASK-TITLE", title, todolistId, taskId } as const);

export const setTasksAC = (
  todoListId: string,
  tasks: Array<TaskType>,
) =>
  ({
    type: "SET_TASKS",
    todoListId,
    tasks,
  } as const);

// thunks
export const fetchTasksTC = (todoListId: string): AppThunk => {
  return async (dispatch, getState: () => AppRootStateType) => {
    try {
      const res = await todoListsAPI.getTodoListTasks(todoListId);
      dispatch(setTasksAC(todoListId, res.data.items));
    } catch (error) {
      throw Error(`${error}`);
    }
  };
};

export const deleteTaskTC = (
  taskId: string,
  todoListId: string,
): AppThunk => {
  return async dispatch => {
    try {
      const res = await todoListsAPI.deleteTask(todoListId, taskId);
      res.data.resultCode === 0 &&
        dispatch(removeTaskAC(taskId, todoListId));
    } catch (error) {
      throw Error(`${error}`);
    }
  };
};

export const addTaskTC =
  (title: string, tlId: string): AppThunk =>
  async dispatch => {
    try {
      const res = await todoListsAPI.addTaskTodoList(tlId, title);
      res.data.resultCode === 0 &&
        dispatch(addTaskAC(res.data.data.item));
    } catch (error) {
      throw Error(`${error}`);
    }
  };

export const updateTaskTC =
  (tlId: string, taskId: string, title: string): AppThunk =>
  async dispatch => {
    try {
      const res = await todoListsAPI.updateTodoListTask(
        tlId,
        taskId,
        title,
      );
      res.data.resultCode === 0 &&
        dispatch(changeTaskTitleAC(taskId, title, tlId));
    } catch (error) {}
  };
