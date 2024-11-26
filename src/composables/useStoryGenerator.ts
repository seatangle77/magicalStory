import { ref } from 'vue';

const GPT_API_KEY = '77f41932a23a429cb68b84e3cd7c8321914531b95d8d48b8a21dc1f983ec51ea';
const IMAGE_API_KEY = 'sk-YJ5YPHI4Kg6HgCCbSXUN6oXvmkPoV1h0AP9f3T5T9vbqwkGl';



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
          'Authorization': `Bearer ${GPT_API_KEY}`
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

  const generateImage = async (_prompt: string) => {
    try {
      isLoading.value = true;
      error.value = '';
  
      const formData = new FormData();
      formData.append('prompt', _prompt);
      formData.append('output_format', 'jpeg');
  
      const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sd3', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${IMAGE_API_KEY}`,
          Accept: 'application/json', // 请求返回 JSON 格式
        },
        body: formData, // FormData 自动设置 Content-Type
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`${response.status}: ${errorData}`);
      }
  
      // JSON 响应解析
      const data = await response.json();
      if (!data.image) {
        throw new Error('Invalid response: missing image data');
      }
  
      // 解码 Base64 数据为 Blob
      const byteCharacters = atob(data.image);
      const byteNumbers = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
  
      image.value = blobUrl;
      console.log('Image URL:', blobUrl);
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