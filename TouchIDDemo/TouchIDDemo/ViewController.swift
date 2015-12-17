//
//  ViewController.swift
//  TouchIDDemo
//
//  Created by Naoki Tsutsui on 12/17/15.
//  Copyright © 2015 Naoki Tsutsui. All rights reserved.
//

import UIKit
import LocalAuthentication

class ViewController: UIViewController {
    let evaluationType = LAPolicy.DeviceOwnerAuthenticationWithBiometrics

    @IBOutlet weak var evaluationButton: UIButton!

    @IBAction func tappedEvaluationButton(sender: AnyObject) {
        authenticate()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        
        if !evaluatableDevice() {
            // 検証ボタンを無効にする
            evaluationButton.enabled = false
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func evaluatableDevice() -> Bool {
        let context = LAContext()
        var error: NSError?
        
        // Touch IDが利用可能かチェックする
        if !context.canEvaluatePolicy(evaluationType, error: &error) {
            // Touch IDが利用できない場合
            self.showMessage("Touch ID未対応または指紋が登録されていません: \(error)")
            return false
        }

        return true
    }
    
    func authenticate() {
        let context = LAContext()

        let localizedString = NSLocalizedString("指紋認証を行います", comment: "reason")
        context.evaluatePolicy(evaluationType, localizedReason: localizedString) { (result, error) -> Void in
            if result {
                self.showMessage("認証成功")
            } else {
                self.showMessage("Error: \(error)")
                return
            }
        }
    }
    
    func showMessage(message: String!) {
        let title = "認証結果"
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        
        let defaultAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
        alertController.addAction(defaultAction)
        
        presentViewController(alertController, animated: true, completion: nil)
    }
}
