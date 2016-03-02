//
//  CurrentPlatfome.swift
//
//  Created by Naoki Tsutsui on 3/3/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation


// platform-dependent import frameworks to get device details
// valid values for os(): OSX, iOS, watchOS, tvOS, Linux

#if os(iOS)
    private let PLATFORM = "iOS"
    import UIKit
#elseif os(OSX)
    private let PLATFORM = "OSX"
#elseif os(tvOS)
    private let PLATFORM = "tvOS"
#elseif os(Linux)
    private let PLATFORM = "Linux"
#else
    private let PLATFORM = ""
#endif
