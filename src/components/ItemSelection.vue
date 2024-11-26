<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ disabledItems: string[] }>();
const emit = defineEmits(["select"]);

const items = [
  {
    name: "Magic Wand",
    effect: "Often casts spells incorrectly, such as turning trees into candy.",
  },
  {
    name: "Treasure Chest",
    effect:
      "Makes funny noises when opened, sometimes releasing a dancing dragon.",
  },
];

const selectItem = (item: string) => {
  emit("select", item);
};
</script>

<template>
  <div class="item-selection">
    <h3 class="selection-title">Choose an Item</h3>
    <ul class="item-list">
      <li v-for="item in items" :key="item.name" class="item">
        <button
          :disabled="props.disabledItems.includes(item.name)"
          @click="selectItem(item.name)"
          class="item-button"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-effect">{{ item.effect }}</div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.item-selection {
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

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  margin-bottom: 0.5rem;
}

.item-button {
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

.item-button:disabled {
  background-color: #f0f0f0;
  color: #aaa;
  border: 1px solid #ccc;
  cursor: not-allowed;
}

.item-name {
  font-size: 1.05rem;
  color: #42b883;
  font-weight: bold;
}

.item-effect {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.3rem;
}

.item-button:hover:not(:disabled) {
  background-color: #f1f1f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #42b883;
}
</style>
