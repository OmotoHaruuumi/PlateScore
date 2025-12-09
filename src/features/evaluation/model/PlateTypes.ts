// src/features/evaluation/model/plateTypes.ts

// 皿検出＋クリップの結果
export type PlateDetectionResult = {
    centerX: number;
    centerY: number;
    radius: number; 
    // 皿だけ切り抜いてサイズをそろえた画像URI 
    croppedImageUri: string;
};


// 皿検出器のインターフェース
export interface PlateEvaluator{
    detectAndCropPlate(imageUri: string): Promise<PlateDetectionResult>
}
