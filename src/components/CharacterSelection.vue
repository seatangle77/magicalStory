<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits(["select"]);

const characters = [
  {
    name: "Alex, the Adventurer",
    description: "Treats ordinary things like treasure.",
  },
  {
    name: "Sam, the Magic Lover",
    description: "Curious about magical objects but often messes up spells.",
  },
  {
    name: "Tom, the Collector of Oddities",
    description:
      "Believes every object holds magic, even if it’s just a stone.",
  },
];

const selectCharacter = (character: string) => {
  emit("select", character);
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
  padding: 1.5rem;
  background: rgba(46, 64, 83, 0.95); /* 深蓝色半透明背景 */
  border-left: 4px solid #ffd700; /* 金色边框 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 柔和阴影 */
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 清晰的无衬线字体 */
}

.selection-title {
  font-size: 1.5rem; /* 更大的标题字体 */
  color: #ffd700; /* 金色标题 */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* 柔和阴影 */
}

.character-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.character-item {
  margin-bottom: 1rem; /* 增加间距以便阅读 */
}

.character-button {
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    #2a3a4a,
    #4e342e
  ); /* 深蓝到深棕渐变背景 */
  border: 2px solid #ffd700; /* 金色边框 */
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #ffffff; /* 白色文字 */
}

.character-name {
  font-size: 1.2rem; /* 更清晰的字体大小 */
  color: #ffd700; /* 金色文字 */
  font-weight: bold;
}

.character-description {
  font-size: 1rem; /* 小字体更大一些以便清晰阅读 */
  color: #ffffff; /* 白色文字 */
  margin-top: 0.3rem;
}

.character-button:hover {
  background: linear-gradient(
    135deg,
    #4e342e,
    #2a3a4a
  ); /* 反转渐变以突出交互 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 更强的阴影效果 */
  transform: scale(1.02); /* 鼠标悬停时轻微放大 */
}

.character-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffd700; /* 金色高亮效果 */
}
</style>
