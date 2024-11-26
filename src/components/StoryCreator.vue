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
  { story: string; imageUrl?: string; isFinal: boolean; isLoading: boolean }[]
>([]);

const { generateStory, flux_generateImage, error } = useStoryGenerator();

// 故事背景Prompt，将用于每一步的生成上下文
const initialPrompt = `
You are a children's interactive adventure story game generator. Create fun, magical, and humorous story games for children under 10. The tone should resemble Harry Potter, with twists inspired by Judy Moody.

Instructions:

1. The protagonist starts with Experience Points (XP): 3** and Health Points (HP): 3**, which changes as the story progresses.
2. Each response generates **only one chapter** (20 words), logically advancing the story while updating XP and HP.
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

  // 添加一个新的加载占位符
  storyParts.value.push({
    story: "",
    imageUrl: "",
    isFinal: false,
    isLoading: true,
  });

  try {
    const part = await generateStory(prompt);
    console.log("Generated part:", part);

    if (part && part.trim()) {
      // 生成对应章节的图像
      const imagePrompt = part; // 使用故事片段直接作为图像提示
      const imageUrl =
        (await flux_generateImage(imagePrompt)) ||
        "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png";
      // 替换加载占位符为实际内容
      storyParts.value[storyParts.value.length - 1] = {
        story: part,
        imageUrl,
        isFinal: false,
        isLoading: false,
      };
    } else {
      console.error("Story part is empty or undefined.");
      storyParts.value[storyParts.value.length - 1].isLoading = false; // 停止加载
    }
  } catch (error) {
    console.error("Error generating story part:", error);
    storyParts.value[storyParts.value.length - 1].isLoading = false; // 停止加载
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

  // 添加加载占位符
  storyParts.value.push({
    story: "",
    imageUrl: "",
    isFinal: true,
    isLoading: true,
  });

  try {
    const ending = await generateStory(endingPrompt);
    if (ending && ending.trim()) {
      const imagePrompt = ending; // 使用故事片段直接作为图像提示
      const imageUrl =
        (await flux_generateImage(imagePrompt)) ||
        "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png";
      // 替换加载占位符为实际内容
      storyParts.value[storyParts.value.length - 1] = {
        story: ending,
        imageUrl,
        isFinal: true,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error("Error generating story ending:", error);
    storyParts.value[storyParts.value.length - 1].isLoading = false; // 停止加载
  }
};
</script>

<template>
  <div class="story-app">
    <h1>Magical Story Adventure</h1>
    <p>Embark on a magical journey! Ready to create your own story?</p>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 整体容器样式 */
.story-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  background: linear-gradient(
    135deg,
    #2a3a4a,
    #4e342e
  ); /* 深蓝到深棕的渐变背景 */
  color: #ffffff; /* 明亮的白色字体 */
  font-family: "Roboto", Arial, sans-serif; /* 清晰易读的无衬线字体 */
}

/* 标题样式 */
.story-app h1 {
  font-size: 2.4rem; /* 标题稍大一些 */
  color: #ffd700; /* 金色标题 */
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5); /* 增加对比的柔和阴影 */
}

/* 副标题样式 */
.story-app p {
  font-size: 1rem; /* 调整为清晰的字体大小 */
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff; /* 纯白色字体，增强对比度 */
}

/* 按钮样式 */
.start-button {
  padding: 0.8rem 2rem;
  font-size: 1rem; /* 清晰的按钮文字大小 */
  cursor: pointer;
  background: #4e342e; /* 深棕色按钮背景 */
  color: #ffffff; /* 白色按钮文字 */
  border: 2px solid #ffd700; /* 金色边框 */
  border-radius: 10px;
  margin: 2rem auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 按钮阴影 */
  transition: all 0.3s ease-in-out;
}

.start-button:hover {
  background: #2a3a4a; /* 鼠标悬停时背景变为深蓝 */
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
}

/* 故事内容区域 */
.story-content {
  flex: 1;
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 左侧选择栏样式 */
.left-panel {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(46, 64, 83, 0.95); /* 深蓝几乎不透明背景 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* 增加阴影 */
}

/* 右侧故事内容显示栏样式 */
.right-panel {
  flex: 0.6;
  background: rgba(46, 64, 83, 0.95); /* 深蓝几乎不透明背景 */
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: #ffffff; /* 明亮的白色字体 */
  overflow-y: auto;
}

/* 故事进度网格 */
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 自适应列宽 */
  gap: 1rem;
}

/* 图像容器样式 */
.image-container img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* 图像轻微阴影 */
}

/* 错误提示 */
.error {
  color: #ff6f61;
  text-align: center;
  font-size: 1rem;
}

/* 加载中动画 */
.loading {
  font-size: 1rem;
  color: #ffd700;
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
  border: 3px solid #ffd700;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
