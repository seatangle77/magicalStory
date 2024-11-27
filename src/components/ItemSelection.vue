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
  padding: 1.5rem;
  background: rgba(46, 64, 83, 0.95); /* 深蓝色半透明背景 */
  border-left: 4px solid #ffd700; /* 金色边框 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 柔和阴影 */
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 清晰易读的无衬线字体 */
}

.selection-title {
  font-size: 1.5rem; /* 更大的标题字体 */
  color: #ffd700; /* 金色标题 */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* 柔和阴影 */
}

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  margin-bottom: 1rem; /* 增加间距以便阅读 */
}

.item-button {
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

.item-button:disabled {
  background-color: #3a3a3a; /* 深灰色禁用背景 */
  color: #aaaaaa; /* 浅灰色文字 */
  border: 2px solid #666666; /* 浅灰色边框 */
  cursor: not-allowed; /* 禁用光标样式 */
}

.item-name {
  font-size: 1.2rem; /* 清晰的字体大小 */
  color: #ffd700; /* 金色文字 */
  font-weight: bold;
}

.item-effect {
  font-size: 1.2 rem; /* 小字体略大一些以便清晰阅读 */
  color: #ffffff; /* 白色文字 */
  margin-top: 0.3rem;
}

.item-button:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    #4e342e,
    #2a3a4a
  ); /* 反转渐变以突出交互 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 更强的阴影效果 */
  transform: scale(1.02); /* 鼠标悬停时轻微放大 */
}

.item-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #ffd700; /* 金色高亮效果 */
}
</style>
