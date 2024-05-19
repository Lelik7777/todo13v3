import { useEffect, useState } from "react";
import {
  TaskType,
  TodoListType,
  todoListsAPI,
} from "../api/todolists-api";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "API",
};

export const PostAuthMe = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todoListsAPI.postAuthMe().then(res => setState(res.data));
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};
export const GetAuthMe = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todoListsAPI.getAuthMe().then(res => setState(res.data.data));
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const GetTodoLists = () => {
  const [state, setState] =
    useState<Array<TodoListType> | null>(null);
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => setState(res.data));
  }, []);
  return (
    <div>
      <div>{JSON.stringify(state)}</div>
      <hr />
      <div>Length: {state?.length}</div>
    </div>
  );
};

export const AddTodoList = () => {
  const [state, setState] = useState<any>(null);
  const [value, setValue] = useState("");
  const handlePostList = () => {
    todoListsAPI
      .postTodoList(value)
      .then(res => setState(res.data.data.item));
  };
  return (
    <div>
      <div>
        <input
          value={value}
          type="text"
          onChange={e => {
            setValue(e.currentTarget.value);
          }}
        />
      </div>
      <button type="button" onClick={handlePostList}>
        add list
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export const DeleteTodoList = () => {
  const [state, setState] = useState<any>(null);
  const [idList, setIdList] = useState("");
  const [ids, setIds] = useState<Array<string>>([]);
  const [count, setCount] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
      setCount(ids.length);
      setIsDelete(false);
    });
  }, [isDelete]);
  const handleDeleteList = () => {
    todoListsAPI
      .deleteTodoList(idList)
      .then(res => setState(res.data));
    setIdList("");
    setIsDelete(true);
  };
  return (
    <div>
      <div>
        <input
          value={idList}
          type="text"
          onChange={e => {
            setIdList(e.currentTarget.value);
          }}
        />
      </div>
      <button type="button" onClick={handleDeleteList}>
        delete list
      </button>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <div>{JSON.stringify(state)}</div>
      <div>Lists count: {count}</div>
    </div>
  );
};

export const ChangeListTitle = () => {
  const [state, setState] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [ids, setIds] = useState<Array<string>>([]);
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
    });
  }, []);
  const handleUpdateListTitle = () => {
    todoListsAPI
      .updateTodoList(title, id)
      .then(res => setState(res.data));
  };
  return (
    <div>
      <div>
        <input
          placeholder="title"
          value={title}
          type="text"
          onChange={e => {
            setTitle(e.currentTarget.value);
          }}
        />
        <br />
        <input
          placeholder="id"
          value={id}
          type="text"
          onChange={e => {
            setId(e.currentTarget.value);
          }}
        />
      </div>
      <button type="button" onClick={handleUpdateListTitle}>
        change list title
      </button>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export const GetTodoListTasks = () => {
  const [state, setState] = useState<Array<TaskType> | null>(null);
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState<Array<string>>([]);
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
    });
  }, []);
  const handleGetTasks = () => {
    console.log(id);
    if (!id) {
      setId(ids[0]);
    }
    todoListsAPI.getTodoListTasks(id).then(res => {
      setState(res.data.items);
      setCount(res.data.totalCount);
    });
    setId("");
  };

  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <input
        placeholder="id"
        value={id}
        type="text"
        onChange={e => {
          setId(e.currentTarget.value);
        }}
      />
      <br />
      <div>
        {state?.map(item => (
          <div>{item.title}</div>
        ))}
      </div>
      <hr />
      <button onClick={handleGetTasks}>getTasks</button>
      <div>Tasks count: {count}</div>
    </div>
  );
};

export const AddTodoListTask = () => {
  const [state, setState] = useState<any>(null);
  const [idList, setIdList] = useState("");
  const [title, setTitle] = useState("");
  const [ids, setIds] = useState<Array<string>>([]);

  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
    });
  }, []);
  const handleAddTask = () => {
    todoListsAPI
      .addTaskTodoList(idList, title)
      .then(res => setState(res.data.data.item));
    setTitle("");
  };
  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <div>
        <input
          placeholder="id list"
          value={idList}
          type="text"
          onChange={e => {
            setIdList(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="task title"
          value={title}
          type="text"
          onChange={e => {
            setTitle(e.currentTarget.value);
          }}
        />
      </div>
      <button type="button" onClick={handleAddTask}>
        add task
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export const DeleteTodoListTasks = () => {
  const [state, setState] = useState<Array<TaskType> | null>(null);
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState<Array<string>>([]);
  const [taskId, setTaskId] = useState("");
  const [res, setRes] = useState<any>(null);
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
    });
  }, []);
  const handleGetTasks = () => {
    console.log(id);
    if (id) {
      todoListsAPI.getTodoListTasks(id).then(res => {
        setState(res.data.items);
        setCount(res.data.totalCount);
      });
    }
  };
  const handleDeleteTask = () => {
    console.log("id list", id, "task id", taskId);

    if (taskId && id) {
      todoListsAPI
        .deleteTask(id, taskId)
        .then(res => setRes(res.data));
      setId("");
      setTaskId("");
    }
  };
  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <input
        placeholder="idList"
        value={id}
        type="text"
        onChange={e => {
          setId(e.currentTarget.value);
        }}
      />
      <br />
      <div>
        {state?.map(item => (
          <div>{item.title + " : " + item.id}</div>
        ))}
      </div>
      <hr />
      <button onClick={handleGetTasks}>getTasks</button>
      <div>Tasks count: {count}</div>
      <input
        value={taskId}
        type="text"
        placeholder="task id"
        onChange={e => setTaskId(e.currentTarget.value)}
      />
      <br />
      <button onClick={handleDeleteTask}>delete task</button>
      <div>Response:{JSON.stringify(res)}</div>
    </div>
  );
};

export const RenameTodoListTasks = () => {
  const [state, setState] = useState<Array<TaskType> | null>(null);
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState<Array<string>>([]);
  const [taskId, setTaskId] = useState("");
  const [res, setRes] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  useEffect(() => {
    todoListsAPI.getTodLists().then(res => {
      const ids = res.data.map(item => item.id);
      setIds(ids);
    });
  }, []);
  const handleGetTasks = () => {
    console.log(id);
    if (id) {
      todoListsAPI.getTodoListTasks(id).then(res => {
        setState(res.data.items);
        setCount(res.data.totalCount);
      });
    }
  };
  const handleRenameTask = () => {
    if (taskId && id && newTitle) {
      todoListsAPI
        .updateTodoListTask(id, taskId, newTitle)
        .then(res => setRes(res.data));
      //setId("");
      setTaskId("");
    }
  };
  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        Id lists: {JSON.stringify(ids)}
      </div>
      <input
        placeholder="idList"
        value={id}
        type="text"
        onChange={e => {
          setId(e.currentTarget.value);
        }}
      />
      <br />
      <div>
        {state?.map(item => (
          <div>{item.title + " : " + item.id}</div>
        ))}
      </div>
      <hr />
      <button onClick={handleGetTasks}>getTasks</button>
      <div>Tasks count: {count}</div>
      <input
        value={taskId}
        type="text"
        placeholder="task id"
        onChange={e => setTaskId(e.currentTarget.value)}
      />
      <br />
      <input
        value={newTitle}
        type="text"
        placeholder="new task title"
        onChange={e => setNewTitle(e.currentTarget.value)}
      />
      <br />
      <button onClick={handleRenameTask}>rename task</button>
      <div>Response:{JSON.stringify(res)}</div>
    </div>
  );
};
