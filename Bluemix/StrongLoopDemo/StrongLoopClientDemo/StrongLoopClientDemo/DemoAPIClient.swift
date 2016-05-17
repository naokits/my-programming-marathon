//
//  DemoAPIClient.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/12/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import APIKit
import Alamofire

public struct APIClient {
    // MARK: - APIKitを使用した例
    
//    typealias CompletionHandler = (DemoUser?, error: APIError?) -> Void
//    typealias CompletionHandlerWithError = (error: APIError?) -> Void
    
    static func createUser(email email: String, password: String, completionHandler: (DemoUser?, error: APIError?) -> Void) {
        let request = CreateUserRequest(email: email, password: password)
        Session.sendRequest(request) { (request) in
            switch request {
            case .Success(let user):
                completionHandler(user, error: nil)
                
            case .Failure(let error):
                print("error: \(error)")
                completionHandler(nil, error: error)
            }
        }
    }

    static func login(email email: String, password: String, completionHandler: (Login?, error: APIError?) -> Void) {
        let request = LoginRequest(email: email, password: password)
        Session.sendRequest(request) { (request) in
            switch request {
            case .Success(let login):
                let dic = [
                    "token": login.token!,
                    "userId": login.userId!,
                    "ttl": login.ttl!,
                    "created": login.created!
                ] as NSDictionary
                
//                self.saveCurrentUser(dic)
                self.saveLoginInfo(dic)


                completionHandler(login, error: nil)
                
            case .Failure(let error):
                print("error: \(error)")
                completionHandler(nil, error: error)
            }
        }
    }
    
    static func isLogin() -> Bool {
        guard let loginInfo = self.loadLoginInfo() else {
            return false
        }
        
        guard loginInfo["token"] != nil else {
            return false
        }
        return true
    }
    
    /**
     ログアウト
     /api/DemoUsers/logout
     
     - parameter completionHandlerWithError: ログアウト結果のクロージャ
     */
    static func logout(completionHandlerWithError: (result: Alamofire.Result<String, DemoAPIClientError>) -> Void) {
//    static func logout(completionHandlerWithError: (error: NSError?) -> Void) {
        
        guard let loginInfo = self.loadLoginInfo() else {
            completionHandlerWithError(result: .Failure(DemoAPIClientError.NotLogined("ログインしていません")))
            return 
        }
        
        guard let token = loginInfo["token2"] else {
//            completionHandlerWithError(result: .Failure(DemoAPIClientError.Unknown))
            let errorMessage = "トークンが未定義、または見つかりません"
            completionHandlerWithError(result: .Failure(DemoAPIClientError.NotFoundToken(errorMessage)))
            return
        }
        
        let headers = [
            "Accept":"application/json",
            "Content-Type":"application/json",
            ]
        
        let url = demoBaseURL + "/api/DemoUsers/logout?access_token=\(token)"
        
        Alamofire.request(.POST, url, headers: headers)
            .validate(statusCode: 200..<300)
            .responseJSON { response in
                if (response.result.error == nil) {
                    /*
                     成功時は、
                     Response Bodyは空（no content）
                     Response Codeは204が返される
                     */
                    // debugPrint("HTTP Response Body: \(response.result.value)")
//                    completionHandlerWithError(error: nil)
                    completionHandlerWithError(result: .Success("success"))
                } else {
                    // debugPrint("HTTP Request failed: \(response.result.error)")
//                    completionHandlerWithError(error: response.result.error)
                    completionHandlerWithError(result: .Failure(DemoAPIClientError.AlamoFireError(response.result.error!)))
//                    completionHandlerWithError(result: .Failure(DemoAPIClientError.HogeError(NSError)))

                }
        }
    }

    

    /**
     ユーザIDを指定してユーザ情報を取得します
     
     - parameter id: ユーザID
     - parameter completionHandler: 結果を返すクロージャ
     */
    static func fetchUserWithUserID(id: String, completionHandler: (DemoUser?, error: APIError?) -> Void) {
        let request = GetUserRequest(id: "1")
        Session.sendRequest(request) { result in
            switch result {
            case .Success(let user):
                completionHandler(user, error: nil)
                
            case .Failure(let error):
                print("error: \(error)")
                completionHandler(nil, error: error)
            }
        }
    }

    /**
     ユーザIDを指定してユーザのプロフィール情報を取得します
     
     - parameter id: ユーザID
     */
    static func fetchUserProfileWithUserID(id: String, completionHandler: (Profile?, error: APIError?) -> Void) {
        let request = GetUserProfileRequest(id: id)
        Session.sendRequest(request) { result in
            switch result {
            case .Success(let profile):
//                print("プロフィール：\(profile)")
                completionHandler(profile, error: nil)
                
            case .Failure(let error):
                print("error: \(error)")
                completionHandler(nil, error: error)
            }
        }
    }
    
    // MARK: - ユーザ情報とログイン情報の操作

    static private var currentUserPath: String? {
        guard let dir: NSString = NSSearchPathForDirectoriesInDomains(.ApplicationSupportDirectory, NSSearchPathDomainMask.AllDomainsMask, true ).first else {
            return nil
        }
        
        let file_name = "currentUser.plist"
        let path_file_name = dir.stringByAppendingPathComponent( file_name )
        return path_file_name
    }
    
    static func saveCurrentUser(dic: NSDictionary) {
        // /Library/Application Supportフォルダにファイルを保存
        let file_name = "currentUser.plist"
        let fileManager = NSFileManager.defaultManager()
        
        if let dir = NSSearchPathForDirectoriesInDomains( .ApplicationSupportDirectory, NSSearchPathDomainMask.AllDomainsMask, true ).first {
            
            if !fileManager.fileExistsAtPath(dir) {
                do {
                    try fileManager.createDirectoryAtPath(dir, withIntermediateDirectories: true, attributes: nil)
                } catch {
                    print("Error: \(error)")
                }
            }
            
            let path_file_name = dir.stringByAppendingString("/"+file_name)
            print("ログイン情報の保存先: \(path_file_name)")
            
            if dic.writeToFile(path_file_name, atomically: false) {
                print("ログイン情報の保存成功")
                
            } else {
                print("ログイン情報の保存失敗！")
            }
        }
    }

    static func loadCurrentUser() -> NSDictionary? {
        
        guard currentUserPath != nil else {
            return nil
        }
        
        guard let dic = NSDictionary(contentsOfFile: currentUserPath!) else {
            print("ユーザ情報の読み込み失敗")
            return nil
        }
        
        for (key, value) in dic {
            print("-- \(key)：\(value)")
        }
        return dic
    }
    
    /**
     ログイン情報の保存先パスを返します
     
     - returns: ログイン情報の保存先パス
     */
    static private func loginInfoPath() -> String? {
        let file_name = "login.plist"
        let fileManager = NSFileManager.defaultManager()
        
        if let dir = NSSearchPathForDirectoriesInDomains( .ApplicationSupportDirectory, NSSearchPathDomainMask.AllDomainsMask, true ).first {
            
            if !fileManager.fileExistsAtPath(dir) {
                do {
                    try fileManager.createDirectoryAtPath(dir, withIntermediateDirectories: true, attributes: nil)
                } catch {
                    print("Error: \(error)")
                    return nil
                }
            }
            
            let path_file_name = dir.stringByAppendingString("/"+file_name)
//            print("ログイン情報の保存先: \(path_file_name)")
            return path_file_name
        }
        return nil
    }

    /**
     /Library/Application Support/ フォルダにログイン情報を保存
     
     - parameter dic: ログイン情報
     */
    static func saveLoginInfo(dic: NSDictionary) {
        if let path_file_name = self.loginInfoPath() {
            if dic.writeToFile(path_file_name, atomically: true) {
                print("ログイン情報の保存成功")
                self.loadLoginInfo()
            } else {
                print("ログイン情報の保存失敗！")
            }
        }
    }

    /**
     保存されているログイン情報を取得します
     
     - returns: ログイン情報
     */
    static func loadLoginInfo() -> NSDictionary? {
        if let path_file_name = self.loginInfoPath() {
            guard let dic = NSDictionary(contentsOfFile: path_file_name) else {
                print("ログイン情報の読み込み失敗")
                return nil
            }

            print("取得したログイン情報")
            for (key, value) in dic {
                print("-- \(key)：\(value)")
            }
            return dic
        }
        
        return nil
    }


    
    // MARK: - Alamofireを使用した例

    /**
     DemoUser POST
     POST http://localhost:3000/api/DemoUsers
     */
    func createUserRequest() {
        
        let headers = [
            "Accept":"application/json",
            "Content-Type":"application/json",
            ]
        
        let body = [
            "status": "string",
            "lastUpdated": "2016-05-10",
            "credentials": [],
            "password": "hogehoge",
            "birthday": "2016-05-10",
            "emailVerified": true,
            "username": "naokits",
            "created": "2016-05-10",
            "realm": "string",
            "challenges": [],
            "email": "naokits@nkapp.com"
        ]
        
        // Fetch Request
        Alamofire.request(.POST, "http://mbp2014.local:3000/api/DemoUsers", headers: headers, parameters: body, encoding: .JSON)
            .validate(statusCode: 200..<300)
            .responseJSON { response in
                if (response.result.error == nil) {
                    debugPrint("HTTP Response Body: \(response.data)")
                }
                else {
                    debugPrint("HTTP Request failed: \(response.result.error)")
                }
        }
    }
    
    
    /**
     DemoServer
     GET http://localhost:3000/api/DemoUsers
     */
    static func fetchUsersRequest() {
        
        let headers = [
            "Accept":"application/json",
            ]
        
        let urlParams = [
            "access_token":"rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk,rC5KmF3FZjUli9DwXYB6C4TSeojs9pV516pbfX1CscUjDnNte2Gb1po8m9EAwvPk",
            ]
        
        // Fetch Request
        Alamofire.request(.GET, "http://mbp2014.local:3000/api/DemoUsers", headers: headers, parameters: urlParams)
            .validate(statusCode: 200..<300)
            .responseJSON { response in
                if (response.result.error == nil) {
                    debugPrint("HTTP Response Body: \(response.result.value)")
                }
                else {
                    debugPrint("HTTP Request failed: \(response.result.error)")
                }
        }
    }
}

