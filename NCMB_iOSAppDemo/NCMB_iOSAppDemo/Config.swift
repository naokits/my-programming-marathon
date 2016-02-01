//
//  Config.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 1/30/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation

/**
    アプリケーションキー及び、クライアントキーはご自身のものをご利用ください。
*/

// アプリケーションキー）
let applicationKey = "c951b57a31dafc86f076fa9f1baea6e9859bc1dd7f740c77799c051617e7b020"
// クライアントキー
let clientKey = "16a39a0a6515afff7ecff9acd16482804ecba67ca36801fe1d49bd737694fd5e"


func setupBaaS() {
    // NCMBSubclassingに準拠しているクラスのセットアップ
    User.registerSubclass()
    Location.registerSubclass()

    // NCMBのセットアップ
    NCMB.setApplicationKey(applicationKey, clientKey: clientKey)
}
