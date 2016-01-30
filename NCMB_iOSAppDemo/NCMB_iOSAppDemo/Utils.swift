//
//  Utils.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 1/30/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

func openSettingApp(application: UIApplication) {
    // プッシュ通知が許可されていない場合は設定画面を開く
    let url = NSURL(string: UIApplicationOpenSettingsURLString)!
    UIApplication.sharedApplication().openURL(url)
}

// 現在、許可しているかどうかこれでチェック
//func isEnabled() -> Bool {
//    return (UIApplication.sharedApplication().currentUserNotificationSettings()!.types & UIUserNotificationType.Alert) != nil
//}
