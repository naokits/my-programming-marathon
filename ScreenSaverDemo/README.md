# ScreenSaverDemo

OS Xのスクリーンセーバーのデモ

## 概要[WIP]

スクリーンセーバーの動作

- インターネットに接続している場合
    - 指定されたURLの内容を、指定された時間表示する
    - URLはParse.comのDBから取得する
    - 各サイトの表示時間はParse.comから取得する
- インターネットに接続していない場合
    - 組み込みのHTMLの内容を表示する

## 動作確認環境
- OS X EI Capitan 10.11.2 (15B42)
- Xcode Version 7.2 (7C68)
- MacBook Pro 15' 2014

## 関連情報

- [Screen Saver Framework Reference](https://developer.apple.com/library/mac/documentation/UserExperience/Reference/ScreenSaver/ObjC_classic/index.html#//apple_ref/doc/uid/20001822)

## その他

- 使用するParseのAPIキーは、 `ParseLoginDemo` と同じものを使用する
