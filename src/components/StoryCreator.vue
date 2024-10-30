<script setup lang="ts">
import { ref } from 'vue';
import CharacterSelection from './CharacterSelection.vue';
import SceneSelection from './SceneSelection.vue';
import ItemSelection from './ItemSelection.vue';
import StoryOutput from './StoryOutput.vue';
import { useStoryGenerator } from '../composables/useStoryGenerator';

const isStarted = ref(false);
const currentStep = ref(0); // 跟踪故事阶段 (Character, Scene, etc.)
const selectedChoices = ref({
  character: '',
  scene: '',
  items: [] as string[],
  storyPath: '',
});

const storyParts = ref<string[]>([]); // 明确指定 storyParts 为 string 数组

const { generateStory, error } = useStoryGenerator();

const steps = [
  'Select a character',
  'Choose a scene to explore',
  'Select your first magical item',
  'Pick a second item for the adventure',
  'Choose your story path (explore, interact, or solve)',
  'Pick another item',
  'Choose one more item for the climax',
];

const startAdventure = () => {
  isStarted.value = true;
};

const proceedToNextStep = () => {
  currentStep.value++;
};

// 处理选择并发送Prompt给接口获取故事片段
const handleSelection = async (type: string, choice: string) => {
  if (type === 'character') {
    selectedChoices.value.character = choice;
    await requestStoryPart(`The main character is ${choice}. They start their adventure...`); // 第一个故事片段的Prompt
  }
  if (type === 'scene') {
    selectedChoices.value.scene = choice;
    await requestStoryPart(`${selectedChoices.value.character} arrives at the ${choice} where magical things happen...`); // 第二个故事片段的Prompt
  }
  if (type === 'item') {
    selectedChoices.value.items.push(choice);
    await requestStoryPart(`With a magical ${choice}, the adventure continues...`); // 针对物品的Prompt
  }
  if (type === 'storyPath') {
    selectedChoices.value.storyPath = choice;
    await requestStoryPart(`The story takes an exciting turn as ${selectedChoices.value.character} decides to ${choice}...`); // 针对故事路径的Prompt
  }

  if (currentStep.value < steps.length - 1) {
    proceedToNextStep();
  } else {
    await generateFullStory(); // 所有步骤完成后生成完整的故事
  }
};

// 请求接口生成故事片段
const requestStoryPart = async (prompt: string) => {
  console.log("await generateStory(prompt)",await generateStory(prompt))
  const part = await generateStory(prompt); // 获取生成的故事内容
  console.log('Generated part:', part); // 检查 part 的值
  if (part && part.trim()) {  // 确保 part 不为空或 undefined
    storyParts.value.push(part); // 将返回的故事片段添加到 storyParts 中
  } else {
    console.error('No story part was generated.'); // 日志记录错误
  }
};

// 完整生成故事
const generateFullStory = async () => {
  const fullPrompt = `Character: ${selectedChoices.value.character}, Scene: ${selectedChoices.value.scene}, Items: ${selectedChoices.value.items.join(', ')}, Story Path: ${selectedChoices.value.storyPath}`;
  const fullStory = await generateStory(fullPrompt); // 发送完整Prompt请求完整故事
  storyParts.value.push(fullStory); // 添加完整故事
};
</script>

<template>
  <div class="story-app">
    <h1>Magical Story Creator</h1>
    <p>Ready to create something magical?</p>
    <div v-if="!isStarted">
      <button @click="startAdventure" class="start-button">Start Your Magical Adventure</button>
    </div>

    <div v-else class="story-content">
      <!-- 左侧选择栏 -->
      <div class="left-panel">
        <h2>{{ steps[currentStep] }}</h2>

        <CharacterSelection 
          v-if="currentStep === 0"
          @select="handleSelection('character', $event)" 
        />

        <SceneSelection 
          v-if="currentStep === 1"
          @select="handleSelection('scene', $event)" 
        />

        <ItemSelection 
          v-if="currentStep === 2 || currentStep === 3 || currentStep === 5 || currentStep === 6"
          :disabledItems="selectedChoices.items"
          @select="handleSelection('item', $event)" 
        />

        <div v-if="currentStep === 4">
          <button @click="handleSelection('storyPath', 'explore')">Explore a new area</button>
          <button @click="handleSelection('storyPath', 'interact')">Interact with a character</button>
          <button @click="handleSelection('storyPath', 'solve')">Solve a puzzle</button>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <!-- 右侧故事内容显示栏 -->
      <div class="right-panel">
        <h2>Story Progress</h2>
        <StoryOutput v-for="(part, index) in storyParts" :key="index" :story="part" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-app {
  max-width: 800px;
  margin: 0 auto;
}

.story-app h1 {
  color: #42b883;
  margin-bottom: 1rem;
}

.start-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 2rem;
}

.story-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

/* 左侧选择栏样式 */
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 右侧故事内容显示栏样式 */
.right-panel {
  flex: 1;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
}
</style>