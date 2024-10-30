<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['select']);

const characters = [
  { name: 'Alex, the Adventurer', description: 'Treats ordinary things like treasure.' },
  { name: 'Sam, the Magic Lover', description: 'Curious about magical objects but often messes up spells.' },
  { name: 'Tom, the Collector of Oddities', description: 'Believes every object holds magic, even if it’s just a stone.' },
];

const selectCharacter = (character: string) => {
  emit('select', character);
};
</script>

<template>
  <div class="character-selection">
    <h3>Choose Your Character:</h3>
    <ul>
      <li v-for="char in characters" :key="char.name">
        <button @click="selectCharacter(char.name)">
          <strong>{{ char.name }}</strong>: {{ char.description }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.character-selection {
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