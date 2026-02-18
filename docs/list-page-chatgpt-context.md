# 一覧ページを ChatGPT に共有するときの補足

- 一覧は **Projects** と **Artworks** の2種で、どちらも `ListPageContent` を使い、`listVariant` と `items` / `basePath` だけ変えている。
- 表示は **モバイル** / **PC（パン有効・ListPanView）** / **PC（パン無効・静的）** の3分岐。
- 依存: `AnimatedLink`, `ListPanView`, `ListBackgroundThumb`, `useTheme`, `@/lib/text-layers`, `@/lib/data/types`, `projects` / `artworks` from `@/lib/data`.
