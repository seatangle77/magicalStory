<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits(["select"]);

const paths = [
  { name: "Explore a new area", value: "explore" },
  { name: "Interact with a character", value: "interact" },
  { name: "Solve a puzzle", value: "solve" },
];

const selectPath = (path: string) => {
  emit("select", path);
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

.path-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.path-item {
  margin-bottom: 1rem; /* 增加按钮之间的间距 */
}

.path-button {
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
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

.path-button:hover {
  background: linear-gradient(
    135deg,
    #4e342e,
    #2a1e5c
  ); /* 反转渐变以突出交互 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5); /* 更强的阴影效果 */
  transform: scale(1.03); /* 鼠标悬停时轻微放大 */
}

.path-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffa500; /* 金色高亮效果 */
}
</style>
