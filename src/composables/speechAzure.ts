import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { ref } from "vue";

export function useAzureSpeechToText() {
  const userSpeech = ref(""); // 实时转录文本
  const isListening = ref(false); // 录音状态
  const error = ref(""); // 错误信息
  let recognizer = null; // Azure Speech Recognizer 实例

  // 初始化语音识别
  const initSpeechRecognizer = () => {
    const subscriptionKey = "Dnow1WGXrJpdGGFjQX0s06Zuk5HYgE7xAz8mFHlzQzzUi2EfQjn6JQQJ99ALACYeBjFXJ3w3AAAYACOGUgfv";
    const serviceRegion = "eastus"; // 服务区域

    try {
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
      speechConfig.speechRecognitionLanguage = "zh-CN"; // 语言设置为中文

      // 创建麦克风音频输入
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

      // 创建语音识别器
      recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    } catch (err) {
      console.error("初始化语音识别器失败:", err);
      error.value = "初始化失败，请检查 Azure 配置。";
    }
  };

  // 开始录音并识别
  const startListening = () => {
    if (!recognizer) {
      initSpeechRecognizer();
    }

    isListening.value = true;
    userSpeech.value = ""; // 清空之前的转录文本

    console.log("开始识别语音...");

    // 开始语音识别
    recognizer.recognizing = (s, e) => {
      console.log(`识别中: ${e.result.text}`);
      userSpeech.value = e.result.text; // 更新实时文本
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        console.log(`识别完成: ${e.result.text}`);
        userSpeech.value += e.result.text; // 添加到最终结果
      } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.log("未匹配任何语音。");
      }
    };

    recognizer.canceled = (s, e) => {
      console.error("识别被取消:", e);
      error.value = "识别失败，请检查网络或密钥配置。";
      isListening.value = false;
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("会话停止。");
      isListening.value = false;
    };

    recognizer.startContinuousRecognitionAsync();
  };

  // 停止录音和识别
  const stopListening = () => {
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("语音识别已停止。");
          isListening.value = false;
        },
        (err) => {
          console.error("停止识别时出错:", err);
          error.value = "停止识别失败。";
        }
      );
    }
  };

  return {
    userSpeech,
    isListening,
    error,
    startListening,
    stopListening,
  };
}