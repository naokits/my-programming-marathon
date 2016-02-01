# NCMB_iOSAppDemo


mBaaSの一つであるNCMB（Nifty Cloud Mobile Backend）を使用したデモアプリ

## 概要[WIP]

1. メールアドレスとパスワードによるサインアップ、ログイン
2. 写真のアップロード
    - 初回のサインアップ完了直後に写真をカメラロールから1枚だけアップロードできるようにする
3. 1の直後に現在位置を取得して、DBに登録・更新
4. 現在位置に近いユーザを検索して一覧表示（ロケーション情報はNCMBのデータストアに登録済み）
    - 一覧に表示するのは、ユーザID、写真、緯度経度のみ

## 動作確認環境
- OS X EI Capitan 10.11.2 (15C50)
- Xcode Version 7.2 (7C68)
- iPhone 6s Plus

## 関連情報

- [Parse](https://www.parse.com/docs/ios/guide)
- [iOS Developers Guide | Parse](https://www.parse.com/docs/ios/guide)
- [ParsePlatform/Parse-SDK-iOS-OSX: Parse SDK for iOS/OS X](https://github.com/ParsePlatform/parse-sdk-ios-osx)
- [ParsePlatform/ParseUI-iOS: A collection of a handy user interface components to be used with the Parse iOS SDK.](https://github.com/ParsePlatform/ParseUI-iOS)
