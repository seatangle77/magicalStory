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
  XP: 3, // 初始经验值
  HP: 3, // 初始生命值
});

const storyParts = ref<
  { story: string; imageUrl?: string; isFinal: boolean }[]
>([]);

const { generateStory, generateImage, error } = useStoryGenerator();

//const imageUrl = ref(""); // 存储生成的图片 URL
//const imageUrl =
//  "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png"; // Default image URL

// 故事背景Prompt，将用于每一步的生成上下文
const initialPrompt = `
You are a children's interactive adventure story game generator. Create fun, magical, and humorous story games for children under 10. The tone should resemble Harry Potter, with twists inspired by Judy Moody.

Instructions:

1. The protagonist starts with Experience Points (XP): 3** and Health Points (HP): 3**, which changes as the story progresses.
2. Each response generates **only one chapter** (30 words), logically advancing the story while updating XP and HP.
3. Ensure the logical continuity of the story.
4. Endings vary based on XP and HP:
   - High XP and HP: A victorious ending.
   - Low XP, high HP: A reflective recovery.
   - Low XP and HP: A humorous and challenging ending.
5. Maintain a lighthearted and magical tone. Avoid complex or sensitive themes.
6. Avoid rushed endings. Gradually build toward a satisfying conclusion.
`;

//const initialImagePrompt = `Lighthouse on a cliff overlooking the ocean`;

const startAdventure = () => {
  isStarted.value = true;
};

const proceedToNextStep = () => {
  currentStep.value++;
};

const handleSelection = async (type: string, choice: string) => {
  let xpChange = 0; // 经验值变化
  let hpChange = 0; // 生命值变化

  if (type === "character") {
    selectedChoices.value.character = choice;
    xpChange = 1; // 选择角色增加少量经验值
    await requestStoryPart(
      `The main character is ${choice}, starting with XP: ${
        selectedChoices.value.XP + xpChange
      } and HP: ${
        selectedChoices.value.HP + hpChange
      }. They begin their journey...`
    );
  }
  if (type === "scene") {
    selectedChoices.value.scene = choice;

    // 场景选择影响较大
    xpChange = Math.floor(Math.random() * 2) + 1; // 1~2点经验值
    hpChange = -Math.floor(Math.random() * 2); // 0~1点生命值减少

    await requestStoryPart(
      `${selectedChoices.value.character} enters the ${choice}. Magical challenges await, affecting XP and HP...`
    );
  }
  if (type === "item") {
    selectedChoices.value.items.push(choice);

    // 物品可能恢复生命值或增加经验值
    const isHealingItem = Math.random() > 0.5; // 50% 概率恢复生命值
    if (isHealingItem) {
      hpChange = Math.floor(Math.random() * 2) + 1; // 1~2点生命值
    } else {
      xpChange = Math.floor(Math.random() * 3) + 1; // 1~3点经验值
    }

    await requestStoryPart(
      `With the magical ${choice}, the character gains XP: ${
        selectedChoices.value.XP + xpChange
      }, and HP: ${
        selectedChoices.value.HP + hpChange
      }. The adventure continues...`
    );
  }
  if (type === "storyPath") {
    selectedChoices.value.storyPath = choice;

    // 路径选择对 XP 和 HP 的影响显著
    xpChange = Math.floor(Math.random() * 4) + 1; // 1~4点经验值
    hpChange = -Math.floor(Math.random() * 3); // 0~2点生命值减少

    await requestStoryPart(
      `Choosing to ${choice}, the character's XP increases to ${
        selectedChoices.value.XP + xpChange
      }, but HP drops to ${selectedChoices.value.HP + hpChange}.`
    );
  }

  // 更新状态
  selectedChoices.value.XP += xpChange;
  selectedChoices.value.HP += hpChange;

  // 检查提前结束条件
  if (selectedChoices.value.HP <= 0) {
    await requestStoryEnding(); // 提前结束冒险
  } else if (currentStep.value === 4) {
    await requestStoryEnding(); // 正常结束冒险
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
      // 生成对应章节的图像
      const imagePrompt = part; // 使用故事片段直接作为图像提示
      const imageUrl =
        (await generateImage(imagePrompt)) ||
        "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png";
      storyParts.value.push({ story: part, imageUrl, isFinal: false });
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

const requestStoryEnding = async () => {
  const { XP, HP } = selectedChoices.value;
  const previousStory = storyParts.value.map((part) => part.story).join(" ");

  let endingPrompt = `${initialPrompt}\n\n${previousStory}\n\n`;

  if (HP <= 0) {
    endingPrompt += `With HP: ${HP}, the character collapses but learns an important lesson for next time. Conclude with a humorous twist ending.`;
  } else if (XP > 7 && HP > 7) {
    endingPrompt += `The character triumphs with XP: ${XP} and HP: ${HP}. A heroic and satisfying ending unfolds!`;
  } else if (XP < 5 && HP > 5) {
    endingPrompt += `Though lacking in XP (${XP}), the character's resilience (HP: ${HP}) leads to a warm and reflective ending.`;
  } else {
    endingPrompt += `With balanced XP: ${XP} and HP: ${HP}, the character completes their adventure with mixed results, but a positive spirit!`;
  }

  try {
    const ending = await generateStory(endingPrompt);
    if (ending && ending.trim()) {
      const imagePrompt = ending; // 使用故事片段直接作为图像提示
      const imageUrl =
        (await generateImage(imagePrompt)) ||
        "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png";
      storyParts.value.push({ story: ending, imageUrl, isFinal: true });
    }
  } catch (error) {
    console.error("Error generating story ending:", error);
  }
};
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
            :imageUrl="part.imageUrl || ''"
            :isFinal="part.isFinal"
            :isLoading="!part.story && !part.imageUrl"
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
