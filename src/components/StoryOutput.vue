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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background-color: #ffffff;
  border-left: 4px solid #42b883;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.story-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.story-title {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
}

.story-content {
  white-space: pre-wrap;
  color: #555;
  font-size: 0.85rem;
  line-height: 1.2;
  max-width: 250px;
}
.loading {
  font-size: 1rem;
  color: #42b883;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-left: 0.5em;
  border-radius: 50%;
  border: 3px solid #42b883;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
