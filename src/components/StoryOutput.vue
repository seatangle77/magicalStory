<script setup lang="ts">
import { ref, watch } from "vue";
import { playTextWithAzure } from "../composables/azureSpeech"; // 导入封装的朗读方法

const { story, isFinal, imageUrl, isLoading } = defineProps<{
  story: string;
  isFinal: boolean;
  imageUrl: string;
  isLoading: boolean; // 是否处于加载状态
}>();

const displayedText = ref(""); // 当前显示的文字
const typingSpeed = 70; // 打字速度（毫秒/字符）

// 打字机效果函数
const startTypingEffect = async () => {
  let index = 0;
  displayedText.value = ""; // 清空显示文本

  const type = async () => {
    if (index < story.length) {
      displayedText.value += story[index]; // 逐字显示
      index++;
      setTimeout(type, typingSpeed); // 继续打字
    }
  };

  // 同步打字效果和语音朗读
  await Promise.all([playTextWithAzure(story), type()]);
};

// 监听 story 的变化，当 story 更新时触发打字和朗读效果
watch(
  () => story,
  async () => {
    try {
      await startTypingEffect();
    } catch (error) {
      console.error("Error in typing effect:", error);
    }
  }
);
</script>

<template>
  <div class="story-output">
    <!-- 显示 Loading 状态 -->
    <div v-if="isLoading" class="loading">Loading story part...</div>
    <!-- 显示内容 -->
    <div v-else>
      <img :src="imageUrl" alt="Story Image" class="story-image" />
      <h3 v-if="isFinal" class="story-title">Ending</h3>
      <div class="story-content">{{ displayedText }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 保持与原始样式一致 */
.story-output {
  width: 100%;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #2a1e5c, #4e342e);
  border-left: 4px solid #ffa500;
  border-radius: 8px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #ffffff;
  font-family: "Roboto", Arial, sans-serif;
}

.story-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.story-title {
  font-size: 1.8rem;
  color: #ffa500;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.story-content {
  white-space: pre-wrap;
  color: #ffffff;
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: left;
  margin: 0 auto;
  max-width: 400px;
  font-family: "Courier New", monospace;
}

.loading {
  font-size: 1.4rem;
  color: #ffa500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  margin-left: 0.5em;
  border-radius: 50%;
  border: 3px solid #ffa500;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
