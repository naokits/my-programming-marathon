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
    
    // MARK: - Initialize
    
    override init() {
        super.init()
    }
    
    // MARK: - PFSubclassing
    
    override public class func initialize() {
        struct Static {
            static var onceToken: dispatch_once_t = 0
        }
        dispatch_once(&Static.onceToken) {
            self.registerSubclass()
        }
    }
    
    public override static func parseClassName() -> String {
        return "User"
    }
}
