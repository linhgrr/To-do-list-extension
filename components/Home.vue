<template>
  <div class="container">
    <h1 class="title">{{ message }}</h1>
    <h3 class="subtitle">
      Add new todo
      <!-- lam mau -->
      <div class="checkbox-wrapper-2" style="display: inline" >
        <input type="checkbox" class="sc-gJwTLC ikxBAC" v-model="displayInput"/>
      </div>
    </h3>

    <div v-if="displayInput" class="input-group">
      <input class="todo-input" type="text" v-model="newTodo" />
      <button class="add-button" @click="addTodo">Add</button>
    </div>

    <ul class="todo-list">
      <li v-for="(todo, index) in todoList" :key="index" class="todo-item">
        <span
          v-show="!todo.fix"
          :style="{ textDecoration: todo.done ? 'line-through' : 'none' }"
          >{{ todo.text }}</span
        >
        <input
          type="text"
          v-model="todo.text"
          v-show="todo.fix"
          @keyup.enter="doneFix(todo.id, todo.text)"
        />
        <input
          v-if="!todo.fix"
          class="done"
          type="checkbox"
          v-model="todo.done"
          @change="deleteTodo(todo.id)"
        />
        <button v-if="!todo.fix" @click="todo.fix = !todo.fix">
          <FontAwesomeIcon :icon="faEdit()" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit, faHouse } from "@fortawesome/free-solid-svg-icons";
export default {
  name: "Home",
  components: { FontAwesomeIcon },
  async mounted() {
    await axios
      .get("http://localhost:8080/todos", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data) {
          this.todoList = response.data;
        }
      })
      .catch((error) => console.error("Error:", error));
  },
  data() {
    return {
      message: null,
      todoList: [],
      newTodo: "",
      displayInput: false,
    };
  },

  methods: {
    faEdit() {
      return faEdit;
    },
    faHouse() {
      return faHouse;
    },
    addTodo() {
      if (this.newTodo.trim() !== "") {
        axios
          .post("http://localhost:8080/todos", {
            text: this.newTodo,
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.todoList.push(response.data);
            this.newTodo = ""
          })
          .catch((error) => console.error("Error:", error));
      }
    },
    doneFix(id, text) {
      this.todoList.forEach((todo) => {
        if (todo.fix) {
          todo.fix = false;
        }
        const updateUrl = "http://localhost:8080/todos/" + id;
        axios
          .put(updateUrl, {
            text: text,
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error("Error:", error));
      });
    },
    deleteTodo(id) {
      this.todoList.forEach((todo) => {
        if (todo.done) {
          if (!todo.text.includes("(done)")) {
            todo.text += " (done)";
          }
          setTimeout(() => {
            this.todoList.splice(this.todoList.indexOf(todo), 1);
          }, 1000);
        }
      });

      let deleteUrl = "http://localhost:8080/todos/" + id;
      axios
        .delete(deleteUrl, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error("Error:", error));
    },
  },
};
</script>

<style scoped>
.container {
  font-family: "Arial", sans-serif;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  color: #1e90ff;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.subtitle {
  color: #ff4500;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 2px solid #1e90ff;
  border-radius: 4px;
}

.add-button {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #1c86ee;
}

.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.todo-item span {
  flex: 1;
  padding-right: 10px;
}

.todo-item input[type="text"] {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.todo-item input[type="checkbox"] {
  margin-left: 10px;
}

.checkbox-wrapper-2 .ikxBAC {
    appearance: none;
    background-color: #dfe1e4;
    border-radius: 72px;
    border-style: none;
    flex-shrink: 0;
    height: 20px;
    margin: 0;
    position: relative;
    width: 30px;
  }

  .checkbox-wrapper-2 .ikxBAC::before {
    bottom: -6px;
    content: "";
    left: -6px;
    position: absolute;
    right: -6px;
    top: -6px;
  }

  .checkbox-wrapper-2 .ikxBAC,
  .checkbox-wrapper-2 .ikxBAC::after {
    transition: all 100ms ease-out;
  }

  .checkbox-wrapper-2 .ikxBAC::after {
    background-color: #fff;
    border-radius: 50%;
    content: "";
    height: 14px;
    left: 3px;
    position: absolute;
    top: 3px;
    width: 14px;
  }

  .checkbox-wrapper-2 input[type=checkbox] {
    cursor: default;
  }

  .checkbox-wrapper-2 .ikxBAC:hover {
    background-color: #c9cbcd;
    transition-duration: 0s;
  }

  .checkbox-wrapper-2 .ikxBAC:checked {
    background-color: #6e79d6;
  }

  .checkbox-wrapper-2 .ikxBAC:checked::after {
    background-color: #fff;
    left: 13px;
  }

  .checkbox-wrapper-2 :focus:not(.focus-visible) {
    outline: 0;
  }

  .checkbox-wrapper-2 .ikxBAC:checked:hover {
    background-color: #535db3;
  }
</style>
