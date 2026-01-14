// src/features/evaluation/hooks/usePlateScore.ts
import {useEffect, useState} from 'react';
import { plateEvaluator } from '../services/PlateEvaluatorService';
import { fetchPlateScore } from '../services/ScoreApiService';

export function usePlateScore(
    templateUri: string | null,
    compareUri: string | null,
    enabled: boolean = true,
){
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [croppedTemplateUri, setCroppedTemplateUri] = useState<string | null>(null);
    const [croppedCompareUri, setCroppedCompareUri] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (!compareUri){
            setScore(null);
            setCroppedTemplateUri(templateUri);
            setCroppedCompareUri(null);
            return;
        }

        const run = async () => {
            setLoading(true);
            setError(null);
            try{
                // とりあえず「比較画像」だけ皿検出する（将来は両方やっても良い）
                const compareResult = await plateEvaluator.detectAndCropPlate(compareUri);

                // 今はお手本側はそのまま使う（将来ここも detectAndCropPlate してもOK）
                setCroppedTemplateUri(templateUri);
                setCroppedCompareUri(compareResult.croppedImageUri);

                //将来はここにヒストグラムやCNNの処理を入れる
                if (templateUri) {
                    const apiScore = await fetchPlateScore(templateUri, compareResult.croppedImageUri);
                    setScore(apiScore);
                } else {
                    setScore(null);
                }
            }   catch (e) {
                console.warn(e);
                setError('スコア計算に失敗しました');
                setScore(null);
            }   finally {
                setLoading(false);
            }
        };
        
        run();
    }, [templateUri, compareUri, enabled]);
    
    return {
        score,
        loading,
        error,
        croppedTemplateUri,
        croppedCompareUri,
    };
}

