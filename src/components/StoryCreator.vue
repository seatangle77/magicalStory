<script setup lang="ts">
import { ref, watch } from "vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import CharacterSelection from "./CharacterSelection.vue";
import SceneSelection from "./SceneSelection.vue";
import ItemSelection from "./ItemSelection.vue";
import StoryPathSelection from "./StoryPathSelection.vue";
import StoryOutput from "./StoryOutput.vue";
import { useStoryGenerator } from "../composables/useStoryGenerator";

// 右侧面板 ref
const rightPanel = ref<HTMLElement | null>(null); // 右侧面板 DOM 引用

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
Here is a children's interactive adventure story game generator instructions: From First-person perspective to Create fun, magical, and humorous story games for children under 10. The tone should resemble Harry Potter, with twists inspired by Judy Moody.

Instructions:

1. The protagonist starts with Experience Points (XP): 3** and Health Points (HP): 3**, which changes as the story progresses.
2. Each response generates **only one chapter** (15 words), logically advancing the story while updating XP and HP.
3. Ensure the logical continuity of the story.
4. Endings vary based on XP and HP:
   - High XP and HP: A victorious ending.
   - Low XP, high HP: A reflective recovery.
   - Low XP and HP: A humorous and challenging ending.
`;

const initialImagePrompt =
  "First-person perspective in a hand-drawn fantasy illustration style inspired by mid-20th century Western children’s book art, such as Arthur Rackham or early 1900s fairy tale illustrations. The style features warm, muted earthy tones, whimsical and intricate linework, with a vintage storybook aesthetic perfect for magical and enchanting settings.";

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
  //let relevantContent = ""; // 提取的关键内容

  if (type === "character") {
    selectedChoices.value.character = choice;
    console.log("Selected character:", choice);
    xpChange = 1; // 选择角色增加少量经验值
    //relevantContent = `${choice} I begin My journey...`;

    await requestStoryPart(
      `${choice}, starting with XP: ${
        selectedChoices.value.XP + xpChange
      } and HP: ${selectedChoices.value.HP + hpChange}. I begin My journey...`
    );
  }
  if (type === "scene") {
    selectedChoices.value.scene = choice;
    //relevantContent = `Then, I step into  ${choice} Magical challenges lie ahead...`;

    // 场景选择影响较大
    xpChange = Math.floor(Math.random() * 2) + 1; // 1~2点经验值
    hpChange = -Math.floor(Math.random() * 2); // 0~1点生命值减少

    await requestStoryPart(
      `Then, I step into ${choice} Magical challenges lie ahead, and I can feel my XP and HP shifting with every decision I make...`
    );
  }
  if (type === "item") {
    selectedChoices.value.items.push(choice);
    console.log("Selected item:", choice);
    //relevantContent = `On the road, I came across a treasure chest and a map. My abilities allowed me to open only one, and I chose to open the ${choice}.`;

    // 物品可能恢复生命值或增加经验值
    const isHealingItem = Math.random() > 0.5; // 50% 概率恢复生命值
    if (isHealingItem) {
      hpChange = Math.floor(Math.random() * 2) + 1; // 1~2点生命值
    } else {
      xpChange = Math.floor(Math.random() * 3) + 1; // 1~3点经验值
    }

    await requestStoryPart(
      `I carefully open the ${choice} and discover... , I gain XP: ${
        selectedChoices.value.XP + xpChange
      }, and HP: ${selectedChoices.value.HP + hpChange}....`
    );
  }
  if (type === "storyPath") {
    selectedChoices.value.storyPath = choice;
    console.log("Selected story path:", choice);
    // 路径选择对 XP 和 HP 的影响显著
    xpChange = Math.floor(Math.random() * 4) + 1; // 1~4点经验值
    hpChange = -Math.floor(Math.random() * 3); // 0~2点生命值减少

    //relevantContent = `A Monster Appears! I decide to ${choice}`;

    await requestStoryPart(
      `A Monster Appears! I decide to ${choice}, My XP increase to ${
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
  } else if (currentStep.value === 3) {
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

  console.log("Requesting story part with prompt:", prompt);

  try {
    const part = await generateStory(prompt);
    console.log("Generated part:", part);

    if (part && part.trim()) {
      // 生成对应章节的图像
      const imagePrompt = `${initialImagePrompt}\n\n${part}`.trim();
      const imageUrl =
        (await flux_generateImage(imagePrompt)) ||
        "https://cdn.midjourney.com/acbe5e94-1b3e-4efc-816d-32fbb920519b/0_0.png";
      // 替换加载占位符为实际内容
      storyParts.value[storyParts.value.length - 1] = {
        //story: `${relevantContent}\n${part}`,
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
      const imagePrompt = `${initialImagePrompt}\n\n${ending}`.trim();
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

// 监听故事部分的变化，每次新增内容时自动滚动到最右侧
watch(storyParts, () => {
  if (rightPanel.value) {
    rightPanel.value.scrollLeft = rightPanel.value.scrollWidth; // 滚动到最右侧
  }
});
</script>

<template>
  <div class="story-app">
    <div class="header-container">
      <h1 class="header-title">Magical Adventure Game</h1>
      <DotLottieVue
        style="height: 60px; width: 150px"
        autoplay
        loop
        src="https://lottie.host/7f68f078-7ec8-42bc-843c-25e88dcc74df/6qlhHviqr8.lottie"
        class="header-icon"
      />
    </div>
    <p>Step into a world of magic and mystery—your adventure begins now!</p>
    <div class="centered-lottie" v-if="!isStarted">
      <DotLottieVue
        style="height: 350px; width: 350px"
        autoplay
        loop
        src="https://lottie.host/3a75e685-e718-4816-9c0a-adf3af822f49/ofTGo30P1n.lottie"
      />
    </div>

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
          v-if="currentStep === 2"
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
      <div class="right-panel" ref="rightPanel">
        <h3>Story Progress</h3>
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
  background-image: url("/assets/bg.png"); /* Relative path */
  background-size: cover; /* Cover the container */
  background-repeat: no-repeat; /* Avoid repeating */
  background-position: center; /* Center the image */
  color: #ffffff; /* White text */
  font-family: "Roboto", Arial, sans-serif; /* Clean sans-serif font */
}

/* 标题与图标容器 */
.header-container {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 1rem; /* 标题与图标间距 */
  margin-top: 4rem; /* 与上方内容拉开距离 */
}

/* 标题样式 */
.header-title {
  font-size: 2.8rem; /* 标题字体加大 */
  color: #ffa500; /* 金色标题 */
  text-align: center;
  text-shadow: 0 3px 5px rgba(0, 0, 0, 0.6); /* 柔和阴影 */
  margin: 0; /* 去掉默认外边距 */
  margin-left: 150px;
}

/* 图标样式 */
.header-icon {
  height: 50px;
  width: 120px;
  display: inline-block;
}

/* 副标题样式 */
.story-app p {
  font-size: 1.4rem; /* 副标题清晰字体 */
  text-align: center;
  margin-bottom: 2rem;
  color: #ffe4b5; /* 柔和金黄色 */
}

/* 居中 Lottie 动画 */
.centered-lottie {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin: 2rem 0; /* 增加上下间距 */
}

/* 按钮样式 */
.start-button {
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  background: #2a1e5c; /* 深紫色背景 */
  color: #ffa500; /* 金色文字 */
  border: 2px solid #ffa500; /* 金色边框 */
  border-radius: 12px;
  margin: 0 auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* 按钮阴影 */
  transition: all 0.3s ease-in-out;
}

.start-button:hover {
  background: #ffa500; /* 悬停时背景为金黄色 */
  color: #2a1e5c; /* 文字变为深紫色 */
  transform: scale(1.1); /* 悬停时轻微放大 */
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
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: 1rem;
  background: linear-gradient(135deg, #2a1e5c, #4e342e); /* 深紫到深棕渐变 */
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5); /* 左栏阴影 */
}

/* 右侧故事内容显示栏样式 */
.right-panel {
  flex: 0.7;
  background: linear-gradient(135deg, #2a1e5c, #4e342e); /* 深紫到深棕渐变 */
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  color: #ffffff; /* 白色字体 */
  overflow-x: auto; /* 横向滚动条 */
  overflow-y: hidden; /* 禁用纵向滚动条 */
  white-space: nowrap; /* 确保内容不会换行 */
}

.right-panel h3 {
  font-size: 1.8rem; /* 更大的标题字体 */
  color: #ffa500; /* 金色标题 */
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6); /* 柔和阴影 */
}

/* 故事进度网格 */
.story-grid {
  display: inline-flex;
  gap: 1rem; /* 卡片之间的间距 */
  align-items: flex-start;
}

/* 图标容器 */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 239, 180, 0.8); /* 柔和的浅金背景 */
  border: 2px solid #ffa500; /* 金色边框 */
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* 阴影增强 */
}

/* 单个故事输出部分 */
.story-output {
  max-width: 470px;
  margin: 0;
}

/* 图像容器样式 */
.image-container img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4); /* 图像轻微阴影 */
}

/* 错误提示 */
.error {
  color: #ff6f61;
  text-align: center;
  font-size: 1.2rem;
}

/* 加载中动画 */
.loading {
  font-size: 1.4rem;
  color: #ffa500; /* 金色加载文字 */
  text-align: center;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading::after {
  content: "";
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin-left: 0.5em;
  border-radius: 50%;
  border: 3px solid #ffa500;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
