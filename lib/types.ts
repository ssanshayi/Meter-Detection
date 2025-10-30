// lib/types.ts
export type Detection = {
    class_id: number;
    class_name: string;
    confidence: number;
    xyxy: [number, number, number, number]; // [x1,y1,x2,y2]
  };
  
  export type PredictResponse = {
    detections: Detection[];
    image_base64?: string; // 如果后端返回带框图，可直接显示
    ok?: boolean;
    error?: string;
  };
  