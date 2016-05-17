//
//  MasterViewController.swift
//  StrongLoopClientDemo
//
//  Created by Naoki Tsutsui on 5/12/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

class MasterViewController: UITableViewController {

    var detailViewController: DetailViewController? = nil
    var menus = [[String: AnyObject]]()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        self.setupMenu()
    }

    override func viewWillAppear(animated: Bool) {
        self.clearsSelectionOnViewWillAppear = self.splitViewController!.collapsed
        super.viewWillAppear(animated)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Segues

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {

        if segue.identifier == "showDetail" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                let controller = (segue.destinationViewController as! UINavigationController).topViewController as! DetailViewController
                controller.detailItem = indexPath.row
                controller.navigationItem.leftItemsSupplementBackButton = true
            }
        }
    }

    // MARK: - Table View

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return menus.count
    }
    
    override func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return 60.0
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath)

        let menu = menus[indexPath.row]
        cell.textLabel!.text = menu["title"] as? String
        return cell
    }


    // MARK: - MISC
    
    func setupMenu() {
        self.menus = [
            ["title": "ユーザ登録", "menuID": 0],
            ["title": "ログイン", "menuID": 1],
            ["title": "ログアウト", "menuID": 2],
            ["title": "ユーザ情報取得（複数）", "menuID": 3],
            ["title": "ユーザ情報取得（ID固定）", "menuID": 4],
        ]
    }
}

