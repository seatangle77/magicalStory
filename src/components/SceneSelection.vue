<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits(["select"]);

const scenes = [
  {
    name: "The Mysterious Forest",
    description: "Trees can talk, and some leaves might dance.",
  },
  {
    name: "The Ancient Castle",
    description: "Portraits sing, and staircases move on their own.",
  },
  {
    name: "The Peaceful Beach",
    description: "Sand forms small sculptures that mimic your actions.",
  },
];

const selectScene = (scene: string) => {
  emit("select", scene);
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
  padding: 1.5rem;
  background: rgba(42, 30, 92, 0.9); /* 深紫色半透明背景 */
  border-left: 4px solid #ffa500; /* 金色边框 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 柔和阴影 */
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 清晰的无衬线字体 */
}

.selection-title {
  font-size: 1.8rem; /* 增大标题字体 */
  color: #ffa500; /* 金色标题 */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6); /* 柔和阴影 */
  text-align: center;
}

.scene-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.scene-item {
  margin-bottom: 1rem; /* 增加间距以便阅读 */
}

.scene-button {
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    #2a1e5c,
    #4e342e
  ); /* 深紫到深棕渐变背景 */
  border: 2px solid #ffa500; /* 金色边框 */
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #ffffff; /* 白色文字 */
}

.scene-name {
  font-size: 1.4rem; /* 更清晰的字体大小 */
  color: #ffa500; /* 金色文字 */
  font-weight: bold;
}

.scene-description {
  font-size: 1.2rem; /* 小字体略大一些以便清晰阅读 */
  color: #ffffff; /* 白色文字 */
  margin-top: 0.3rem;
}

.scene-button:hover {
  background: linear-gradient(
    135deg,
    #4e342e,
    #2a1e5c
  ); /* 反转渐变以突出交互 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5); /* 更强的阴影效果 */
  transform: scale(1.03); /* 鼠标悬停时轻微放大 */
}

.scene-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffa500; /* 金色高亮效果 */
}
</style>
