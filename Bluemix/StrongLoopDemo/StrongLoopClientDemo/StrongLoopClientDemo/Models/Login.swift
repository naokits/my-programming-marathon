//
//  Login.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/14/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import APIKit

struct Login {
    var token: String?
    var ttl: Int?
    var created: String?
    var userId: Int?
    /*
     "id": "XsTaFzM5wpdSQmi7EIXe71gNvitPeoHRrA7HDTuFJMEe0yQ9pmi2KATIMjy7rry6",
     "ttl": 1209600,
     "created": "2016-05-14T02:01:41.270Z",
     "userId": 1
     */
    
    init?(dic: [String: AnyObject]) {
        guard let token = dic["id"] as? String else {
            return nil
        }
        guard let ttl = dic["ttl"] as? Int else {
            return nil
        }
        guard let created = dic["created"] as? String else {
            return nil
        }
        guard let userId = dic["userId"] as? Int else {
            return nil
        }
        
        self.token = token
        self.ttl = ttl
        self.created = created
        self.userId = userId
    }
}


protocol LoginRequestType: RequestType {
    
}

extension LoginRequestType {
    var baseURL: NSURL {
        return NSURL(string: demoBaseURL)!
    }
}


struct LoginRequest: LoginRequestType {
    typealias Response = Login
    
    var method: HTTPMethod {
        return .POST
    }
    
    var path: String {
        return "/api/DemoUsers/login"
    }

    var email: String = ""
    var password: String = ""

    var parameters: [String: AnyObject] {
        let body = [
            "email": self.email,
            "password": self.password,
            ]
        return body
    }
    
    init(email: String, password: String) {
        self.email = email
        self.password = password
    }
    
    func responseFromObject(object: AnyObject, URLResponse: NSHTTPURLResponse) -> Response? {
        guard let dictionary = object as? [String: AnyObject] else {
            return nil
        }
        
        guard let result = Login(dic: dictionary) else {
            return nil
        }

        return result
    }
}

struct LogoutRequest: LoginRequestType {
    typealias Response = Login
    
    var method: HTTPMethod {
        return .POST
    }
    
    var path: String {
        return "/api/DemoUsers/logout"
    }
    
    var accessToken: String = ""
    
    var parameters: [String: AnyObject] {
        return [
            "access_token":self.accessToken,
        ]
    }
    
    init(accessToken: String) {
        self.accessToken = accessToken
    }
    
    func responseFromObject(object: AnyObject, URLResponse: NSHTTPURLResponse) -> Response? {
        print(object)
        guard let dictionary = object as? [String: AnyObject] else {
            return nil
        }
        
        guard let result = Login(dic: dictionary) else {
            return nil
        }
        
        return result
    }
}
