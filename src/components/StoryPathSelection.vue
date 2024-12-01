<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["select"]);

// 攻击选项
const paths = [
  {
    name: "Cast a Magic Spell",
    description: "A powerful magical attack!",
    value: "spell",
  },
  {
    name: "Outsmart the Monster",
    description: "Use your wits to outsmart it.",
    value: "trick",
  },
  {
    name: "Engage in Combat",
    description: "Charge forward with bravery!",
    value: "combat",
  },
];

// 当前选中的攻击方式
const selectedPath = ref<string | null>(null);
const currentAction = ref("");

// 选择攻击方式
const selectPath = (name: string, description: string, value: string) => {
  const selectedPath = name + ": " + description + " (" + value + ")";
  emit("select", selectedPath); // 触发选择事件
};

// 确认攻击方式
const confirmSelection = () => {
  if (selectedPath.value) {
  }
};
</script>

<template>
  <div class="story-path-selection">
    <h3 class="selection-title">A Monster Appears! Choose Your Attack</h3>
    <p class="instruction">Select how you want to defeat the monster:</p>
    <ul class="path-list">
      <li v-for="path in paths" :key="path.value" class="path-item">
        <button
          @click="selectPath(path.name, path.description, path.value)"
          class="path-button"
        >
          <div class="path-name">{{ path.name }}</div>
          <div class="path-description">{{ path.description }}</div>
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
  font-size: 1.8rem;
  color: #ffa500; /* 金色标题 */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  text-align: center;
}

.instruction {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #ffe4b5; /* 柔和金黄色 */
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

.path-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffa500; /* 金色字体 */
}

.path-description {
  font-size: 1.2rem;
  margin-top: 0.3rem;
  color: #ffffff;
}

.confirm-button {
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: #ffa500;
  color: #2a1e5c;
  border: 2px solid #2a1e5c;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.confirm-button:hover {
  background: #ff6f00;
  transform: scale(1.05);
}
</style>
