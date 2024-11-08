<script setup lang="ts">
import { ref } from 'vue';
import CharacterSelection from './CharacterSelection.vue';
import SceneSelection from './SceneSelection.vue';
import ItemSelection from './ItemSelection.vue';
import StoryPathSelection from './StoryPathSelection.vue'; // 导入新组件
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

const storyParts = ref<{ story: string, isFinal: boolean }[]>([]);

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

// 静态JSON数据，模拟每个步骤的GPT响应
const staticResponses = {
  character_creation: "Alex, a brave 10-year-old adventurer, steps into the mysterious forest with wide eyes, treating every twig and leaf as if it holds hidden magic.",
  scene_selection: "As Alex enters the Mysterious Forest, the trees start whispering secrets, and some leaves begin to twirl in mid-air like tiny dancers.",
  item_selection_1: "Alex finds a magic wand. When waved, it makes all the trees briefly turn into candy canes, making Alex laugh.",
  item_selection_2: "Alex picks up a treasure chest, which opens with a tiny dancing dragon singing a high-pitched tune.",
  story_development: "Out hops Professor Snugglefluff, a plump, purple rabbit with glasses, who proudly claims to be the smartest rabbit in the forest.",
  climax: "Alex and Professor Snugglefluff join a group of magical ducks in a 'quack dance,' spinning and laughing.",
  ending: "As the sun sets, Alex sits by the stream with Professor Snugglefluff, reflecting on the adventure, feeling braver and grateful for the magic."
};

const startAdventure = () => {
  isStarted.value = true;
};

const proceedToNextStep = () => {
  currentStep.value++;
};

// 处理选择并发送Prompt给接口获取故事片段
const handleSelection = async (type: string, choice: string) => {
  let storyPart = '';

  if (type === 'character') {
    selectedChoices.value.character = choice;
    storyPart = staticResponses.character_creation;

    //await requestStoryPart(`The main character is ${choice}. They start their adventure...`); // 第一个故事片段的Prompt
  }
  if (type === 'scene') {
    selectedChoices.value.scene = choice;
    storyPart = staticResponses.scene_selection;
 
    //await requestStoryPart(`${selectedChoices.value.character} arrives at the ${choice} where magical things happen...`); // 第二个故事片段的Prompt
  }
  if (type === 'item') {
    selectedChoices.value.items.push(choice);
    const itemIndex = selectedChoices.value.items.length;
    storyPart = staticResponses[`item_selection_${itemIndex}`];
    
    //await requestStoryPart(`With a magical ${choice}, the adventure continues...`); // 针对物品的Prompt
  }
  if (type === 'storyPath') {
    selectedChoices.value.storyPath = choice;
    storyPart = staticResponses.story_development;

    //await requestStoryPart(`The story takes an exciting turn as ${selectedChoices.value.character} decides to ${choice}...`); // 针对故事路径的Prompt
  }

    // 检查 storyPart 是否为空，以便将其添加到 storyParts 数组中
    if (storyPart) {
    storyParts.value.push({ story: storyPart, isFinal: false });

    console.log('Current story parts:', storyParts.value); // 检查 storyParts 是否更新
  } else {
    console.error('Story part is empty or undefined.');
  }

  if (currentStep.value < steps.length - 1) {
    proceedToNextStep();
  } else {
    await generateFullStory(); // 所有步骤完成后生成完整的故事
  }
};

// 请求接口生成故事片段
const requestStoryPart = async (prompt: string) => {
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
  storyParts.value.push({ story: fullStory, isFinal: true }); // 完整故事标记为 isFinal: true

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

        <StoryPathSelection 
          v-if="currentStep === 4"
          @select="handleSelection('storyPath', $event)" 
        />

        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <!-- 右侧故事内容显示栏 -->
      <div class="right-panel">
        <h2>Story Progress</h2>
        <StoryOutput 
          v-for="(part, index) in storyParts" 
          :key="index" 
          :story="part.story" 
          :isFinal="part.isFinal" 
        />      </div>
    </div>
  </div>
</template>

<style scoped>
.story-app {
  max-width: 1200px;
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