<script setup lang="ts">
import { ref, defineEmits } from "vue";

const emit = defineEmits(["select"]);

// 初始化角色数据
const characters = [
  {
    name: "My name is Alex, the Adventurer",
    description: "Treats ordinary things like treasure.",
    avatar: "/assets/alex.png",
  },
  {
    name: "My name is Luna, the Magic Lover",
    description: "Curious about magical objects but often messes up spells.",
    avatar: "/assets/luna.png",
  },
  {
    name: "My name is Tom, the Collector of Oddities",
    description:
      "Believes every object holds magic, even if it’s just a stone.",
    avatar: "/assets/tom.png",
  },
];

// 用于存储选中的角色
const selectedCharacter = ref<string | null>(null);

// 处理角色选择
const selectCharacter = (name: string, description: string) => {
  if (selectedCharacter.value) return; // 如果已有选中角色，则阻止操作
  selectedCharacter.value = name; // 标记已选中角色
  const character = name + ": " + description;
  emit("select", character);
};
</script>

<template>
  <div class="character-selection">
    <h2 class="selection-title">选择你的角色</h2>
    <ul class="character-list">
      <li v-for="char in characters" :key="char.name" class="character-item">
        <button
          :disabled="
            Boolean(selectedCharacter) && selectedCharacter !== char.name
          "
          @click="selectCharacter(char.name, char.description)"
          class="character-button"
          :class="{
            disabled:
              Boolean(selectedCharacter) && selectedCharacter !== char.name,
          }"
        >
          <!-- 头像容器 -->
          <div class="avatar-container">
            <img :src="char.avatar" :alt="char.name" class="character-avatar" />
          </div>
          <!-- 名字和描述 -->
          <div class="character-info">
            <div class="character-name">{{ char.name }}</div>
            <div class="character-description">{{ char.description }}</div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 添加禁用按钮的样式 */
.character-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
/* 角色选择整体样式 */
.character-selection {
  text-align: left;
  padding: 1.5rem;
  background: rgba(42, 30, 92, 0.9); /* 深紫色背景 */
  border-left: 4px solid #ffa500; /* 金色边框 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 柔和阴影 */
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 无衬线字体 */
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
.character-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.character-item {
  margin-bottom: 1.2rem; /* 列表项之间的间距 */
}

/* 按钮样式 */
.character-button {
  display: flex; /* 让头像和文字水平排列 */
  align-items: center; /* 垂直居中 */
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #2a1e5c, #4e342e); /* 深紫到深棕渐变 */
  border: 2px solid #ffa500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 禁用样式 */
.character-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #4e342e;
}

/* 鼠标悬停时 */
.character-button:hover:enabled {
  background: linear-gradient(135deg, #4e342e, #2a1e5c); /* 反转渐变 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  transform: scale(1.03);
}

/* 头像容器 */
.avatar-container {
  width: 80px; /* 调整头像容器大小 */
  height: 80px;
  flex-shrink: 0; /* 防止头像缩小 */
  border-radius: 50%;
  background: #ffffff; /* 白色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem; /* 与文字间的间距 */
  border: 2px solid #ffa500; /* 金色边框 */
}

/* 角色头像 */
.character-avatar {
  width: 60px; /* 头像大小 */
  height: 60px;
  object-fit: contain; /* 确保头像完整显示 */
  transition: transform 0.3s;
}

/* 鼠标悬停时 */
.character-button:hover .character-avatar {
  transform: scale(1.1); /* 放大效果 */
}

/* 角色信息容器 */
.character-info {
  display: flex;
  flex-direction: column; /* 垂直排列名字和描述 */
  justify-content: center;
}

/* 名字样式 */
.character-name {
  font-size: 1.4rem;
  color: #ffa500;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* 描述样式 */
.character-description {
  font-size: 1.2rem;
  color: #ffffff;
  line-height: 1.4;
}
</style>
