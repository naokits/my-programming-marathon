# TouchIDDemo

Touch IDを使用した指紋認証のデモ

## 概要

- アプリを起動直後に指紋認証が可能かどうかをチェック
- 対応デバイスでない又は指紋が登録されていない場合
    - エラーの内容をアラートメッセージで表示
    - 指紋認証開始ボタンを無効化
- 指紋認証が可能な場合
    - 指紋認証開始ボタンを有効化
    - 指紋認証開始ボタンをタップ
        - 指紋認証による成功、失敗の結果をアラートメッセージで表示

## 動作確認環境
- OS X EI Capitan 10.11.1 (15B42)
- Xcode Version 7.2 (7C68)

### Touch IDに対応しているデバイスだが、指紋が登録されていない場合のエラー内容

```
Optional(Error Domain=com.apple.LocalAuthentication Code=-7 "No fingers are enrolled with Touch ID." UserInfo={NSLocalizedDescription=No fingers are enrolled with Touch ID.})
```
