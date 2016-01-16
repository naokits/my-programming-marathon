//
//  Location
//  ParseLoginDemo
//
//  Created by Naoki Tsutsui on 1/16/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

//import Foundation
import Parse

public class Location: PFObject, PFSubclassing {
    @NSManaged var japaneseDate: NSDate
    @NSManaged var lat: Double
    @NSManaged var lng: Double
    @NSManaged var geo: PFGeoPoint

    // MARK: - Initialize

//    override init() {
//        super.init()
//    }
    
    // MARK: - PFSubclassing
    
    override public class func initialize() {
        struct Static {
            static var onceToken: dispatch_once_t = 0
        }
        dispatch_once(&Static.onceToken) {
            self.registerSubclass()
        }
    }
    
    public static func parseClassName() -> String {
        return "Location"
    }
}
