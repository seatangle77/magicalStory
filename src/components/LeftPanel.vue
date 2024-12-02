<script setup lang="ts">
import { ref, onMounted, nextTick, PropType } from "vue";

// 导入所需的子组件
import CharacterSelection from "./CharacterSelection.vue";
import SceneSelection from "./SceneSelection.vue";
import ItemSelection from "./ItemSelection.vue";
import StoryPathSelection from "./StoryPathSelection.vue";

// 定义 Props 接口
interface Choices {
  character: string;
  scene: string;
  items: string[];
  storyPath: string;
  XP: number;
  HP: number;
}

// 接收 Props
const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  selectedChoices: {
    type: Object as PropType<Choices>,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
});

// 向父组件发送事件
const emit = defineEmits(["select", "nextStep"]);

// 处理选择事件
const handleSelection = (type: string, choice: string) => {
  emit("select", type, choice); // 通知父组件当前的选择
};

// 处理下一步事件
const handleNextStep = () => {
  emit("nextStep"); // 通知父组件进入下一步
};

// 模式切换
const isActionMode = ref(false); // 是否处于动作识别模式
const videoRef = ref<HTMLVideoElement | null>(null); // 摄像头视频流
const actionDetected = ref(""); // 动作识别的结果

// 开启摄像头
const startCamera = async () => {
  console.log("startCamera 方法已被调用");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("当前浏览器不支持摄像头访问，请更换浏览器！");
    return;
  }

  try {
    await nextTick(); // 等待 DOM 更新完成
    if (!videoRef.value) {
      console.error("videoRef 仍然为空，无法开启摄像头");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true, // 启用摄像头
    });
    videoRef.value.srcObject = stream;
    await videoRef.value.play(); // 开始播放摄像头视频
    console.log("摄像头已成功开启！");
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("无法访问摄像头，请检查权限或设备连接！");
  }
};

// 关闭摄像头
const stopCamera = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const tracks = (videoRef.value.srcObject as MediaStream).getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.value.srcObject = null;
    console.log("摄像头已关闭！");
  }
};

// 模式切换逻辑
const toggleMode = () => {
  isActionMode.value = !isActionMode.value;

  if (isActionMode.value) {
    startCamera(); // 开启摄像头
    actionDetected.value = ""; // 清空识别结果
  } else {
    stopCamera(); // 关闭摄像头
  }
};

// 模拟动作识别（替换为真实逻辑）
const detectAction = () => {
  const mockActions = ["character", "scene", "item", "storyPath"];
  const randomAction =
    mockActions[Math.floor(Math.random() * mockActions.length)];
  actionDetected.value = randomAction;

  // 根据当前步骤触发选择事件
  if (props.currentStep === 0)
    handleSelection("character", "Detected Character");
  if (props.currentStep === 1) handleSelection("scene", "Detected Scene");
  if (props.currentStep === 2) handleSelection("item", "Detected Item");
  if (props.currentStep === 3) handleSelection("storyPath", "Detected Path");
};

// 确保 `videoRef` 在 DOM 挂载完成后可用
onMounted(() => {
  console.log("视频元素已挂载，videoRef:", videoRef);
});
</script>

<template>
  <div class="left-panel">
    <!-- 模式切换按钮 -->
    <button @click="toggleMode" class="toggle-mode">
      {{ isActionMode ? "Switch to Mouse Mode" : "Switch to Action Mode" }}
    </button>

    <!-- 动作识别模式 -->
    <div v-if="isActionMode" class="action-mode">
      <video ref="videoRef" class="camera-feed"></video>
      <button @click="detectAction" class="detect-button">Detect Action</button>
      <p v-if="actionDetected">Detected Action: {{ actionDetected }}</p>
    </div>

    <!-- 鼠标点击模式 -->
    <div>
      <!-- 角色选择 -->
      <CharacterSelection
        v-if="currentStep === 0"
        @select="(choice) => handleSelection('character', choice)"
      />

      <!-- 场景选择 -->
      <SceneSelection
        v-if="currentStep === 1"
        @select="(choice) => handleSelection('scene', choice)"
      />

      <!-- 道具选择 -->
      <ItemSelection
        v-if="currentStep === 2"
        :disabledItems="selectedChoices.items"
        @select="(choice) => handleSelection('item', choice)"
      />

      <!-- 故事路径选择 -->
      <StoryPathSelection
        v-if="currentStep === 3"
        @select="(choice) => handleSelection('storyPath', choice)"
      />
    </div>

    <!-- "Next Step" 按钮 -->
    <button @click="handleNextStep" class="next-step">Next Step</button>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<style scoped>
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

.toggle-mode {
  background-color: #ffa500;
  color: #2a1e5c;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

.toggle-mode:hover {
  background-color: #ffcc80;
}

.action-mode .camera-feed {
  width: 100%;
  height: 240px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.detect-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

.detect-button:hover {
  background-color: #66bb6a;
}

.next-step {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

.next-step:hover {
  background-color: #64b5f6;
}

.error {
  color: #ff6f61;
  text-align: center;
  font-size: 1.2rem;
}
</style>
