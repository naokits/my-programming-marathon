//
//  TodoItem.swift
//  helloTodo-swift
//
//  Created by Naoki Tsutsui on 3/9/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

class TodoItem: NSObject {
    
    var text: NSString?
    var idNumber: NSNumber?
    var isDone: Bool

    override init() {
        text = ""
        idNumber = 0
        isDone = false
    }
}
