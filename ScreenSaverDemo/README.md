# ScreenSaverDemo

OS Xのスクリーンセーバーのデモ

## 概要[WIP]

スクリーンセーバーの動作

- インターネットに接続している場合
    - 指定されたURLの内容を、指定された時間表示する
    - URLはコード埋め込みか、 `ScreenSaver Options` で指定できるようにする
    - 表示時間は固定で120秒、できれば `ScreenSaver Options` で指定できるようにしたい
- インターネットに接続していない場合
    - 組み込みのHTMLの内容を表示する

## 動作確認環境
- OS X EI Capitan 10.11.2 (15B42)
- Xcode Version 7.2 (7C68)
- MacBook Pro 15' 2014

## 関連情報

- [Screen Saver Framework Reference](https://developer.apple.com/library/mac/documentation/UserExperience/Reference/ScreenSaver/ObjC_classic/index.html#//apple_ref/doc/uid/20001822)
- [ScreenSaver Changes for Swift](https://developer.apple.com/library/prerelease/mac/releasenotes/General/APIDiffsMacOSX10_11/Swift/ScreenSaver.html)
- [Screen Savers - Part 1 - NSScreencast](http://nsscreencast.com/episodes/182-screen-savers-part-1)
- [Screen Savers Part 2 - NSScreencast](http://nsscreencast.com/episodes/183-screen-savers-part-2)
- [Mac OSXスクリーンセーバーをSwiftで作成する - Qiita](http://qiita.com/kaneshin/items/cab5132517f6902824e3)

## 注意事項

> import Foundation

が含まれていると、

> You cannot use the screensaver with this version of OS X.
> Please contact the vendor to get a newer version of the screen saver.

とビルドしたスクリーンセーバーに表示されてしまうので注意する。

上記のメッセージが表示される場合は、 `info.plist` の `Principal class` の値（クラス名）が正しいか、
`Build Settings` の `EMBEDDED CONTENT CONTAINS SWIFT` が `YES` になっているかを確認する。



## その他

- とりあえずObjective-Cで記述するが、できればSwiftに変更する
- デバッグができないか調査する
