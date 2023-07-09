<script setup>

</script>

<template>
  <div class="spinner">
    <img src="../assets/img/spinner.svg" alt="logo" width="200"/>
  </div>
</template>

<style scoped>
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}

.spinner img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>