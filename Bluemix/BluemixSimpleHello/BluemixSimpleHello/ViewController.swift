//
//  ViewController.swift
//  BluemixSimpleHello
//
//  Created by Naoki Tsutsui on 3/27/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        bluemixConnection()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
    func bluemixConnection() {
        
        //Testing the connection to Bluemix by sending a Get request to a protected resource in the Node.js application. This Node.js code was provided in the MobileFirst Services Starter boilerplate. The below request uses the applicationRoute that was provided when initializing the IMFClient in the AppDelegate.
        
        let imfClient = IMFClient.sharedInstance()
        let request = IMFResourceRequest(path: imfClient.backendRoute)
        request.setHTTPMethod("GET")
        request.sendWithCompletionHandler { (response, error ) -> Void in
            if error != nil {
                NSLog("Error: %@",error);
                if (!error.localizedDescription.isEmpty){
                    let errorMsg =  error.localizedDescription + " Please verify the ApplicationRoute and ApplicationID"
                    NSLog("%@", errorMsg)
                } else {
                    NSLog("Please verify the ApplicationRoute and ApplicationID")
                }
            } else {
                NSLog("You have connected to Bluemix successfully")
                NSLog("レスポンス: %@", response)
            }
        }
        
    }
}

