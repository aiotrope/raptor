import { postgres } from '../deps.js';

const sql = postgres({});

const getAllTodos = async () => {
  const todos = await sql`select * from todos`;

  return todos;
};

const getTodo = async (id) => {
  const todos = await sql`select * from todos where id = ${id}`;

  return todos[0];
};

const createTodo = async (item) => {
  await sql`insert into todos (item) values (${item})`;
};

const deleteTodo = async (id) => {
  await sql`delete from todos where id = ${id}`;
};

export { getAllTodos, getTodo, createTodo, deleteTodo };
