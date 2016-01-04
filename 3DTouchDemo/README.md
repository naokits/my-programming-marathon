# 3DTouchDemo

`3D Touch` を使用した指紋認証のデモ

`static quick actions` と `dynamic quick actions` の共存ができなければ、それぞれ用のプロジェクトを作ることにする。

## 概要[WIP]

- ホームスクリーンからアプリアイコンをフォースタッチすることで、クイックアクションメニューが表示される。
- クイックアクションメニューから任意の項目を選択すると、その内容に応じてアラートメッセージを表示する。

スタティックアクションを実装するために `Info.plist` に次の内容を追加する。
`UIApplicationShortcutItemIconFile` に指定しているアイコン画像 `open-favorites` は別途用意してプロジェクトに追加する。
アイコン画像のサイズが現時点でわからないので、調べておく。

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemIconFile</key>
    <string>open-favorites</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>ショートカットタイトル1</string>
    <key>UIApplicationShortcutItemType</key>
    <string>com.nkapp.3DTouchDemo.shortcutTitle1</string>
    <key>UIApplicationShortcutItemUserInfo</key>
    <dict>
      <key>key1</key>
      <string>value1</string>
    </dict>
  </dict>
  <dict>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeCompose</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>ショートカットタイトル2</string>
    <key>UIApplicationShortcutItemType</key>
    <string>com.nkapp.3DTouchDemo.shortcutTitle2</string>
    <key>UIApplicationShortcutItemUserInfo</key>
    <dict>
      <key>key2</key>
      <string>value2</string>
    </dict>
  </dict>
</array>
```



## 動作確認環境
- OS X EI Capitan 10.11.1 (15B42)
- Xcode Version 7.2 (7C68)
- iPhone 6s Plus

## 関連情報

- [3D Touch - iOS - Apple Developer](https://developer.apple.com/ios/3d-touch/)
- [Adopting 3D Touch on iPhone: Getting Started with 3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/)
- [iOS Human Interface Guidelines: 3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71)
- [ApplicationShortcuts: Using UIApplicationShortcutItem](https://developer.apple.com/library/ios/samplecode/ApplicationShortcuts/Introduction/Intro.html#//apple_ref/doc/uid/TP40016545)
