<template>
  <div class="register">
    <form class="form" @submit="register">
      <h1>Register page</h1>
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username"/>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email"/>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password"/>

      <button type="submit">Register</button>
    </form>
  </div>
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

<style>
@media (min-width: 1024px) {
  .register {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>