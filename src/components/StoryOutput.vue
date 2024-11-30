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
/* 容器样式 */
.story-output {
  width: 100%;
  margin: 1.5rem 0; /* 垂直间距，便于分割每部分 */
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    #2a1e5c,
    #4e342e
  ); /* 深紫到深棕渐变背景 */
  border-left: 4px solid #ffa500; /* 保留金色边框 */
  border-radius: 8px; /* 保留圆角 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5); /* 柔和阴影 */
  text-align: center;
  color: #ffffff; /* 白色文字 */
  font-family: "Roboto", Arial, sans-serif; /* 无衬线字体 */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* 容器交互效果 */
.story-output:hover {
  transform: scale(1.03); /* 鼠标悬停时轻微放大 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6); /* 更强的阴影效果 */
}

/* 图片样式 */
.story-image {
  width: 100%;
  max-width: 430px;
  height: auto;
  object-fit: cover;
  border-radius: 8px; /* 保留图像圆角 */
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); /* 图像柔和阴影 */
}

/* 标题样式 */
.story-title {
  font-size: 1.8rem; /* 更大的标题字体 */
  color: #ffa500; /* 金色标题 */
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); /* 柔和的阴影 */
}

/* 内容样式 */
.story-content {
  white-space: pre-wrap; /* 保持文字换行 */
  color: #ffffff; /* 白色文字 */
  font-size: 1.2rem; /* 字体大小 */
  line-height: 1.6; /* 更舒适的行距 */
  text-align: left; /* 左对齐内容 */
  margin: 0 auto;
  max-width: 400px; /* 限制最大宽度，确保易读性 */
}

/* 加载动画 */
.loading {
  font-size: 1.4rem; /* 增大加载文字字体 */
  color: #ffa500; /* 金色加载文字 */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1.5em; /* 加大加载动画尺寸 */
  height: 1.5em;
  margin-left: 0.5em;
  border-radius: 50%;
  border: 3px solid #ffa500; /* 金色加载动画 */
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

/* 动画效果 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
