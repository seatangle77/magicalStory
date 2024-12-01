<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ disabledItems: string[] }>();
const emit = defineEmits(["select"]);

// 使用相对路径加载物品图片
const items = [
  {
    name: "Mystic Telescope",
    effect: "Its secrets unfold only when the time is right.",
    image: "/src/assets/telescope.png",
  },
  {
    name: "Treasure Chest",
    effect: "What lies inside is never what you expect.",
    image: "/src/assets/chest.png",
  },
];

const selectItem = (name: string, effect: string) => {
  const item = name + ": " + effect;
  emit("select", item);
};
</script>

<template>
  <div class="item-selection">
    <h3 class="selection-title">
      Choose one item to open and reveal its secrets
    </h3>
    <ul class="item-list">
      <li v-for="item in items" :key="item.name" class="item">
        <button
          :disabled="props.disabledItems.includes(item.name)"
          @click="selectItem(item.name, item.effect)"
          class="item-button"
        >
          <!-- 物品图片 -->
          <img :src="item.image" :alt="item.name" class="item-image" />
          <!-- 物品文字信息 -->
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-effect">{{ item.effect }}</div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.item-selection {
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

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  margin-bottom: 1rem; /* 列表项之间的间距 */
}

.item-button {
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
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

.item-button:disabled {
  background-color: #3a3a3a; /* 深灰色禁用背景 */
  color: #aaaaaa; /* 浅灰色文字 */
  border: 2px solid #666666; /* 浅灰色边框 */
  cursor: not-allowed; /* 禁用光标样式 */
}

/* 物品图片样式 */
.item-image {
  width: 100px; /* 图片宽度 */
  height: 100px; /* 图片高度 */
  padding: 10px;
  object-fit: cover; /* 保持图片比例 */
  border-radius: 8px; /* 圆角边框 */
  border: 2px solid #ffa500; /* 金色边框 */
}

/* 物品文字信息 */
.item-info {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center;
}

/* 物品名称样式 */
.item-name {
  font-size: 1.4rem;
  color: #ffa500;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

/* 物品效果描述样式 */
.item-effect {
  font-size: 1.2rem;
  color: #ffffff;
  line-height: 1.4;
}

.item-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4e342e, #2a1e5c); /* 反转渐变 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  transform: scale(1.03);
}

.item-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffa500; /* 金色高亮效果 */
}
</style>
