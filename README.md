src/
  screens/        # 画面コンポーネント（ナビゲーションの単位）
  features/       # 機能ごとのロジック・UI（ドメイン単位）
  ui/             # 共通UIパーツ（ボタン、カードなど）
  core/           # アプリ全体で使う土台（設定・状態・ネイティブ橋渡し）
  lib/            # 小さなユーティリティ関数
  types/          # 共通の型定義
  mocks/          # モックデータ・開発用


  src/
  screens/        # 画面コンポーネント（ナビゲーションの単位）
  features/       # 機能ごとのロジック・UI（ドメイン単位）
  ui/             # 共通UIパーツ（ボタン、カードなど）
  core/           # アプリ全体で使う土台（設定・状態・ネイティブ橋渡し）
  lib/            # 小さなユーティリティ関数
  types/          # 共通の型定義
  mocks/          # モックデータ・開発用


src/screens/
  HomeScreen.tsx          # ホーム（メニュー選択・「撮影へ」ボタンなど）
  CaptureScreen.tsx       # 撮影画面（カメラプレビュー）
  ResultScreen.tsx        # 結果画面（採点結果表示）
  SettingsScreen.tsx      # 設定（将来）
  HistoryScreen.tsx       # 履歴（将来）


src/features/
  menu/                   # メニュー定義・お手本データ
    components/
      MenuCard.tsx        # メニュー一覧カード
      MenuList.tsx
    hooks/
      useMenuList.ts      # メニュー一覧取得
    model/
      menuTemplate.ts     # MenuTemplate 型・ロジック
    api/
      menuTemplateSource.ts  # assets/templates/*.json 読み込み

  capture/                # 撮影フロー
    components/
      CameraOverlay.tsx   # 器ガイド・お手本透過
      CaptureButton.tsx
    hooks/
      useRamenCapture.ts  # 「撮る→ファイル保存」までをまとめる
      useCameraPermission.ts
    services/
      cameraService.ts    # expo-camera を薄くラップする

  evaluation/             # 採点処理（JSレイヤ）
    model/
      evaluationTypes.ts  # BowlScore, SectorScore 型
    services/
      evaluationService.ts    # ネイティブ評価呼び出しの入口
      dummyEvaluation.ts      # 最初はここにダミー採点
    hooks/
      useEvaluateRamen.ts     # 画面から使いやすくするためのフック
    components/
      BowlScoreView.tsx       # 器の円グラフ表示など

  onboarding/             # 初回チュートリアル（必要になったら）



src/ui/
  components/
    Button.tsx
    Text.tsx
    Card.tsx
    Modal.tsx
    LoadingOverlay.tsx
  layout/
    Screen.tsx           # SafeArea入りの共通レイアウト
    Centered.tsx
  theme/
    colors.ts
    spacing.ts
    typography.ts
    index.ts


src/core/
  navigation/             # React Navigation 設定（導入したら）
    AppNavigator.tsx
    types.ts
  config/
    env.ts                # 環境変数・フラグ
    constants.ts          # 全体の定数
  store/
    appStore.ts           # Zustand / Redux / jotai など（使うなら）
    index.ts
  native/
    modules/
      RamenEvaluatorModule.ts  # ネイティブ評価モジュールのJSラッパ
    index.ts
  errors/
    errorHandler.ts
  analytics/
    analyticsClient.ts    # 将来：イベント送信など


src/lib/
  math/
    angle.ts           # 角度の正規化など
  image/
    pathHelpers.ts     # 画像パスの扱い
  date/
    format.ts
  logger/
    logger.ts



rc/mocks/
src/types/
  global.d.ts           # 画像importの型定義など
  index.ts

src/mocks/
  templates/
    shoyu_01.json       # 開発用のモックテンプレート
  evaluation/
    sampleScores.json   # ダミースコア



assets/
  images/
    templates/
      shoyu_01.png
      miso_01.png
    ui/
      logo.png
      splash.png
  templates/
    shoyu_01.json       # 本番で使うお手本定義
    miso_01.json
  fonts/
    NotoSansJP-Regular.ttf