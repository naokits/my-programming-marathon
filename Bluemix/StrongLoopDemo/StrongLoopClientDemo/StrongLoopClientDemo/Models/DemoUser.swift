//
//  DemoUser.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/14/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import APIKit

/**
 *  ユーザモデル
 */
struct DemoUser {
//    var currentUser: DemoUser?
    var username: String?
    var email: String?
    var password: String?
    var token: String?
    
    init?(dic: [String: AnyObject]) {
        guard let username = dic["username"] as? String else {
            return nil
        }
        guard let email = dic["email"] as? String else {
            return nil
        }
        
        self.username = username
        self.email = email
    }
    
    
    
    
}

protocol DemoUserRequestType: RequestType {
    
}

extension DemoUserRequestType {
    var baseURL: NSURL {
        return NSURL(string: demoBaseURL)!
    }
    
    var accessToken: [String: String] {
        return [
            "access_token":"rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk,rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk"
        ]
    }
}

// MARK: - API

struct CreateUserRequest: DemoUserRequestType {
    typealias Response = DemoUser
    
    var method: HTTPMethod {
        return .POST
    }
    
    var path: String {
        return "/api/DemoUsers"
    }
    
    var HTTPHeaderFields: [String : String] {
        let headers = [
            "Accept":"application/json",
            "Content-Type":"application/json",
            ]
        return headers
    }

    var email: String = ""
    var password: String = ""
    
    var parameters: [String: AnyObject] {
        return [
            "status": "create",
            "credentials": [],
            "email": self.email,
            "password": self.password,
            "emailVerified": false,
            "username": "",
            "realm": "",
            "challenges": [],
        ]
    }
    
    init(email: String, password: String) {
        self.email = email
        self.password = password
    }

    
    func responseFromObject(object: AnyObject, URLResponse: NSHTTPURLResponse) -> Response? {
        guard let dictionary = object as? [String: AnyObject] else {
            return nil
        }
        
        guard let result = DemoUser(dic: dictionary) else {
            return nil
        }
        
        print("結果: \(result)")
        return result
    }

}

struct GetUserRequest: DemoUserRequestType {
    typealias Response = DemoUser
    
    var method: HTTPMethod {
        return .GET
    }
    
    var id: String = "0"
    
    var path: String {
        return "/api/DemoUsers/\(self.id)"
    }
    
    var parameters: [String: AnyObject] {
        return [
            "access_token":"rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk,rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk"        ]
    }
    
    // MARK: - Initialize
    
    init(id: String) {
        self.id = id
    }

    // MARK: - Functions

    func responseFromObject(object: AnyObject, URLResponse: NSHTTPURLResponse) -> Response? {
        guard let dictionary = object as? [String: AnyObject] else {
            return nil
        }
        
        guard let user = DemoUser(dic: dictionary) else {
            return nil
        }
        
        print("結果: \(user)")
        return user
    }
}



