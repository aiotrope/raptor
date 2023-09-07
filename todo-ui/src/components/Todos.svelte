<script>
  import { onMount } from 'svelte';
  import { todoItems } from './todoStore';

  let item;

  const url = '/api/todos'; // or http://localhost:7800/api/todos

  //* GET fetch all todos
  onMount(async function () {
    try {
      const response = await fetch(url);
      $todoItems = await response.json();
    } catch (err) {
      console.error(err);
    }
  });

  //* POST add new todo
  const createTodo = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ item: item }),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(url, options);

      const json = await response.json();

      $todoItems = [...$todoItems, json];

      item = ''; // clear input

      return json;
    } catch (err) {
      console.error(err);
    }
  };

  //* DELETE remove todo by ID
  const deleteTodo = async (id) => {
    try {
      let todoIndex = $todoItems.findIndex((x) => x.id == id);

      $todoItems.splice(todoIndex, 1);

      $todoItems = $todoItems;

      await fetch(`${url}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  export let pageTitle;
</script>

<section>
  <h1>{pageTitle}</h1>
  <input bind:value={item} placeholder="Enter new todo" />
  <button type="button" on:click={createTodo}>Add TODO</button>
  <div>
    {#if $todoItems.length}
      <ul>
        {#each $todoItems as todo}
          <li>
            {todo.item}
            <button type="button" on:click={deleteTodo(todo.id)}>Delete</button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No Todos added</p>
    {/if}
  </div>
</section>