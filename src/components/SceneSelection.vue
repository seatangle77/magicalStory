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
    <h3>Select a Scene to Explore:</h3>
    <ul>
      <li v-for="scene in scenes" :key="scene.name">
        <button @click="selectScene(scene.name)">
          <strong>{{ scene.name }}</strong>: {{ scene.description }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.scene-selection {
  text-align: left;
}

button {
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>