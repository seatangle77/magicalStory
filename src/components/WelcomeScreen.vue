<script setup lang="ts">
defineEmits(['start']);
</script>

<template>
  <div class="welcome-screen">
    <h1>Magical Story Creator</h1>
    <p>Ready to create something magical?</p>
    <button @click="$emit('start')" class="start-button">Start Creating</button>
  </div>
</template>

<style scoped>
.welcome-screen {
  text-align: center;
  padding: 2rem;
}

.welcome-screen h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

.start-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #3aa876;
}
</style>