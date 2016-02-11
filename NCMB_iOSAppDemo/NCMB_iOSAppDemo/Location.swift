//
//  Location.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 1/30/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import NCMB

@objc(Location)
public class Location: NCMBObject, NCMBSubclassing {

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
    
    
    /// 場所の名前
    var name: String! {
        get {
            return objectForKey("name") as! String
        }
        set {
            setObject(newValue, forKey: "name")
        }
    }

    // ------------------------------------------------------------------------
    // MARK: - NCMBSubclassing Protocol
    // ------------------------------------------------------------------------
    
    /// mobile backend上のクラス名を返却する。
    ///
    /// :returns: サブクラスのデータストア上でのクラス名
    public static func ncmbClassName() -> String! {
        return "Location"
    }
}
