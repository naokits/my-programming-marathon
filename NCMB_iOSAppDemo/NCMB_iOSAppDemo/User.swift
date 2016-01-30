//
//  User.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 1/30/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation

//@objc(User) // <-- 以前はこの宣言をしないと、ハングアップしていた

class User: NCMBUser, NCMBSubclassing {
    
    // MARK: - Properties
    
    var age: Int {
        get {
            return objectForKey("age") as! Int
        }
        set {
            setObject(newValue, forKey: "age")
        }
    }
    
    var latitude: Double {
        get {
            return objectForKey("latitude") as! Double
        }
        set {
            setObject(newValue, forKey: "latitude")
        }
    }

    var longitude: Double {
        get {
            return objectForKey("longitude") as! Double
        }
        set {
            setObject(newValue, forKey: "longitude")
        }
    }
    
    var geoPoint: NCMBGeoPoint {
        get {
            return objectForKey("geoPoint") as! NCMBGeoPoint
        }
        set {
            setObject(newValue, forKey: "geoPoint")
        }
    }
    

    /// タイトル
    var title: String! {
        get {
            return objectForKey("title") as! String
        }
        set {
            setObject(newValue, forKey: "title")
        }
    }
    
    // ------------------------------------------------------------------------
    // MARK: - NCMBSubclassing Protocol
    // ------------------------------------------------------------------------
    
    /// mobile backend上のクラス名を返却する。
    ///
    /// :returns: サブクラスのデータストア上でのクラス名
    static func ncmbClassName() -> String! {
        return "User"
    }
}
