//
//  User.swift
//  ParseLoginDemo
//
//  Created by Naoki Tsutsui on 1/17/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Parse

public class User: PFUser {
    @NSManaged var currentLocation: PFGeoPoint
    @NSManaged var japaneseDate: NSDate
    
//    var japaneseDate: NSDate! {
//        get {
//            return objectForKey("japaneseDate") as! NSDate
//        }
//        set {
//            setObject(newValue, forKey: "japaneseDate")
//        }
//    }

    /// ニックネーム
    var nickname: NSString! {
        get {
            return objectForKey("nickname") as! NSString
        }
        set {
            setObject(newValue, forKey: "nickname")
        }
    }

    // MARK: - Initialize
    
    override init() {
        super.init()
        japaneseDate = NSDate()
    }
    
    // MARK: - PFSubclassing
    
//    override public class func initialize() {
//        struct Static {
//            static var onceToken: dispatch_once_t = 0
//        }
//        dispatch_once(&Static.onceToken) {
//            self.registerSubclass()
//        }
//    }
//    
//    public override static func parseClassName() -> String {
//        return "User"
//    }
}
