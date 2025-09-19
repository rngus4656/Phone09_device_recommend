
import { GoogleGenAI, Type } from "@google/genai";
import type { UserPreferences, Recommendation, Phone } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchRecommendations = async (preferences: UserPreferences, phoneData: Phone[]): Promise<Recommendation[]> => {
  const { priorities, previousPhone } = preferences;

  const dataString = JSON.stringify(phoneData.map(p => ({
      brand: p.brand,
      model: p.model,
      release_date: p.release_date,
      soc_chip: p.soc_chip,
      main_camera_mp: p.main_camera_mp,
      battery_mAh: p.battery_mAh,
      notable_pros: p.notable_pros,
      msrp_krw: p.msrp_krw,
      street_price_krw: p.street_price_krw
  })));

  const prompt = `
    너는 최신 스마트폰 데이터에 정통한 전문가야. 제공된 JSON 데이터를 기반으로 사용자 선호도에 가장 적합한 스마트폰 3개를 추천해야 해.

    **스마트폰 데이터:**
    ${dataString}

    **사용자 요구사항:**
    - 중요하게 생각하는 요소: ${priorities.join(', ')}
    - 이전에 사용하던 기종: ${previousPhone || '정보 없음'}

    **지시사항:**
    1.  사용자의 '중요하게 생각하는 요소'를 최우선으로 고려하여 스마트폰 3개를 추천해줘.
    2.  각 추천 기종에 대해, 'recommendationReason' 필드에 왜 그 기종을 추천하는지 사용자의 선호도와 데이터의 특징을 연결해서 명확하고 구체적으로 설명해줘.
    3.  'keyPros' 필드에는 데이터의 'notable_pros'를 요약해서 기입해줘.
    4.  'priceRange' 필드에는 데이터의 'msrp_krw' 또는 'street_price_krw'를 참고해서 "약 OOO원 ~ OOO원" 또는 "프리미엄급", "가성비 모델" 과 같이 가격대를 유추하여 알려줘.
    5.  반드시 제공된 데이터 내에 있는 모델만 추천해야 해.
    6.  결과는 JSON 형식으로 반환해줘.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              brand: { type: Type.STRING },
              model: { type: Type.STRING },
              recommendationReason: { type: Type.STRING },
              keyPros: { type: Type.STRING },
              priceRange: { type: Type.STRING },
            },
            required: ["brand", "model", "recommendationReason", "keyPros", "priceRange"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("API 응답이 비어있습니다.");
    }

    const result = JSON.parse(jsonText);
    return result as Recommendation[];

  } catch (error) {
    console.error("Error fetching recommendations from Gemini API:", error);
    throw new Error("Failed to parse recommendation response.");
  }
};
