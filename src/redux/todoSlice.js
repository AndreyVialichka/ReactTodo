import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const responce = await fetch("http://localhost:7000/todos");
    if (responce.ok) {
      const todos = await responce.json();
      return { todos };
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (payload) => {
    const responce = await fetch("http://localhost:7000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: payload.title }),
    });

    if (responce.ok) {
      const todo = await responce.json();
      return { todo };
    }
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  "todos/toggleCompleteAsync",
  async (payload) => {
    const responce = await fetch(`http://localhost:7000/todos/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: payload.completed }),
    });

    if (responce.ok) {
      const todo = await responce.json();
      return { id: todo.id, completed: todo.completed };
    }
  }
);

export const deleteTODOAsync = createAsyncThunk(
  "todos/deleteTODOAsync",
  async (payload) => {
    const responce = await fetch(`http://localhost:7000/todos/${payload.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (responce.ok) {
      return { id: payload.id };
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: [
    { id: 1, title: "td1", completed: false },
    { id: 2, title: "td2", completed: false },
    { id: 3, title: "td3", completed: true },
  ],
  reducers: {
    addTodo: (state, action) => {
      const newTask = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTask);
    },

    toggleComplite: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },

    deleteTodo: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state.splice(index, index);
    },
  },
  extraReducers: {
    [getTodosAsync.fulfilled]: (state, action) => {
      return action.payload.todos;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    [deleteTODOAsync.fulfilled]: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
  },
});

export const { addTodo, toggleComplite, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
