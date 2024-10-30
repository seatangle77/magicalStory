import { ref } from 'vue';

const API_KEY = '77f41932a23a429cb68b84e3cd7c8321914531b95d8d48b8a21dc1f983ec51ea';

export function useStoryGenerator() {
  const story = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const messages = ref([
    {
      role: 'system',
      content: 'You are a creative storyteller who creates magical and engaging stories in chapters. Each response should continue the story in approximately 100-200 words.'
    }
  ]);

  const generateStory = async (prompt: string) => {
    try {
      isLoading.value = true;
      error.value = '';
      
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages.value,
          max_tokens: 150, // 限制生成的内容长度，适合100~200字
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      story.value = data.choices[0].message.content;
      console.log('story.value',story.value)
    } catch (e) {
      error.value = e instanceof Error 
        ? `Failed to generate story: ${e.message}`
        : 'Failed to generate story. Please try again later.';
      console.error('Story generation error:', e);
    } finally {
      isLoading.value = false;
    }

    return story.value
  };

  return {
    generateStory,
    story,
    isLoading,
    error
  };
}