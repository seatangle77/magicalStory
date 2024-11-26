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
  font-size: 1.2rem; /* 更大的字体，增加清晰度 */
  color: #ffffff; /* 白色文字 */
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
  align-items: center;
  justify-content: space-between; /* 可适应内容对齐 */
}

.path-button:hover {
  background: linear-gradient(
    135deg,
    #4e342e,
    #2a3a4a
  ); /* 反转渐变以突出交互 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 增强阴影效果 */
  transform: scale(1.02); /* 鼠标悬停时轻微放大 */
}

.path-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffd700; /* 金色高亮效果 */
}
</style>
