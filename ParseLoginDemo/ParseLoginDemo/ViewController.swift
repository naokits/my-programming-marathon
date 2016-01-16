//
//  ViewController.swift
//  ParseLoginDemo
//
//  Created by Naoki Tsutsui on 1/15/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import Parse
import ParseUI

class ViewController: UIViewController, PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        signup()
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
        //
    }
    
    func logInViewController(logInController: PFLogInViewController, didLogInUser user: PFUser) {
        //
    }
    
    func logInViewController(logInController: PFLogInViewController, shouldBeginLogInWithUsername username: String, password: String) -> Bool {
        return true
    }

    func logInViewControllerDidCancelLogIn(logInController: PFLogInViewController) {
        //
    }
}

