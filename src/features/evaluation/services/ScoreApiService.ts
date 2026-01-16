import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

const SCORE_API_URL = Constants.expoConfig?.extra?.SCORE_API_URL;

if (!SCORE_API_URL) {
  console.warn('EXPO_PUBLIC_SCORE_API_URL is not set.');
}

async function toBase64(uri: string) {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export async function fetchPlateScore(
  templateUri: string,
  compareUri: string,
  scoringCriteria: string | null,
) {
  if (!SCORE_API_URL) {
    throw new Error('Score API URL is not configured');
  }

  const [templateBase64, compareBase64] = await Promise.all([
    toBase64(templateUri),
    toBase64(compareUri),
  ]);

  const res = await fetch(`${SCORE_API_URL}/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateBase64, compareBase64, scoringCriteria }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Score API failed');
  }

  const data = await res.json();
  return {
    score: data.score as number,
    comment: (data.comment as string | undefined) ?? null,
  };
}
