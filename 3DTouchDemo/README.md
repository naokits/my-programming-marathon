# 3DTouchDemo

`3D Touch` を使用した `Home Screen Quick Actions` のデモ

## 概要[WIP]

- `static quick actions` と `dynamic quick actions` の両方を使用する。 `static quick actions` は２つ `dynamic quick actions` は３つの項目。
- ホームスクリーンからアプリアイコンをフォースタッチすることで、クイックアクションメニューが表示される。
- クイックアクションメニューから任意の項目を選択すると、アプリが起動し、その内容に応じてアラートメッセージを表示する。


## メモ

`static quick actions` を実装するために `Info.plist` に次の内容を追加する。

```xml
<key>UIApplicationShortcutItems</key>
<array>
  <dict>
    <key>UIApplicationShortcutItemIconFile</key>
    <string>Quick-Action-Menu</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>shortcutTitle1</string>
    <key>UIApplicationShortcutItemSubtitle</key>
    <string>shortcutSubtitle1</string>
    <key>UIApplicationShortcutItemType</key>
    <string>com.nkapp.3DTouchDemo.openfavorites</string>
    <key>UIApplicationShortcutItemUserInfo</key>
    <dict>
      <key>firstShorcutKey1</key>
      <string>value1</string>
    </dict>
  </dict>
  <dict>
    <key>UIApplicationShortcutItemIconType</key>
    <string>UIApplicationShortcutIconTypeCompose</string>
    <key>UIApplicationShortcutItemTitle</key>
    <string>shortcutTitle2</string>
    <key>UIApplicationShortcutItemType</key>
    <string>com.nkapp.3DTouchDemo.newmessage</string>
    <key>UIApplicationShortcutItemUserInfo</key>
    <dict>
      <key>firstShorcutKey1</key>
      <string>value2</string>
    </dict>
  </dict>
</array>
```

`UIApplicationShortcutItemIconFile` に指定しているカスタムアイコン画像 `Quick-Action-Menu` は別途用意してプロジェクトに追加する。
 PSDフォーマットのサンプルアイコンが [ここ](https://developer.apple.com/design/downloads/Quick-Action-Guides.zip) からダウンロードできる。



## 動作確認環境
- OS X EI Capitan 10.11.1 (15B42)
- Xcode Version 7.2 (7C68)
- iPhone 6s Plus

## 関連情報


- [3D Touch - iOS - Apple Developer](https://developer.apple.com/ios/3d-touch/)
- [Adopting 3D Touch on iPhone: Getting Started with 3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/)
- [iOS Human Interface Guidelines: 3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71)
- [ApplicationShortcuts: Using UIApplicationShortcutItem](https://developer.apple.com/library/ios/samplecode/ApplicationShortcuts/Introduction/Intro.html#//apple_ref/doc/uid/TP40016545)
- [UIApplicationShortcutIconType - UIApplicationShortcutIcon Class Reference](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationShortcutIcon_Class/index.html#//apple_ref/c/tdef/UIApplicationShortcutIconType)

## TODO

- 用語がややこしいので整理する
