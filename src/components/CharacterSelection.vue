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
    <h2 class="selection-title">Choose Your Character</h2>
    <ul class="character-list">
      <li v-for="char in characters" :key="char.name" class="character-item">
        <button @click="selectCharacter(char.name)" class="character-button">
          <div class="character-name">{{ char.name }}</div>
          <div class="character-description">{{ char.description }}</div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.character-selection {
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

.character-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.character-item {
  margin-bottom: 0.5rem;
}

.character-button {
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

.character-name {
  font-size: 1.05rem;
  color: #42b883;
  font-weight: bold;
}

.character-description {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.3rem;
}

.character-button:hover {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.character-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #42b883;
}
</style>