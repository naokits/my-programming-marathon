//
//  AppDelegate.swift
//  3DTouchDemo
//
//  Created by Naoki Tsutsui on 12/18/15.
//  Copyright © 2015 Naoki Tsutsui. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UISplitViewControllerDelegate {

    // MARK: - Types
    
    enum ShortcutIdentifier: String {
        case First
        case Second
        case Third
        case Fourth
        
        init?(fullType: String) {
            guard let last = fullType.componentsSeparatedByString(".").last else {
                print("該当なし")
                return nil
            }
            print("ほげ: \(fullType)")
            
            self.init(rawValue: last)
        }
        
        
        var type: String {
            return NSBundle.mainBundle().bundleIdentifier! + ".\(self.rawValue)"
        }
    }

    // MARK: - Properties

    var window: UIWindow?


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        let splitViewController = self.window!.rootViewController as! UISplitViewController
        let navigationController = splitViewController.viewControllers[splitViewController.viewControllers.count-1] as! UINavigationController
        navigationController.topViewController!.navigationItem.leftBarButtonItem = splitViewController.displayModeButtonItem()
        splitViewController.delegate = self
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
        print("アクティブになった場合")
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    // MARK: - Other UIApplicationDelegate

    @available(iOS 9.0, *)
    func application(application: UIApplication, performActionForShortcutItem shortcutItem: UIApplicationShortcutItem, completionHandler: (Bool) -> Void) {
        
//        completionHandler(true)
        let handledShortCutItem = handleShortCutItem(shortcutItem)
        completionHandler(handledShortCutItem)

        print("-- \(shortcutItem.type)")
        print("-- \(shortcutItem.userInfo)")
    }

    // MARK: - Split view

    func splitViewController(splitViewController: UISplitViewController, collapseSecondaryViewController secondaryViewController:UIViewController, ontoPrimaryViewController primaryViewController:UIViewController) -> Bool {
        guard let secondaryAsNavController = secondaryViewController as? UINavigationController else { return false }
        guard let topAsDetailController = secondaryAsNavController.topViewController as? DetailViewController else { return false }
        if topAsDetailController.detailItem == nil {
            // Return true to indicate that we have handled the collapse by doing nothing; the secondary controller will be discarded.
            return true
        }
        return false
    }

    // MARK: - Utility Methods for UIApplicationShortcutItem

    func handleShortCutItem(shortcutItem: UIApplicationShortcutItem) -> Bool {
        var handled = false
        
        // Verify that the provided `shortcutItem`'s `type` is one handled by the application.
//        guard ShortcutIdentifier(fullType: shortcutItem.type) != nil else { return false }
        
//        guard let shortCutType = shortcutItem.type as String? else { return false }
//        
//        switch (shortCutType) {
//        case ShortcutIdentifier.First.type:
//            // Handle shortcut 1 (static).
//            handled = true
//            break
//        case ShortcutIdentifier.Second.type:
//            // Handle shortcut 2 (static).
//            handled = true
//            break
//        case ShortcutIdentifier.Third.type:
//            // Handle shortcut 3 (dynamic).
//            handled = true
//            break
//        case ShortcutIdentifier.Fourth.type:
//            // Handle shortcut 4 (dynamic).
//            handled = true
//            break
//        default:
//            break
//        }
        
        handled = true

        let message = "\"\(shortcutItem.localizedTitle)\""
        // Construct an alert using the details of the shortcut used to open the application.
        let alertController = UIAlertController(title: "ショートカットで起動されました", message: message, preferredStyle: .Alert)
        let okAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
        alertController.addAction(okAction)
        
        // Display an alert indicating the shortcut selected from the home screen.
        window!.rootViewController?.presentViewController(alertController, animated: true, completion: nil)
        
        return handled
    }
}

