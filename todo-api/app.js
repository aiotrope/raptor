import * as todoService from './services/todoService.js';
import { cacheMethodCalls } from './util/cacheUtil.js';

//* Using redis caching
const cachedTodoService = cacheMethodCalls(todoService, [
  'createTodo',
  'deleteTodo',
]);

const handleGetAllTodos = async () => {
  try {
    const todos = await cachedTodoService.getAllTodos();
    return Response.json(todos, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 422 });
  }
};

const handleGetTodo = async (_request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    const todo = await cachedTodoService.getTodo(id);
    return Response.json(todo, { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 404 });
  }
};

const handleCreateTodo = async (request) => {
  try {
    const body = await request.text();
    const json = await JSON.parse(body);

    if (json?.item?.length > 0 || json?.item !== '') {
      await cachedTodoService.createTodo(json.item);
      return Response.json(json, { status: 200 });
    } else {
      return new Response('Cannot create todo!', { status: 400 });
    }
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
};

const handleDeleteTodo = async (_request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;

  try {
    await cachedTodoService.deleteTodo(id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(err.message, { status: 404 });
  }
};

const urlMapping = [
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleGetAllTodos,
  },
  {
    method: 'GET',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleGetTodo,
  },
  {
    method: 'POST',
    pattern: new URLPattern({ pathname: '/todos' }),
    fn: handleCreateTodo,
  },
  {
    method: 'DELETE',
    pattern: new URLPattern({ pathname: '/todos/:id' }),
    fn: handleDeleteTodo,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response('Not found', { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);

  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

const handleHttpConnection = async (conn) => {
  for await (const requestEvent of Deno.serveHttp(conn)) {
    requestEvent.respondWith(await handleRequest(requestEvent.request));
  }
};

const portConfig = { port: 7777, hostname: '0.0.0.0' };

for await (const conn of Deno.listen(portConfig)) {
  handleHttpConnection(conn);
}
