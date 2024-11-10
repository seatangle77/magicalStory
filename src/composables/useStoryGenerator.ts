import { ref } from 'vue';

const API_KEY = '77f41932a23a429cb68b84e3cd7c8321914531b95d8d48b8a21dc1f983ec51ea';

export function useStoryGenerator() {
  const story = ref('');
  const image = ref('');
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

    // 新增的 generateImage 方法，用于生成 DALL-E 3 图片
    const generateImage = async (_prompt: string) => {
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
            model: 'dall-e-3',  // 指定为 DALL-E 3 模型
            prompt: _prompt,
            n: 1,               // 请求生成一张图片
            size: '1024x1024'   // 设置图像大小，可根据需求调整
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
        }
  
        const data = await response.json();
        if (!data.data?.[0]?.url) {
          throw new Error('Invalid response format from API');
        }
  
        image.value = data.data[0].url;
        console.log('image.url', image.value);
      } catch (e) {
        error.value = e instanceof Error 
          ? `Failed to generate image: ${e.message}`
          : 'Failed to generate image. Please try again later.';
        console.error('Image generation error:', e);
      } finally {
        isLoading.value = false;
      }
  
      return image.value;
    };

  return {
    generateStory,
    generateImage, 
    story,
    image,
    isLoading,
    error
  };
}