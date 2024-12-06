import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// Azure Speech Service 配置信息
const AZURE_SUBSCRIPTION_KEY = "Dnow1WGXrJpdGGFjQX0s06Zuk5HYgE7xAz8mFHlzQzzUi2EfQjn6JQQJ99ALACYeBjFXJ3w3AAAYACOGUgfv";
const AZURE_REGION = "eastus"; // 替换为你的区域

// 初始化 Speech Config
const speechConfig = sdk.SpeechConfig.fromSubscription(
  AZURE_SUBSCRIPTION_KEY,
  AZURE_REGION
);

// 设置默认语音配置
speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural"; // 可根据需求更改
speechConfig.speechSynthesisLanguage = "en-US"; // 设置默认语言

// 创建 Speech Synthesizer
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

/**
 * 使用 Azure Speech Service 播放语音
 * @param text 要朗读的文本
 * @returns Promise<void>
 */
export const playTextWithAzure = (text: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // 朗读文本
    synthesizer.speakTextAsync(
      text,
      () => {
        console.log("Speech synthesis completed.");
        resolve();
      },
      (error) => {
        console.error("Speech synthesis error:", error);
        reject(error);
      }
    );
  });
};