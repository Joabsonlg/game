<template>
  <div class="login">
    <form class="form" @submit="login">
      <h1>Login page</h1>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email"/>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password"/>

      <button type="submit">Login</button>

      <p>Don't have an account?
        <RouterLink to="/register">Register</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {ref} from "vue";
import axios from "axios";

const router = useRouter()

const email = ref();
const password = ref();

const login = async (event) => {
  event.preventDefault();
  const baseURL = 'http://localhost:3000';
  try {
    const response = await axios.post(`${baseURL}/login`, {email: email.value, password: password.value});
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      await router.push('/game');
    }
  } catch (e) {
    alert('Credenciais inválidas');
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>