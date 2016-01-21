//
//  Config.swift
//  ParseLoginDemo
//
//  Created by Naoki Tsutsui on 1/16/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation
import Parse

let applicationId = "TBUADAW0Ifu3YqJoFC11afI70NTxTgwY6fquFukz"
let clientKey = "zTmk7T3EZEclVhR65ju8I8eRx4AbEh7K1uWA2Xxw"

func setupParse() {
    Parse.setApplicationId(applicationId, clientKey: clientKey)
}
