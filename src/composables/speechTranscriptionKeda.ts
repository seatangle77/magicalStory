import { ref } from "vue";
import CryptoJS from "crypto-js"; // For generating authorization signatures

// iFlyTek API Details
const APPID = "6a70688f";
const API_SECRET = "NzlkMWJkMjA4MmY4ZGIzODZkNDI5MWQ4";
const API_KEY = "30748f61424240bd78ae656b6e626c75";
const WS_URL = "wss://iat-api.xfyun.cn/v2/iat";


export function speechTranscription() {

  const userSpeech = ref(""); // 实时转录文本
  const isListening = ref(false); // 录音状态
  const error = ref(""); // 错误信息
  let ws: WebSocket | null = null; // WebSocket 实例
  let recorder: any = null; // 使用官方 RecorderManager
  let resultText = ""; // 最终转录文本
  let resultTextTemp = ""; // 动态更新的转录文本


  const getWebSocketUrl = () => {
    const url = "wss://iat-api.xfyun.cn/v2/iat";
    const host = "iat-api.xfyun.cn";
    const date = new Date().toGMTString();
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
  };

  const renderResult = (resultData: string) => {
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = data.ws.map((w: any) => w.cw[0].w).join("");
      if (data.pgs === "apd") {
        resultText = resultTextTemp;
      }
      resultTextTemp = resultText + str;
      userSpeech.value = resultTextTemp || resultText || "";
    }
    if (jsonData.data.status === 2) ws?.close();
  };

  const initWebSocket = () => {
    ws = new WebSocket(getWebSocketUrl());
    ws.onopen = () => {
      console.log("WebSocket 连接成功");
      ws.send(
        JSON.stringify({
          common: { app_id: APPID },
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            vad_eos: 5000,
            dwa: "wpgs",
          },
          data: { status: 0, format: "audio/L16;rate=16000", encoding: "raw" },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        renderResult(event.data);
      } catch (e) {
        console.error("Failed to process message:", e);
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket 错误:", e);
      error.value = "WebSocket 连接失败";
    };
    ws.onclose = () => {
      console.log("WebSocket 连接关闭");
    };
  };

  const startListening = () => {
    recorder = new RecorderManager("/recorder");
    recorder.onStart = () => {
      console.log("录音开始");
      isListening.value = true;
      initWebSocket();
    };

    recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            data: {
              status: isLastFrame ? 2 : 1,
              format: "audio/L16;rate=16000",
              encoding: "raw",
              audio: btoa(String.fromCharCode(...new Uint8Array(frameBuffer))),
            },
          })
        );
      }
    };

    recorder.start({
      sampleRate: 16000,
      frameSize: 1280,
    });
  };

  const stopListening = () => {
    if (recorder) recorder.stop();
    if (ws) ws.close();
    isListening.value = false;
  };

  return {
    userSpeech,
    isListening,
    error,
    startListening,
    stopListening,
  };
}