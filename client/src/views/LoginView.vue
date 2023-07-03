<template>
  <layout>
    <div class="login card">
      <h1 class="card-header">Login</h1>
      <div class="card-body">
        <form class="form" @submit="login">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="email"/>
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password"/>

          <button type="submit">Entrar</button>

          <p>Ainda não possui uma conta?
            <RouterLink to="/register">Cadastre-se</RouterLink>
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
import layout from '../layouts/OnlyContentLayout.vue'

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