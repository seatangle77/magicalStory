<script setup lang="ts">
defineProps<{
  disabled: boolean;
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'generate'): void;
}>();
</script>

<template>
  <div class="story-input">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      placeholder="Enter your story prompt here..."
      :disabled="disabled"
      class="input-field"
    ></textarea>
    <button 
      @click="$emit('generate')"
      :disabled="disabled || !modelValue.trim()"
      class="generate-button"
    >
      {{ disabled ? 'Creating Magic...' : 'Generate Story' }}
    </button>
  </div>
</template>

<style scoped>
.story-input {
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  width: 100%;
  height: 150px;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background-color: white;
  color: #333;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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
  width: 100%;
}

.generate-button:hover {
  background-color: #3aa876;
}

.generate-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>