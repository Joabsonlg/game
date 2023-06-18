<script setup>
defineProps({
  messages: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">Chat</h1>
    <div v-for="message in messages" :key="message.id">
      <div class="message">
        <div class="message-header">
          <p>Add username</p>
          <p>Add time</p>
        </div>
        <div class="message-body">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

.message {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin: 0.4rem 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.message-body {
  padding: 0.4rem 1rem;
}

<
/
style >