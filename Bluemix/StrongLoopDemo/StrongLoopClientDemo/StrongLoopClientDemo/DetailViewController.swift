//
//  DetailViewController.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/12/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
//import Result

class DetailViewController: UIViewController {

    @IBOutlet weak var detailDescriptionLabel: UILabel!


    var detailItem: Int = 0 {
        didSet {
            // Update the view.
            self.configureView()
        }
    }

    func configureView() {
        // Update the user interface for the detail item.
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.configureView()
        
        switch self.detailItem {
        case 0:
            self.detailDescriptionLabel.text = "ユーザ登録"
            self.signup()
        case 1:
            self.detailDescriptionLabel.text = "ログイン"
            self.login()
        case 2:
            self.detailDescriptionLabel.text = "ログアウト"
            self.logout()
        case 3:
            self.detailDescriptionLabel.text = "ユーザ情報取得"
            self.fetchUsers()
        case 4:
            self.detailDescriptionLabel.text = "プロフィール情報取得"
            self.fetchUser()
        default:
            self.detailDescriptionLabel.text = "その他"
        }

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Functions
    
    func signup() {
        APIClient.createUser(email: "user2@me.com", password: "hogehoge") { (user, error) in
            if let e = error {
                print("ユーザ登録エラー: \(e)")
                return
            }
            print("ユーザ登録結果: \(user)")
        }
    }

    func login() {
        debugPrint("ログインを開始します。")
        APIClient.login(email: "user1@me.com", password: "hogehoge") { (result, error) in
            if let e = error {
                print("ログインエラー: \(e)")
                return
            }
            print("ログイン結果: \(result)")
        }
    }
    
    func logout() {
//        print("読み込み結果： \(APIClient.loadCurrentUser())")
        APIClient.logout { (result) in
            switch result {
            case .Success(let value):
                print(value)
            case .Failure(DemoAPIClientError.NotLogined(let errorMessage)):
                print(errorMessage)
            case .Failure(DemoAPIClientError.NotFoundToken(let errorMessage)):
                print(errorMessage)
            case .Failure(DemoAPIClientError.AlamoFireError(let error)):
                print(error)
            default:
                print("対象がない")
            }
        }
        
        
        
//        APIClient.logout { (error) in
//            if let e = error {
//                print("ログアウト失敗: \(e)")
//                return
//            }
//            print("ログアウト成功")
//        }
    }

    func fetchUser() {
        APIClient.fetchUserWithUserID("1") { (user, error) in
            if let e = error {
                print("ユーザ情報取得エラー: \(e)")
                return
            }
            print("ユーザ情報取得結果: \(user)")
        }
    }

    func fetchUserProfile() {
        APIClient.fetchUserProfileWithUserID("1") { (profile, error) in
            if let e = error {
                print("プロフィール取得エラー: \(e)")
                return
            }
            print("プロフィール情報取得結果: \(profile)")
        }
    }
    
    // MARK: - Alamofire版
    
    func fetchUsers() {
        APIClient.fetchUsersRequest()
    }
}

