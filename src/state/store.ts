import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
} from "redux";
import {
  ThunkAction,
  ThunkDispatch,
  ThunkMiddleware,
  thunk,
} from "redux-thunk";
import { TasksActionsType, tasksReducer } from "./tasks-reducer";
import {
  TodoListsActionsType,
  todolistsReducer,
} from "./todolists-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppActionsType = TodoListsActionsType | TasksActionsType;
// это позволяет теперь useDispatch протипизировать этим типом,чтобы оно смог принимать не только объекты, но и функции
export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  AppActionsType
>;

// Define the thunk type это универсальный тип для thunk creator
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  //здесь я могу указать вместо AnyAction общий AppActionsType
  AppActionsType
>;

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk as ThunkMiddleware<AppRootStateType, AnyAction>,
  ),
);
// export type AppThunkDispatch = ThunkDispatch<
//   AppRootStateType,
//   any,
//   AnyAction
// >;

// теперь его мы используем везде, где нам нужен dispach, вместо useDispatch()
//export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
