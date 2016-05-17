//
//  Profile.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/14/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation
import APIKit

// MARK: - Model

struct Profile {
    var sex: Int
    var currentPosition: [String: Int]

    init?(dic: [String: AnyObject]) {
        guard let sex = dic["sex"] as? Int else {
            return nil
        }
        guard let currentPosition = dic["currentPosition"] as? [String: Int] else {
            return nil
        }
        
        self.sex = sex
        self.currentPosition = currentPosition
    }
}

// MARK: - Protocol

protocol UserProfileRequestType: RequestType {
//    var authenticate: Bool { get }
}

extension UserProfileRequestType {
    var baseURL: NSURL {
        return NSURL(string: "http://mbp2014.local:3000")!
    }
    
    var accessToken: [String: String] {
        return [
            "access_token":"rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk,rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk"
        ]
    }
    
//    func configureURLRequest(URLRequest: NSMutableURLRequest) throws -> NSMutableURLRequest {
//        
//    }
}

// MARK: - Request

struct GetUserProfileRequest: UserProfileRequestType {
    // MARK: - typealias
    
    typealias Response = Profile

    // MARK: - Properties

    var method: HTTPMethod {
        return .GET
    }
    
    var id: String = "0"
    
    var path: String {
        return "/api/DemoUsers/\(self.id)/Profile"
    }
    
    var HTTPHeaderFields: [String : String] {
        let headers = [
            "Accept":"application/json",
            "Content-Type":"application/json",
            ]
        return headers
    }
    
    var parameters: [String: AnyObject] {
        let params = accessToken
        return params
    }
    
    // MARK: - Initialize

    init(id: String) {
        self.id = id
    }
    
    // MARK: - Functions

    func responseFromObject(object: AnyObject, URLResponse: NSHTTPURLResponse) -> Response? {
        guard let dic = object as? [String: AnyObject] else {
            return nil
        }
        
        guard let profile = Profile(dic: dic) else {
            return nil
        }

        return profile
    }
}
