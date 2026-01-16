// src/features/evaluation/hooks/usePlateScore.ts
import {useEffect, useState} from 'react';
import { plateEvaluator } from '../services/PlateEvaluatorService';
import { fetchPlateScore } from '../services/ScoreApiService';

export function usePlateScore(
    templateUri: string | null,
    compareUri: string | null,
    scoringCriteria: string | null,
    enabled: boolean = true,
){
    const [score, setScore] = useState<number | null>(null);
    const [comment, setComment] = useState<string | null>(null);
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
            setComment(null);
            setCroppedTemplateUri(templateUri);
            setCroppedCompareUri(null);
            return;
        }

        setCroppedTemplateUri(templateUri);
        setCroppedCompareUri(compareUri);
        setScore(null);
        setComment(null);

        let cancelled = false;
        const run = async () => {
            setLoading(true);
            setError(null);
            try{
                // とりあえず「比較画像」だけ皿検出する（将来は両方やっても良い）
                const compareResult = await plateEvaluator.detectAndCropPlate(compareUri);

                // 今はお手本側はそのまま使う（将来ここも detectAndCropPlate してもOK）
                if (cancelled) {
                    return;
                }
                setCroppedTemplateUri(templateUri);
                setCroppedCompareUri(compareResult.croppedImageUri);

                //将来はここにヒストグラムやCNNの処理を入れる
                if (templateUri) {
                    const normalizedCriteria = scoringCriteria?.trim() ? scoringCriteria.trim() : null;
                    const apiResult = await fetchPlateScore(
                        templateUri,
                        compareResult.croppedImageUri,
                        normalizedCriteria,
                    );
                    setScore(apiResult.score);
                    setComment(apiResult.comment);
                    console.log('Score API result:', apiResult);
                } else {
                    setScore(null);
                    setComment(null);
                }
            }   catch (e) {
                if (cancelled) {
                    return;
                }
                console.warn(e);
                setError('スコア計算に失敗しました');
                setScore(null);
                setComment(null);
            }   finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };
        
        run();
        return () => {
            cancelled = true;
        };
    }, [templateUri, compareUri, scoringCriteria, enabled]);
    
    return {
        score,
        comment,
        loading,
        error,
        croppedTemplateUri,
        croppedCompareUri,
    };
}

