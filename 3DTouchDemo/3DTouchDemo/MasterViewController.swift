//
//  MasterViewController.swift
//  3DTouchDemo
//
//  Created by Naoki Tsutsui on 12/18/15.
//  Copyright © 2015 Naoki Tsutsui. All rights reserved.
//

import UIKit

class MasterViewController: UITableViewController {

    var detailViewController: DetailViewController? = nil
    var objects = [AnyObject]()

    lazy var staticShortcuts: [UIApplicationShortcutItem] = {
        guard let shortcuts = NSBundle.mainBundle().infoDictionary?["UIApplicationShortcutItems"] as? [[String: NSObject]] else { return [] }
        
        let shortcutItems = shortcuts.flatMap { shortcut -> [UIApplicationShortcutItem] in

            guard let shortcutType = shortcut["UIApplicationShortcutItemType"] as? String,
                var shortcutTitle = shortcut["UIApplicationShortcutItemTitle"] as? String else { return [] }
            
            if let localizedTitle = NSBundle.mainBundle().localizedInfoDictionary?[shortcutTitle] as? String {
                shortcutTitle = localizedTitle
            }
            
            var shortcutSubtitle = shortcut["UIApplicationShortcutItemSubtitle"] as? String
            if shortcutSubtitle != nil {
                shortcutSubtitle = NSBundle.mainBundle().localizedInfoDictionary?[shortcutSubtitle!] as? String
            }
            
            return [
                UIApplicationShortcutItem(type: shortcutType, localizedTitle: shortcutTitle, localizedSubtitle: shortcutSubtitle, icon: nil, userInfo: nil)
            ]
        }

        return shortcutItems
    }()
    
    /// Shortcuts defined by the application and modifiable based on application state.
    lazy var dynamicShortcuts = UIApplication.sharedApplication().shortcutItems ?? []


    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.navigationItem.leftBarButtonItem = self.editButtonItem()

        let addButton = UIBarButtonItem(barButtonSystemItem: .Add, target: self, action: "insertNewObject:")
        self.navigationItem.rightBarButtonItem = addButton
        if let split = self.splitViewController {
            let controllers = split.viewControllers
            self.detailViewController = (controllers[controllers.count-1] as! UINavigationController).topViewController as? DetailViewController
        }
        
        
        print("staticShortcuts: \(staticShortcuts)")
        print("dynamicShortcuts: \(dynamicShortcuts)")
    }

    override func viewWillAppear(animated: Bool) {
        self.clearsSelectionOnViewWillAppear = self.splitViewController!.collapsed
        super.viewWillAppear(animated)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func insertNewObject(sender: AnyObject) {
        objects.insert(NSDate(), atIndex: 0)
        let indexPath = NSIndexPath(forRow: 0, inSection: 0)
        self.tableView.insertRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
    }

    // MARK: - Segues

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "showDetail" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                let object = objects[indexPath.row] as! NSDate
                let controller = (segue.destinationViewController as! UINavigationController).topViewController as! DetailViewController
                controller.detailItem = object
                controller.navigationItem.leftBarButtonItem = self.splitViewController?.displayModeButtonItem()
                controller.navigationItem.leftItemsSupplementBackButton = true
            }
        }
    }

    // MARK: - Table View

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return objects.count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath)

        let object = objects[indexPath.row] as! NSDate
        cell.textLabel!.text = object.description
        return cell
    }

    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }

    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            objects.removeAtIndex(indexPath.row)
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view.
        }
    }


}

