<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['select']);

const paths = [
  { name: 'Explore a new area', value: 'explore' },
  { name: 'Interact with a character', value: 'interact' },
  { name: 'Solve a puzzle', value: 'solve' },
];

const selectPath = (path: string) => {
  emit('select', path);
};
</script>

<template>
  <div class="story-path-selection">
    <h3 class="selection-title">Choose Your Story Path</h3>
    <ul class="path-list">
      <li v-for="path in paths" :key="path.value" class="path-item">
        <button @click="selectPath(path.value)" class="path-button">
          {{ path.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.story-path-selection {
  text-align: left;
  padding: 1rem;
  background-color: #f9f9f9;
  border-left: 4px solid #42b883;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selection-title {
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 1rem;
}

.path-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.path-item {
  margin-bottom: 0.5rem;
}

.path-button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.path-button:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.path-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #42b883;
}
</style>