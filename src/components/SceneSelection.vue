<script setup lang="ts">
import { ref } from "vue";
import { defineEmits } from "vue";

const emit = defineEmits(["select"]);

const scenes = [
  {
    name: "The Enchanted Cave",
    description: "Echoes of forgotten tales and glowing crystals fill the air.",
    goal: "Defeat the Crystal Guardian to unlock the treasure chest.",
    image: "/assets/cave.png",
  },
  {
    name: "The Ancient Castle",
    description: "Portraits hum songs, and staircases twist by magic.",
    goal: "Battle the Phantom Knight to claim the enchanted key.",
    image: "/assets/castle.png",
  },
];

// 用于存储选中的场景名称
const selectedScene = ref<string | null>(null);

const selectScene = (name: string, description: string, goal: string) => {
  if (selectedScene.value) return; // 如果已经选择场景，阻止重复选择
  selectedScene.value = name; // 记录选中的场景
  const scene = `${name}: ${description} Goal: ${goal}`;
  emit("select", scene);
};
</script>

<template>
  <div class="scene-selection">
    <h2 class="selection-title">Choose Your Scene</h2>
    <ul class="scene-list">
      <li v-for="scene in scenes" :key="scene.name" class="scene-item">
        <button
          :disabled="Boolean(selectedScene) && selectedScene !== scene.name"
          @click="selectScene(scene.name, scene.description, scene.goal)"
          class="scene-button"
          :class="{
            disabled: Boolean(selectedScene) && selectedScene !== scene.name,
          }"
        >
          <!-- 场景图片 -->
          <img :src="scene.image" :alt="scene.name" class="scene-image" />
          <!-- 场景文字信息 -->
          <div class="scene-info">
            <div class="scene-name">{{ scene.name }}</div>
            <div class="scene-description">{{ scene.description }}</div>
            <div class="scene-goal">
              <strong>Goal:</strong> {{ scene.goal }}
            </div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 按钮禁用样式 */
.scene-button:disabled {
  background: #4e342e; /* 禁用状态下的背景色 */
  color: rgba(255, 255, 255, 0.5); /* 禁用状态下文字颜色变浅 */
  cursor: not-allowed; /* 禁用状态鼠标样式 */
  opacity: 0.6; /* 减弱按钮的可见度 */
}

.scene-button.disabled {
  background: #4e342e; /* 禁用状态下的背景色 */
  color: rgba(255, 255, 255, 0.5); /* 禁用状态下文字颜色变浅 */
}
/* 容器样式 */
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

/* 标题样式 */
.selection-title {
  font-size: 1.8rem;
  color: #ffa500;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
  text-align: center;
}

/* 列表样式 */
.scene-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.scene-item {
  margin-bottom: 1rem; /* 列表项之间的间距 */
}

/* 按钮样式 */
.scene-button {
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: linear-gradient(135deg, #2a1e5c, #4e342e);
  border: 2px solid #ffa500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex; /* 图片与文字水平排列 */
  align-items: center;
  gap: 1rem; /* 图片与文字间距 */
  color: #ffffff;
}

/* 场景图片样式 */
.scene-image {
  width: 110px; /* 图片宽度 */
  height: 110px; /* 图片高度 */
  padding: 10px;
  object-fit: cover; /* 保持图片比例 */
  border-radius: 8px;
  border: 2px solid #ffa500; /* 金色边框 */
}

/* 场景信息 */
.scene-info {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center;
}

/* 场景名称 */
.scene-name {
  font-size: 1.4rem;
  color: #ffa500;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

/* 场景描述 */
.scene-description {
  font-size: 1.2rem;
  color: #ffffff;
  line-height: 1.4;
}

/* 场景目标 */
.scene-goal {
  font-size: 1.2rem;
  color: #ffe4b5;
  margin-top: 0.3rem;
  font-weight: bold;
}

/* 按钮交互效果 */
.scene-button:hover {
  background: linear-gradient(135deg, #4e342e, #2a1e5c); /* 反转渐变 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  transform: scale(1.03);
}

.scene-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffa500;
}
</style>
