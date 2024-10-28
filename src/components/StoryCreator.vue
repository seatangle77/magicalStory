<script setup lang="ts">
import { ref } from 'vue';
import StoryInput from './StoryInput.vue';
import StoryOutput from './StoryOutput.vue';
import WelcomeScreen from './WelcomeScreen.vue';
import { useStoryGenerator } from '../composables/useStoryGenerator';

const isStarted = ref(false);
const userInput = ref('');
const { generateStory, story, isLoading, error } = useStoryGenerator();

const startCreating = () => {
  isStarted.value = true;
};

const handleStoryGeneration = async () => {
  await generateStory(userInput.value);
};
</script>

<template>
  <div class="story-creator">
    <WelcomeScreen 
      v-if="!isStarted" 
      @start="startCreating" 
    />

    <div v-else class="creation-interface">
      <h2>Tell me your story idea...</h2>
      
      <StoryInput
        v-model="userInput"
        :disabled="isLoading"
        @generate="handleStoryGeneration"
      />

      <div v-if="error" class="error">{{ error }}</div>

      <StoryOutput 
        v-if="story"
        :story="story"
      />
    </div>
  </div>
</template>

<style scoped>
.story-creator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.creation-interface {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error {
  color: #ff4444;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #ffe6e6;
  border: 1px solid #ffcccc;
}
</style>