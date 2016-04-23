//
//  MasterViewController.swift
//  HelloTodo
//
//  Created by Naoki Tsutsui on 4/23/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import BMSCore
import Gloss

class MasterViewController: UITableViewController {

    var detailViewController: DetailViewController? = nil
    var objects: [Todo] = []
//    var todoItems:[Todo] = []



    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.navigationItem.leftBarButtonItem = self.editButtonItem()

        let addButton = UIBarButtonItem(barButtonSystemItem: .Add, target: self, action: #selector(MasterViewController.insertNewObject(_:)))
        self.navigationItem.rightBarButtonItem = addButton
        if let split = self.splitViewController {
            let controllers = split.viewControllers
            self.detailViewController = (controllers[controllers.count-1] as! UINavigationController).topViewController as? DetailViewController
        }
        
        title = "Todo一覧"
        
        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor.clearColor()
        refreshControl.addTarget(self, action: #selector(handleRefresh), forControlEvents: UIControlEvents.ValueChanged)
        self.tableView.addSubview(refreshControl)

        
    }
    
    override func viewDidAppear(animated: Bool) {
//        becomeFirstResponder()
        loadItems()
    }

    
    func handleRefresh(refreshControl:UIRefreshControl){
//        self.logger.debug("handleRefresh")
        self.loadItems()
        refreshControl.endRefreshing()
    }

    func loadItems(){
        logger.debug("TODO一覧を読み込みます")

//        TodoFacade.getItems({ (items:[TodoItem]?, error:NSError?) in
//            SwiftSpinner.hide(){
//                if let err = error{
//                    self.showError(err.localizedDescription)
//                } else {
//                    self.todoItems = items!;
//                    self.dispatchOnMainQueueAfterDelay(0) {
//                        self.tableView.reloadData()
//                    }
//                }
//            }
//        })
        
        fetchTodos()
        //        fetchTodo(2)

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
//        objects.insert(NSDate(), atIndex: 0)
//        let indexPath = NSIndexPath(forRow: 0, inSection: 0)
//        self.tableView.insertRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
    }

    // MARK: - Segues

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "showDetail" {
            if let indexPath = self.tableView.indexPathForSelectedRow {
                let object = objects[indexPath.row]
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

        let todo = objects[indexPath.row]
        cell.textLabel!.text = todo.text
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


    func fetchTodos() {
        typealias Payload = [[String: AnyObject]]
        
        let request = Request(url: "/api/Items", method: HttpMethod.GET)
        request.headers = [:]
        request.queryParameters = [:]
        request.sendWithCompletionHandler { response, error in
            if let e = error {
                logger.error("Error :: \(e)")
                return
            }
            
            let json: Payload!
            do {
                json = try NSJSONSerialization.JSONObjectWithData((response?.responseData)!, options: NSJSONReadingOptions()) as! Payload
            } catch {
                logger.error("Error: \(error)")
                return
            }
            
            let todos = [Todo].fromJSONArray(json)
            
            self.objects = todos
            self.dispatchOnMainQueueAfterDelay(0) {
                self.tableView.reloadData()
            }
        }
    }
    
    func fetchTodo(id: Int) {
        typealias Payload = [String: AnyObject]
        
        let request = Request(url: "/api/Items/" + String(id), method: .GET)
        request.headers = ["foo":"bar"]
        request.queryParameters = ["foo":"bar"]
        
        request.sendWithCompletionHandler { response, error in
            if let e = error {
                logger.error("Error :: \(e)")
                return
            }
            
            var json: Payload!
            do {
                json = try NSJSONSerialization.JSONObjectWithData((response?.responseData)!, options: NSJSONReadingOptions()) as! Payload
                

                logger.debug("------- OK: \(json["text"]!)")
                if let todo = Todo(json: json) {
                    logger.debug("--- \(todo.id)")
                    logger.debug("--- \(todo.text)")
                    logger.debug("--- \(todo.isDone)")
                }
            } catch {
                logger.error("Error: \(error)")
                return
            }
            
            
        }
    }
    
    func dispatchOnMainQueueAfterDelay(delay:Double, closure:()->()) {
        dispatch_after(
            dispatch_time(
                DISPATCH_TIME_NOW,
                Int64(delay * Double(NSEC_PER_SEC))+100
            ),
            dispatch_get_main_queue(), closure)
    }
}


