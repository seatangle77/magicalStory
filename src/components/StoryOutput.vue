<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";

const { story, isFinal, imageUrl } = defineProps<{
  story: string;
  isFinal: boolean;
  imageUrl: string;
  isLoading: boolean; // 增加 isLoading Prop
}>();

const md = new MarkdownIt();
const renderedStory = computed(() => md.render(story));
</script>

<template>
  <div class="story-output">
    <!-- 显示 Loading 状态 -->
    <div v-if="isLoading" class="loading">Loading story part...</div>
    <!-- 显示内容 -->
    <div v-else>
      <img :src="imageUrl" alt="Story Image" class="story-image" />
      <h3 v-if="isFinal" class="story-title">Ending</h3>
      <div class="story-content" v-html="renderedStory"></div>
    </div>
  </div>
</template>

<style scoped>
.story-output {
  width: 100%;
  margin: 1rem; /* 上下左右间距，确保每个部分有间隔 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(46, 64, 83, 0.95); /* 深蓝色半透明背景 */
  border-left: 4px solid #ffd700; /* 金色边框 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* 柔和阴影 */
  text-align: center;
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 清晰的无衬线字体 */
}

/* 图片样式 */
.story-image {
  width: 430px;
  height: 430px;
  object-fit: cover;
  border-radius: 8px; /* 更大的圆角 */
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* 图像轻微阴影 */
}

/* 标题样式 */
.story-title {
  margin: 0.5rem 0;
  font-size: 1.5rem; /* 更大的标题字体 */
  color: #ffd700; /* 金色标题 */
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* 柔和阴影 */
}

/* 内容样式 */
.story-content {
  white-space: pre-wrap;
  color: #ffffff; /* 白色文字 */
  font-size: 1.2rem; /* 增大字体以增强清晰度 */
  line-height: 1.5; /* 更舒适的行距 */
  max-width: 300px; /* 增加最大宽度以适应更多文字 */
  text-align: left; /* 内容对齐方式为左对齐，便于阅读 */
}

/* 加载动画 */
.loading {
  font-size: 1.2rem; /* 增大加载文字字体 */
  color: #ffd700; /* 金色加载文字 */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1.2em; /* 加大加载动画尺寸 */
  height: 1.2em;
  margin-left: 0.5em;
  border-radius: 50%;
  border: 3px solid #ffd700; /* 金色加载动画 */
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
