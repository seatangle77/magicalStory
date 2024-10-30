<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ disabledItems: string[] }>();
const emit = defineEmits(['select']);

const items = [
  { name: 'Magic Wand', effect: 'Often casts spells incorrectly, such as turning trees into candy.' },
  { name: 'Treasure Chest', effect: 'Makes funny noises when opened, sometimes releasing a dancing dragon.' },
  { name: 'Rock', effect: 'Appears ordinary but rolls around on its own, startling the character.' },
  { name: 'Flower', effect: 'Causes sneezing and makes the character’s voice sound like a duck.' },
  { name: 'Key', effect: 'Plays silly music when unlocking doors, causing the character to fumble.' },
];

const selectItem = (item: string) => {
  emit('select', item);
};
</script>

<template>
  <div class="item-selection">
    <h3>Choose an Item:</h3>
    <ul>
      <li v-for="item in items" :key="item.name">
        <button 
          :disabled="props.disabledItems.includes(item.name)" 
          @click="selectItem(item.name)"
        >
          <strong>{{ item.name }}</strong>: {{ item.effect }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.item-selection {
  text-align: left;
}

button {
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>