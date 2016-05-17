//
//  Constants.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/14/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation

let demoBaseURL = "http://mbp2014.local:3000"

enum DemoAPIClientError: ErrorType {
    case Unknown
    case Network(String)
    case NotLogined(String)
    case NotFoundToken(String)
    case AlamoFireError(NSError)
    case HogeError(ErrorType)
}

