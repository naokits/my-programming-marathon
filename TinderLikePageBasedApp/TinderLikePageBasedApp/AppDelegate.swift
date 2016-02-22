//
//  AppDelegate.swift
//  TinderLikePageBasedApp
//
//  Created by Naoki Tsutsui on 2/14/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    // MARK: - Properties

    var window: UIWindow?

    // MARK: - Application Cycle

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        
        setupTinderLikePageBasedViewController()
        
        return true
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    // MARK: - Setup ViewController with Navigation

    func setupTinderLikePageBasedViewController() {
        
        self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        let v1 = UIViewController()
        v1.view.backgroundColor = UIColor.purpleColor()
        let v2 = UIViewController()
        v2.view.backgroundColor = UIColor.redColor()
        
        let name = "Main"
        let identifier = "MainViewController"
        let storyboard = UIStoryboard(name: name, bundle: nil)
        let v3 = storyboard.instantiateViewControllerWithIdentifier(identifier) as! MainViewController
        
        let v4 = UIViewController()
        v4.view.backgroundColor = UIColor.orangeColor()
        let v5 = UIViewController()
        v5.view.backgroundColor = UIColor.yellowColor()

        // navigation bar (icons and strings)
        let controllers = [v1,v2,v3,v4,v5]
//        let iconAndTitles = NSArray(array: [UIImage(named:"photo")!, UIImage(named:"heart")!, UIImage(named:"conf")!, UIImage(named:"message")!, UIImage(named:"map")!])
        // 中央のナビゲーションタイトルのみ文字列指定
        let iconAndTitles = NSArray(array: [UIImage(named:"photo")!, UIImage(named:"heart")!, "設定", UIImage(named:"message")!, UIImage(named:"map")!])
        let controller = AHPagingMenuViewController(controllers: controllers, icons: iconAndTitles, position:2)

        controller.setShowArrow(false)
        controller.setTransformScale(true)
        controller.setDissectColor(UIColor(white: 0.756, alpha: 1.0));
        controller.setSelectColor(UIColor(red: 0.963, green: 0.266, blue: 0.176, alpha: 1.000))
        
        self.window = UIWindow(frame: UIScreen.mainScreen().bounds)
        self.window!.rootViewController = controller
        self.window!.makeKeyAndVisible()
    }
}

