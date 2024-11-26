<script setup lang="ts">
import StoryCreator from "./components/StoryCreator.vue";
</script>

<template>
  <StoryCreator />
</template>

<style>
#app {
  width: 100vw; /* 设置宽度占满屏幕 */
  height: 100vh; /* 设置高度占满屏幕 */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff; /* 可选背景色 */
  overflow: hidden; /* 防止出现不必要的滚动条 */
}
</style>
