<script setup lang="ts">
import { ref, PropType } from "vue";
import { useAzureSpeechToText } from "../composables/speechAzure";

// Import child components
import CharacterSelection from "./CharacterSelection.vue";
import SceneSelection from "./SceneSelection.vue";

// Define Props interface
interface Choices {
  character: string;
  scene: string;
  items: string[];
  storyPath: string;
}

// Define Props
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

// Emit events to parent
const emit = defineEmits(["select", "submitSpeech"]);

// Use composable for speech recognition
const {
  userSpeech,
  isListening,
  startListening,
  stopListening,
  error: transcriptionError,
} = useAzureSpeechToText();

const handleStartListening = async () => {
  startListening(); // Start recording
};

const handleStopListening = async () => {
  console.log("点击结束按钮");
  stopListening(); // Stop recording
};

// Submit speech content
const handleSubmitSpeech = () => {
  emit("submitSpeech", userSpeech.value); // Emit textarea content to parent
};

// Handle character/scene selection
const handleSelection = (type: string, choice: string) => {
  emit("select", type, choice);

  // Automatically move to the next step if a character is selected
  if (type === "character") {
    emit("select", "nextStep", "scene");
  }
};
</script>

<template>
  <div class="left-panel">
    <!-- Character Selection -->
    <CharacterSelection
      v-if="currentStep === 0"
      @select="(choice) => handleSelection('character', choice)"
    />

    <!-- Scene Selection -->
    <SceneSelection
      v-if="currentStep === 1"
      @select="(choice) => handleSelection('scene', choice)"
    />

    <!-- Speech Input -->
    <div v-if="currentStep === 2" class="speech-input">
      <h3>🪄 Speak Your Magic Spell</h3>
      <textarea
        v-model="userSpeech"
        placeholder="Say your magic spell..."
        rows="3"
      ></textarea>
      <div class="mic-controls">
        <button
          @click="handleStartListening"
          :disabled="isListening"
          class="start-btn"
        >
          🎙 Start Listening
        </button>
        <button
          @click="handleStopListening"
          :disabled="!isListening"
          class="stop-btn"
        >
          ✋ Stop Listening
        </button>
      </div>
      <button @click="handleSubmitSpeech" class="submit-btn">✨ Submit</button>
    </div>

    <!-- Error Display -->
    <div v-if="error || transcriptionError" class="error">
      🚨 {{ error || transcriptionError }}
    </div>
  </div>
</template>

<style scoped>
.left-panel {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #332244, #443355);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  color: #fefefe;
}

.speech-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.speech-input h3 {
  font-size: 1.6rem;
  color: #ffda79;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.speech-input textarea {
  width: 100%; /* 调整宽度避免 padding 顶出 */
  padding: 0.8rem;
  border: 2px solid #ffda79;
  border-radius: 10px;
  background-color: #fff;
  resize: none;
  font-size: 1.2rem;
  font-family: "Arial", sans-serif;
  color: #333;
  box-sizing: border-box; /* 确保 padding 不会影响宽度 */
  margin: 0; /* 确保没有额外的 margin 顶出 */
}

.mic-controls {
  display: flex;
  gap: 1rem;
}

.mic-controls button {
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: #fff;
}

.start-btn:hover {
  background: linear-gradient(135deg, #388e3c, #4caf50);
}

.stop-btn {
  background: linear-gradient(135deg, #f44336, #e57373);
  color: #fff;
}

.stop-btn:hover {
  background: linear-gradient(135deg, #d32f2f, #f44336);
}

.submit-btn {
  padding: 1rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #303f9f, #3f51b5);
}

.error {
  color: #ff6f61;
  font-size: 1rem;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 0.5rem;
  border: 1px solid #ff6f61;
  border-radius: 8px;
  text-align: center;
}
</style>
