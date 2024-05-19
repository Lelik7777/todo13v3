import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "7a84b855-29b5-4a5d-a4fc-ede95c3911e7",
    Authorization: "Bearer 556fcc93-423e-4b6d-8ab6-f568a2e5da97",
  },
});

export type ResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: T;
};

export type TodoListType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
// по умолчанию здесь значениям назначаются цифровые значения, начиная с 0 и далее по порядку, поэтому не нужно явно присваивать значения New=0,InProgress=1 и тд
export enum TaskStatus {
  New,
  InProgress,
  Completed,
  Draft,
}
export enum TaskPriority {
  Low,
  Middle,
  Hi,
  Urgently,
  Later,
}
export type TaskType = {
  description?: string;
  title: string;
  completed?: boolean;
  status: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  deadline?: string;
  id: string;
  todoListId: string;
  order?: number;
  addedDate?: string;
};
export type ResponseTaskType = {
  totalCount: number;
  error: string;
  items: Array<TaskType>;
};
export type ResponseAuthMeType = {
  id: number;
  email: string;
  login: string;
};

export const todoListsAPI = {
  getTodLists() {
    return instance.get<Array<TodoListType>>("todo-lists");
  },
  postTodoList(title: string) {
    return instance.post<ResponseType<{ item: TodoListType }>>(
      "todo-lists",
      { title },
    );
  },
  deleteTodoList(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodoList(title: string, id: string) {
    return instance.put(`todo-lists/${id}`, { title });
  },
  getTodoListTasks(todolistId: string) {
    return instance.get<ResponseTaskType>(
      `todo-lists/${todolistId}/tasks`,
    );
  },
  addTaskTodoList<T>(todolistId: T, title: T) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks`,
      { title },
    );
  },
  deleteTask<T>(todolistId: T, taskId: T) {
    return instance.delete<ResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
    );
  },
  updateTodoListTask<T>(todolistId: T, taskId: T, title: T) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      { title },
    );
  },
  getAuthMe() {
    return instance.get<ResponseType<ResponseAuthMeType>>("auth/me");
  },
  postAuthMe() {
    return instance.post<ResponseType<{ userId: number }>>(
      "auth/login",
      {
        email: "lelik21212121@gmail.com ",
        password: "enter_free",
      },
    );
  },
};
