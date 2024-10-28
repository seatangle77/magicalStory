<script setup lang="ts">
import { ref } from 'vue';
import { useStoryGenerator } from '../composables/useStoryGenerator';

const userInput = ref('');
const { generateStory, story, isLoading, error } = useStoryGenerator();

const handleGenerateStory = async () => {
  if (!userInput.value.trim()) {
    return;
  }
  await generateStory(userInput.value);
};
</script>

<template>
  <div class="creation-interface">
    <h2>Tell me your story idea...</h2>
    <textarea
      v-model="userInput"
      placeholder="Enter your story prompt here..."
      :disabled="isLoading"
    ></textarea>
    
    <button 
      @click="handleGenerateStory"
      :disabled="isLoading || !userInput.trim()"
      class="generate-button"
    >
      {{ isLoading ? 'Creating Magic...' : 'Generate Story' }}
    </button>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="story" class="story-output">
      <h3>Your Magical Story:</h3>
      <div class="story-content">{{ story }}</div>
    </div>
  </div>
</template>

<style scoped>
.creation-interface {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  width: 100%;
  height: 150px;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
}

.generate-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.generate-button:hover {
  background-color: #3aa876;
}

.generate-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  padding: 0.5rem;
  border-radius: 4px;
}

.story-output {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.story-content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>