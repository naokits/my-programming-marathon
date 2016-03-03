//
//  ViewController.swift
//  SendSMSDemo
//
//  Created by Naoki Tsutsui on 3/3/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import MessageUI

class ViewController: UIViewController, MFMessageComposeViewControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        sendMessageWithSMS()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func sendMessageWithSMS() {
        let messageController = MFMessageComposeViewController()
        messageController.messageComposeDelegate = self

        /* 今回は使用しない
        // 添付ファイル
        let image = UIImage(contentsOfFile: "hoge.png")
        let imageData = UIImagePNGRepresentation(image!)
        
        messageController.addAttachmentData(imageData!, typeIdentifier: "public.image", filename: "attachment_image.png")
        */
        
        // 本文
        messageController.body = "sample text: サンプルテキスト"
        
        self.presentViewController(messageController, animated: true, completion: nil)
    }
    
    func messageComposeViewController(controller: MFMessageComposeViewController, didFinishWithResult result: MessageComposeResult) {
        debugPrint("SMS送信終了: \(result)")

        controller.dismissViewControllerAnimated(true, completion: nil)
    }
    
    
}

