import { ref } from 'vue';

const API_KEY = '77f41932a23a429cb68b84e3cd7c8321914531b95d8d48b8a21dc1f983ec51ea';

export function useStoryGenerator() {
  const story = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const messages = ref([{
    role: 'user',
    content: '',
  }]);
 
  const generateStory = async (_prompt: string) => {
    try {
      isLoading.value = true;
      error.value = '';

            // 将新的用户消息添加到 messages 中
            messages.value.push({
              role: 'user',
              content: _prompt
            });
      
      const response = await fetch('/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages.value,
          max_tokens: 100, // 
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