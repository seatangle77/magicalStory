<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['select']);

const scenes = [
  { name: 'The Mysterious Forest', description: 'Trees can talk, and some leaves might dance.' },
  { name: 'The Ancient Castle', description: 'Portraits sing, and staircases move on their own.' },
  { name: 'The Peaceful Beach', description: 'Sand forms small sculptures that mimic your actions.' },
];

const selectScene = (scene: string) => {
  emit('select', scene);
};
</script>

<template>
  <div class="scene-selection">
    <h2 class="selection-title">Select a Scene to Explore</h2>
    <ul class="scene-list">
      <li v-for="scene in scenes" :key="scene.name" class="scene-item">
        <button @click="selectScene(scene.name)" class="scene-button">
          <div class="scene-name">{{ scene.name }}</div>
          <div class="scene-description">{{ scene.description }}</div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.scene-selection {
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

.scene-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.scene-item {
  margin-bottom: 0.5rem;
}

.scene-button {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.scene-name {
  font-size: 1.05rem;
  color: #42b883;
  font-weight: bold;
}

.scene-description {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.3rem;
}

.scene-button:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.scene-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #42b883;
}
</style>