<script setup lang="ts">
import { ref } from "vue";
import CharacterSelection from "./CharacterSelection.vue";
import SceneSelection from "./SceneSelection.vue";
import ItemSelection from "./ItemSelection.vue";
import StoryPathSelection from "./StoryPathSelection.vue";
import StoryOutput from "./StoryOutput.vue";
import { useStoryGenerator } from "../composables/useStoryGenerator";

const isStarted = ref(false);
const currentStep = ref(0); // 跟踪故事阶段 (Character, Scene, etc.)
const selectedChoices = ref({
  character: "",
  scene: "",
  items: [] as string[],
  storyPath: "",
});

const storyParts = ref<{ story: string; isFinal: boolean }[]>([]);

const { generateStory, error } = useStoryGenerator();

//const imageUrl = ref(""); // 存储生成的图片 URL
const imageUrl =
  "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png"; // Default image URL

// const steps = [
//   "Select a character",
//   "Choose a scene to explore",
//   "Select your first magical item",
//   "Choose your story path (explore, interact, or solve)",
//   "Pick another item",
//   "Choose one more item for the climax",
// ];

// 故事背景Prompt，将用于每一步的生成上下文
const initialPrompt = `
You are a children’s story generator, designed to create fun, humorous, and educational magical adventure stories specifically for children under 10. Each story should have a magical tone similar to Harry Potter, with humorous twists inspired by the Judy Moody series.
Instructions:
1. The story should be divided into chapters, with each response generating one chapter at a time. Each chapter should be only 30 words, advancing the story in a structured, engaging way.
2. Keep the content magical, lighthearted, and humorous. Avoid overly complex or serious themes.
3. Use concise, engaging descriptions to keep the story interesting and accessible to young readers.
4. Avoid sensitive or controversial topics, such as religion or politics.
5. Ensure a smooth flow from one chapter to the next, building up to a climax and ending with a warm, satisfying conclusion.
6. Avoid rushed endings: After reaching the story’s climax, provide a gradual resolution in the final chapters.
`;

// const initialImagePrompt = `
//       Create a whimsical, magical, and lighthearted illustration that would appeal to children under 10 years old.
//       The scene should resemble a moment from a children’s story with a magical, warm atmosphere similar to Harry Potter,
//       incorporating humorous and friendly elements inspired by the Judy Moody series.
//       Use vibrant colors and engaging details that make the scene come alive.
//     `;

// 静态JSON数据，模拟每个步骤的GPT响应
// const staticResponses = {
//   character_creation:
//     "Alex, a brave 10-year-old adventurer, steps into the mysterious forest with wide eyes, treating every twig and leaf as if it holds hidden magic.",
//   scene_selection:
//     "As Alex enters the Mysterious Forest, the trees start whispering secrets, and some leaves begin to twirl in mid-air like tiny dancers.",
//   item_selection_1:
//     "Alex finds a magic wand. When waved, it makes all the trees briefly turn into candy canes, making Alex laugh.",
//   story_development:
//     "Out hops Professor Snugglefluff, a plump, purple rabbit with glasses, who proudly claims to be the smartest rabbit in the forest.",
//   climax:
//     "Alex and Professor Snugglefluff join a group of magical ducks in a 'quack dance,' spinning and laughing.",
//   ending:
//     "As the sun sets, Alex sits by the stream with Professor Snugglefluff, reflecting on the adventure, feeling braver and grateful for the magic.",
// };

const startAdventure = () => {
  isStarted.value = true;
};

const proceedToNextStep = () => {
  currentStep.value++;
};

// 处理选择并发送Prompt给接口获取故事片段
const handleSelection = async (type: string, choice: string) => {
  //let storyPart = "";

  if (type === "character") {
    selectedChoices.value.character = choice;
    //storyPart = staticResponses.character_creation;
    await requestStoryPart(
      `The main character is ${choice}. They start their adventure...`
    ); // 第一个故事片段的Prompt
  }
  if (type === "scene") {
    selectedChoices.value.scene = choice;
    //storyPart = staticResponses.scene_selection;

    await requestStoryPart(
      `${selectedChoices.value.character} arrives at the ${choice} where magical things happen...`
    ); // 第二个故事片段的Prompt
  }
  if (type === "item") {
    selectedChoices.value.items.push(choice);
    //const itemIndex = selectedChoices.value.items.length;
    //storyPart = staticResponses[`item_selection_${itemIndex}`];

    await requestStoryPart(
      `With a magical ${choice}, the adventure continues...`
    ); // 针对物品的Prompt
  }
  if (type === "storyPath") {
    selectedChoices.value.storyPath = choice;
    //storyPart = staticResponses.story_development;

    await requestStoryPart(
      `The story takes an exciting turn as ${selectedChoices.value.character} decides to ${choice}...`
    ); // 针对故事路径的Prompt
  }

  // 在第5步生成故事结尾
  if (currentStep.value === 4) {
    await requestStoryEnding(); // 生成故事的结尾
  } else {
    proceedToNextStep();
  }
};

// 请求接口生成故事片段
const requestStoryPart = async (newPrompt: string) => {
  const previousStory = storyParts.value.map((part) => part.story).join(" ");
  const prompt = `${initialPrompt}\n\n${previousStory}\n\n${newPrompt}`.trim();

  try {
    const part = await generateStory(prompt);
    console.log("Generated part:", part);

    if (part && part.trim()) {
      storyParts.value.push({ story: part, isFinal: false });
    } else {
      console.error("Story part is empty or undefined.");
    }
  } catch (error) {
    console.error("Error generating story part:", error);
  }

  // 检查是否已经生成了第一章节的内容
  if (currentStep.value === 0 && storyParts.value.length === 1) {
    //await generateImageForFirstChapter();  // 调用生成图片
  }
};

// 请求生成故事的结尾
const requestStoryEnding = async () => {
  const previousStory = storyParts.value.map((part) => part.story).join(" ");
  const endingPrompt = `${initialPrompt}\n\n${previousStory}\n\nConclude the story with a warm and satisfying ending.`;

  try {
    const ending = await generateStory(endingPrompt);
    console.log("Generated ending:", ending);

    if (ending && ending.trim()) {
      storyParts.value.push({ story: ending, isFinal: true });
    } else {
      console.error("Ending is empty or undefined.");
    }
  } catch (error) {
    console.error("Error generating story ending:", error);
  }
};

// 生成图像，使用 initialImagePrompt 和第一章节的内容
// const generateImageForFirstChapter = async () => {
//   if (storyParts.value.length > 0) {
//     const firstChapter = storyParts.value[0].story; // 获取第一个章节的内容
//     const imagePrompt = `${initialImagePrompt}\n\nIllustrate the following scene: ${firstChapter}`; // 合成图像 prompt

//     try {
//       imageUrl.value = await generateImage(imagePrompt); // 调用 generateImage 函数
//     } catch (e) {
//       console.error("Error generating image:", e);
//     }
//   }
// };
</script>

<template>
  <div class="story-app">
    <h1>Magical Story Creator</h1>
    <p>Ready to create something magical?</p>
    <div v-if="!isStarted">
      <button @click="startAdventure" class="start-button">
        Start Your Magical Adventure
      </button>
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
          v-if="currentStep === 2 || currentStep === 4"
          :disabledItems="selectedChoices.items"
          @select="handleSelection('item', $event)"
        />

        <StoryPathSelection
          v-if="currentStep === 3"
          @select="handleSelection('storyPath', $event)"
        />

        <div v-if="error" class="error">{{ error }}</div>
      </div>

      <!-- 右侧故事内容显示栏 -->
      <div class="right-panel">
        <h2>Story Progress</h2>
        <div class="story-grid">
          <StoryOutput
            v-for="(part, index) in storyParts"
            :key="index"
            :story="part.story"
            :imageUrl="imageUrl"
            :isFinal="part.isFinal"
          />
        </div>
        <!-- 加载状态 -->
        <div
          v-if="!storyParts.length && isStarted && currentStep > 0"
          class="loading"
        >
          Loading story part...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-app {
  width: 100%;
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
  background-color: #4caf50;
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
  flex: 0.6;
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

.story-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns per row */
  gap: 1rem;
}

.image-container {
  margin-top: 1rem;
}
.image-container img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
}
.loading {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-top: 1rem;
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
  border: 3px solid #42b883; /* 颜色可以根据需求调整 */
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
