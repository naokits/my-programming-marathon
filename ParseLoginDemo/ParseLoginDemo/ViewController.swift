//
//  ViewController.swift
//  ParseLoginDemo
//
//  Created by Naoki Tsutsui on 1/15/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import ParseUI

class ViewController: UIViewController, PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        
        guard let currentUser = User.currentUser() else {
            login()
            return
        }
        
        print("ログイン中のユーザ: \(currentUser)")

        currentUser.japaneseDate = NSDate()
        currentUser.saveInBackground()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    func signup() {
        let controller = PFSignUpViewController()
        controller.delegate = self
        self.presentViewController(controller, animated:false, completion: nil)
    }
    
    func login() {
        let controller = PFLogInViewController()
//        controller.logInView?.logo = UIImageView(image: UIImage(named: ""))
        controller.delegate = self
        self.presentViewController(controller, animated:true, completion: nil)
    }

    // MARK:- PFSignUpViewControllerDelegate

    func signUpViewController(signUpController: PFSignUpViewController, didFailToSignUpWithError error: NSError?) {
        guard let e = error else {
            return
        }
        print("サインアップエラー: \(e)")
    }
    
    func signUpViewController(signUpController: PFSignUpViewController, didSignUpUser user: PFUser) {
        print("サインアップ成功: \(user)")
        
    }
    
    func signUpViewController(signUpController: PFSignUpViewController, shouldBeginSignUp info: [String : String]) -> Bool {
        print("Info: \(info)")
        return true
    }
    
    func signUpViewControllerDidCancelSignUp(signUpController: PFSignUpViewController) {
        print("サインアップがキャンセルされた")
    }
    
    // MARK:- PFLogInViewControllerDelegate
    
    func logInViewController(logInController: PFLogInViewController, didFailToLogInWithError error: NSError?) {
        guard let e = error else {
            return
        }
        print("ログインエラー: \(e)")
    }
    
    func logInViewController(logInController: PFLogInViewController, didLogInUser user: PFUser) {
        print("ログイン成功: \(user)")
        
        dismissViewControllerAnimated(true, completion: nil)
    }
    
    func logInViewController(logInController: PFLogInViewController, shouldBeginLogInWithUsername username: String, password: String) -> Bool {
        print("Info: \(username)")
        return true
    }

    func logInViewControllerDidCancelLogIn(logInController: PFLogInViewController) {
        print("ログインがキャンセルされた")
    }
    
    // MARK:- Location

    func saveCurrentLocation() {
        let location = Location()
        location.japaneseDate = NSDate()
        location.geo = PFGeoPoint(latitude: 0.0, longitude: 0.0)
        location.saveInBackground().continueWithBlock { (task) -> AnyObject? in
            if let error = task.error {
                print("保存失敗: \(error)")
            } else {
                print("保存成功")
            }
            return nil
        }
    }
}

