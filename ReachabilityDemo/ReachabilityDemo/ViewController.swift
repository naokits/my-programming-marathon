//
//  ViewController.swift
//  ReachabilityDemo
//
//  Created by Naoki Tsutsui on 1/12/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import ReachabilitySwift

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        setupNotification()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Setup
    
    /// 通知のセットアップ
    func setupNotification() {
        
        guard let reachability = reachability else {
            print("Reachabilty is not available.")
            return
        }

        NSNotificationCenter.defaultCenter().addObserver(self,
            selector: "reachabilityChanged:",
            name: ReachabilityChangedNotification,
            object: reachability)

        do {
            try reachability.startNotifier()
        } catch {
            print("Unable start Notifier")
        }
    }
    
    // MARK: - Notification Selector

    func reachabilityChanged(note: NSNotification) {
        
        let reachability = note.object as! Reachability
        
        if reachability.isReachable() {
            if reachability.isReachableViaWiFi() {
                print("Reachable via WiFi")
            } else {
                print("Reachable via Cellular")
            }
        } else {
            print("Not reachable")
        }
    }
}

