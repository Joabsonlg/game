<template>
  <layout>
    <div class="card">
      <h1 class="card-header">Cadastro</h1>
      <div class="card-body">
        <form class="form" @submit="register">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username"/>
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email"/>
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password"/>

          <button type="submit">Register</button>

          <p>já possui uma conta?
            <RouterLink to="/login">Entrar</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </layout>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {ref} from "vue";
import axios from "axios";

const router = useRouter()

const username = ref();
const email = ref();
const password = ref();

const register = async (event) => {
  event.preventDefault();
  const baseURL = 'http://localhost:3000';
  try {
    const response = await axios.post(`${baseURL}/player`, {
      username: username.value,
      email: email.value,
      password: password.value
    });

    if (response.data) {
      await router.push('/login');
    }
  } catch (e) {
    alert(e.message);
  }
}
</script>