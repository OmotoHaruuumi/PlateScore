// src/features/evaluation/hooks/usePlateScore.ts
import {useEffect, useState} from 'react';
import { plateEvaluator } from '../services/PlateEvaluatorService';

export function usePlateScore(templateUri: string | null, compareUri: string | null){
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [croppedTemplateUri, setCroppedTemplateUri] = useState<string | null>(null);
    const [croppedCompareUri, setCroppedCompareUri] = useState<string | null>(null);

    useEffect(() => {
        if (!templateUri || !compareUri){
            setScore(null);
            setCroppedTemplateUri(null);
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
                const dummyScore = 100;
                setScore(dummyScore);
            }   catch (e) {
                console.warn(e);
                setError('スコア計算に失敗しました');
                setScore(null);
            }   finally {
                setLoading(false);
            }
        };
        
        run();
    }, [templateUri, compareUri]);
    
    return {
        score,
        loading,
        error,
        croppedTemplateUri,
        croppedCompareUri,
    };
}

