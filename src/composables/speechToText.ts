import { ref } from "vue";
import Recorder from "recorder-js"; // 从 npm 包引入

// Google Speech-to-Text API Details
const API_KEY = "AIzaSyBHJruOjcsvu2ZAu9PbhOPkm9ifsUeQe5A";
const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`;

export function speechToText() {
  const userSpeech = ref(""); // 实时转录文本
  const isListening = ref(false); // 录音状态
  const error = ref(""); // 错误信息
  let recorder = null; // Recorder 实例
  let audioContext = null; // 保存 AudioContext 实例
  let audioChunks = []; // 存储录音数据

  // 初始化 Recorder
  const initRecorder = async () => {
    try {
      // 确保 AudioContext 不重复初始化
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      recorder = new Recorder(audioContext);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.init(stream);
      console.log("Recorder 初始化成功");
    } catch (err) {
      console.error("初始化录音失败:", err);
      error.value = "无法访问麦克风，请检查权限设置。";
    }
  };

  // 将音频转为 Base64
  const toBase64 = (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  };

  // 上传音频并调用 Google Speech-to-Text API
  const uploadAudio = async (audioData) => {
    const base64Audio = toBase64(audioData);
    const payload = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "zh-CN", // 设置语言代码
      },
      audio: {
        content: base64Audio,
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result && result.results) {
        const transcript = result.results
          .map((res) => res.alternatives[0].transcript)
          .join("\n");
        userSpeech.value = transcript;
      } else {
        error.value = "未能识别音频，请重试。";
        console.error("API 返回无效结果：", result);
      }
    } catch (err) {
      console.error("API 请求失败:", err);
      error.value = "API 请求失败，请检查网络连接或 API 配置。";
    }
  };

  // 开始录音
  const startListening = async () => {
    try {
      if (!recorder) {
        await initRecorder();
      }

      audioChunks = []; // 清空之前的录音数据
      await recorder.start(); // 开始录音
      isListening.value = true;
      console.log("开始录音...");
    } catch (err) {
      console.error("录音失败:", err);
      error.value = "录音启动失败，请检查权限或浏览器支持。";
    }
  };

  // 停止录音并处理音频
  const stopListening = async () => {
    try {
      if (!recorder) {
        throw new Error("Recorder 未初始化，请重试。");
      }

      const { buffer } = await recorder.stop(); // 停止录音
      console.log("录音结束...");
      const audioBlob = new Blob(buffer, { type: "audio/wav" });

      // 使用 FileReader 读取音频数据
      const reader = new FileReader();
      reader.onload = () => {
        uploadAudio(reader.result); // 上传录音数据到 API
      };
      reader.onerror = (err) => {
        console.error("读取音频数据失败:", err);
        error.value = "音频数据处理失败，请重试。";
      };
      reader.readAsArrayBuffer(audioBlob);

      isListening.value = false;
    } catch (err) {
      console.error("停止录音失败:", err);
      error.value = "录音停止失败，请重试。";
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