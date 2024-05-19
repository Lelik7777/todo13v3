import { Menu } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddItemForm } from "./AddItemForm";
import "./App.css";
import { Todolist } from "./Todolist";
import {
  TaskStatus,
  TaskType,
  TodoListType,
} from "./api/todolists-api";
import { AppDispatch, AppRootStateType } from "./state/store";
import {
  addTaskAC,
  addTaskTC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  deleteTaskTC,
  removeTaskAC,
  updateTaskTC,
} from "./state/tasks-reducer";
import {
  FilterValuesType,
  addTodoListTC,
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  deleteTodoListTC,
  fetchTodoListsThunk,
  removeTodolistAC,
} from "./state/todolists-reducer";

// export type TodolistType = {
//   id: string;
//   title: string;
//   filter: FilterValuesType;
// };
export type TodoListsLocalType = Pick<TodoListType, "id" | "title">;
export type TodolistDomainType = TodoListsLocalType & {
  filter: FilterValuesType;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const todolists = useSelector<
    AppRootStateType,
    Array<TodolistDomainType>
  >(state => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    state => state.tasks,
  );
  //const dispatch = useAppDispatch();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTodoListsThunk);
  }, []);
  const removeTask = useCallback(function (
    id: string,
    todolistId: string,
  ) {
    // const action = removeTaskAC(id, todolistId);
    // dispatch(action);
    dispatch(deleteTaskTC(id, todolistId));
  },
  []);

  const addTask = useCallback(function (
    title: string,
    todolistId: string,
  ) {
    dispatch(addTaskTC(title, todolistId));
    // const action = addTaskAC(title, todolistId);
    // dispatch(action);
  },
  []);

  const changeStatus = useCallback(function (
    id: string,
    status: TaskStatus,
    todolistId: string,
  ) {
    const action = changeTaskStatusAC(id, status, todolistId);
    dispatch(action);
  },
  []);

  const changeTaskTitle = useCallback(function (
    id: string,
    newTitle: string,
    todolistId: string,
  ) {
    // const action = changeTaskTitleAC(id, newTitle, todolistId);
    // dispatch(action);
    dispatch(updateTaskTC(todolistId, id, newTitle));
  },
  []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string,
  ) {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
  },
  []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(deleteTodoListTC(id));
    // const action = removeTodolistAC(id);
    // dispatch(action);
  }, []);

  const changeTodolistTitle = useCallback(function (
    id: string,
    title: string,
  ) {
    const action = changeTodolistTitleAC(id, title);
    dispatch(action);
  },
  []);

  const addTodolist = useCallback(
    (title: string) => {
      // const action = addTodolistAC(title);
      // dispatch(action);
      dispatch(addTodoListTC(title));
    },
    [dispatch],
  );

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map(tl => {
            let allTodolistTasks = tasks[tl.id];

            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    id={tl.id}
                    title={tl.title}
                    tasks={allTodolistTasks}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
