//
//  AppDelegate.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/12/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import APIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UISplitViewControllerDelegate {

    // MARK: - Properties

    var window: UIWindow?

    // MARK: - Application Lifecicle
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        
        self.setupSplitViewController()
        
        self.printPlistDir()
        self.printUserDefaults()
        
        return true
    }
    
    func applicationWillResignActive(application: UIApplication) {
    }

    func applicationDidEnterBackground(application: UIApplication) {
    }

    func applicationWillEnterForeground(application: UIApplication) {
    }

    func applicationDidBecomeActive(application: UIApplication) {
    }

    func applicationWillTerminate(application: UIApplication) {
    }
    
    // MARK: - Setup Split view

    func setupSplitViewController() {
        let splitViewController = self.window!.rootViewController as! UISplitViewController
        let navigationController = splitViewController.viewControllers[splitViewController.viewControllers.count-1] as! UINavigationController
        navigationController.topViewController!.navigationItem.leftBarButtonItem = splitViewController.displayModeButtonItem()
        splitViewController.delegate = self
    }

    // MARK: - Split view

    func splitViewController(splitViewController: UISplitViewController, collapseSecondaryViewController secondaryViewController:UIViewController, ontoPrimaryViewController primaryViewController:UIViewController) -> Bool {
        guard let secondaryAsNavController = secondaryViewController as? UINavigationController else { return false }
        guard let topAsDetailController = secondaryAsNavController.topViewController as? DetailViewController else { return false }
        if topAsDetailController.detailItem == 0 {
            // Return true to indicate that we have handled the collapse by doing nothing; the secondary controller will be discarded.
            return true
        }
        return false
    }

    // MARK: - Utility Methods
    
    /// プロパティリストの保存場所をコンソールに表示する
    func printPlistDir() {
        let dirs = NSSearchPathForDirectoriesInDomains(.LibraryDirectory, .UserDomainMask, true)
        let libraryDir = dirs[0]
        let preferencesDir = libraryDir + "/Preferences"
        print("plistのディレクトリ: \(preferencesDir)")
    }
    
    /**
     保存されているUserDefaultsの内容を表示する（アプリで追加した内容のみ）
     */
    func printUserDefaults() {
        let appDomain = NSBundle.mainBundle().bundleIdentifier
        let dic = NSUserDefaults.standardUserDefaults().persistentDomainForName(appDomain!)
        print("-----------------------------------------------------")
        print("All Keys: \(dic?.keys)")
        if dic?.keys != nil {
            for (key, value) in dic! {
                print("*** key: \(key) value: \(value)")
            }
        }
        print("-----------------------------------------------------")
    }
}
