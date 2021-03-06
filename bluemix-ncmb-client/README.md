# bluemix-ncmb-client

## [WIP] 概要

BrewmixのNode.js（StrongLoop）経由で、NCMBのAPIにアクセスする。NCMBへのアクセスは `NCMB JavaScript SDK` を使用して行います。

- まずは、イントロダクションの `Node.jsでの動作確認` セクションに書かれたサンプルコードをほぼそのまま使用して動作を確認します。具体的には、ダッシュボードのデータストアにサンプルデータが登録されていればOK。
- ロケーション情報を登録するAPIをBlueix側に作成します。
- 検索開始位置と距離（半径）を指定して、登録した位置情報から検索します。

## 動作確認環境

- OS X EI Capitan 10.11.3
- Xcode Version 7.2.1 (7C1002)
- rbenv 1.0.0
- ruby 2.3.0p0 (2015-12-25 revision 53290) [x86_64-darwin15]
- CocoaPods -v 1.0.0.beta.4
- Safari Version 9.0.3 (11601.4.4)
- Google Chrome Version 48.0.2564.116 (64-bit)
- npm 3.6.0
- node v5.3.0
- nodebrew 0.9.3

## 関連情報

- [IBM Bluemix - Next-Generation Cloud App Development Platform](https://console.ng.bluemix.net/)
- [mBaaSでサーバー開発不要！ | ニフティクラウド mobile backend](http://mb.cloud.nifty.com/)
- [イントロダクション (JavaScript) : クイックスタート | ニフティクラウド mobile backend](http://mb.cloud.nifty.com/doc/current/introduction/quickstart_javascript.html)
- [NIFTYCloud-mbaas/ncmb_js](https://github.com/NIFTYCloud-mbaas/ncmb_js)
