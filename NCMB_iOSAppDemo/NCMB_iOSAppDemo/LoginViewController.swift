//
//  LoginViewController.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 2/11/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import NCMB

class LoginViewController: UIViewController {
    
    @IBOutlet weak var userNameTextField: UITextField!
    @IBOutlet weak var mailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    // ------------------------------------------------------------------------
    // MARK: - Lifecycle
    // ------------------------------------------------------------------------
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // ------------------------------------------------------------------------
    // MARK: - Navigation
    // ------------------------------------------------------------------------
    
    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    
    // ------------------------------------------------------------------------
    // MARK: - Login or Signup
    // ------------------------------------------------------------------------
    
    /// ログイン or 新規登録が成功した場合の処理
    ///
    /// - parameter user: NCMBUserインスタンス
    /// - returns: None
    func successLoginOrSignupForUser(user: NCMBUser) {
        print("会員登録後の処理")
        // ACLを本人のみに設定
        let acl = NCMBACL(user: NCMBUser.currentUser())
        user.ACL = acl
        user.saveInBackgroundWithBlock({ (error: NSError!) -> Void in
            if error == nil {
                self.dismissViewControllerAnimated(true, completion: nil)
            } else {
                print("ACL設定の保存失敗: \(error)")
            }
        })
    }
    
    // ------------------------------------------------------------------------
    // MARK: - Login or Signup
    // ------------------------------------------------------------------------
    
    /// 未登録なのか、登録済みなのかを判断する方法がなさそう？なので、ログインを実行してみて、エラーなら新規登録を行います。
    ///
    /// - parameter username: ログイン時に指定するユーザ名
    /// - parameter email: ログイン時に指定するメールアドレス
    /// - parameter password: ログイン時に指定するパスワード
    /// - returns: None
    ///
    func loginWithUserName(username: String, password: String, mailaddress: String) {
        User.logInWithUsernameInBackground(username, password: password) { user, error in
            if let e = error {
                print("ログインが失敗したので、サインアップします: \(e)")
                self.signupWithUserName(username, password: password, mailaddress: mailaddress)
            } else {
                self.successLoginOrSignupForUser(user)
            }
        }
    }
    
    /// ユーザの新規登録を行います。
    ///
    /// - parameter username: ログイン時に指定するユーザ名
    /// - parameter email: ログイン時に指定するメールアドレス
    /// - parameter password: ログイン時に指定するパスワード
    /// - returns: None
    ///
    func signupWithUserName(username: String, password: String, mailaddress: String) {
        let u = User()
        u.userName = username
        u.password = password
        u.mailAddress = mailaddress
        
        u.signUpInBackgroundWithBlock { error in
            if let e = error {
                print("サインアップ失敗: \(e)")
                return
            }
            print("サインアップ成功")
            self.successLoginOrSignupForUser(u)
        }
    }
    
    // ------------------------------------------------------------------------
    // MARK: - Action
    // ------------------------------------------------------------------------
    
    /// ログインボタンをタップした時に実行されます。
    @IBAction func tappedLoginButton(sender: AnyObject) {
        let userName = self.userNameTextField.text
        let mail = self.mailTextField.text
        let password = self.passwordTextField.text
        
        self.loginWithUserName(userName!, password: password!, mailaddress: mail!)
    }
}
