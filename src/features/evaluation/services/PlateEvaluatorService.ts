// src/features/evaluation/services/plateEvaluatorService.ts
import { PlateDetectionResult, PlateEvaluator} from '../model/PlateTypes'

class JsPlateEvaluator implements PlateEvaluator{
    async detectAndCropPlate(imageUri: string): Promise<PlateDetectionResult>{
        return {
            centerX: 0,
            centerY: 0,
            radius: 0,
            // 今はそのまま元画像をお返しておく（皿だけにはなっていない）
            croppedImageUri: imageUri,
        };
    }
}


//アプリ内で使う唯一の実体
export const plateEvaluator: PlateEvaluator = new JsPlateEvaluator();