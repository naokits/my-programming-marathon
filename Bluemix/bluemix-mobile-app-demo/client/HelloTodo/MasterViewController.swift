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
import SwiftyJSON

class MasterViewController: UITableViewController {

    // MARK: - Properties

    var detailViewController: DetailViewController? = nil
    var objects: [Todo] = []

    // MARK: - ViewController Lifecycle

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

    override func viewWillAppear(animated: Bool) {
        self.clearsSelectionOnViewWillAppear = self.splitViewController!.collapsed
        super.viewWillAppear(animated)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Handle Datasource
    
    func handleRefresh(refreshControl:UIRefreshControl){
        //        self.logger.debug("handleRefresh")
        self.loadItems()
        refreshControl.endRefreshing()
    }
    
    func loadItems(){
        logger.debug("TODO一覧を読み込みます")
        
        fetchTodos()
        // fetchTodo(2)
    }

    func insertNewObject(sender: AnyObject) {
//        objects.insert(NSDate(), atIndex: 0)
//        let indexPath = NSIndexPath(forRow: 0, inSection: 0)
//        self.tableView.insertRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
        
        let todo = Todo(id: 0, text: "TODO " + dateString(NSDate()), isDone: false)
        addTodo(todo)
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
            logger.debug("削除対象のTODO: \(objects[indexPath.row])")
            let todo = objects[indexPath.row]
            deleteTodo(todo, completionHandler: { (error) in
                if let e = error {
                    logger.error("TODOの削除失敗: \(e)")
                    return
                }
                self.objects.removeAtIndex(indexPath.row)
                tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
            })
            
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view.
        }
    }

    // MARK: - API Access

    func fetchTodos() {
        typealias Payload = [[String: AnyObject]]
        
        let request = Request(url: "/api/Items", method: HttpMethod.GET)
        request.headers = ["Content-Type":"application/json", "Accept":"application/json"];
        request.queryParameters = [
            "filter[limit]" : "10",
            "filter[order]" : "id DESC"
        ]
        request.sendWithCompletionHandler { response, error in
            if let e = error {
                logger.error("Error :: \(e)")
                return
            }
            
            let json = JSON.parse(response!.responseText!)
            if json == nil {
                logger.debug("JSONパース失敗)")
            }
            
            let todos = [Todo].fromJSONArray(json.rawValue as! Payload)
            
            self.objects = todos
            self.dispatchOnMainQueueAfterDelay(0) {
                self.tableView.reloadData()
            }
        }
    }
    
    func fetchTodo(id: Int) {
        typealias Payload = [String: AnyObject]
        
        let request = Request(url: "/api/Items/" + String(id), method: .GET)
//        request.headers = ["foo":"bar"]
//        request.queryParameters = ["foo":"bar"]
        
        request.sendWithCompletionHandler { response, error in
            if let e = error {
                logger.error("Error :: \(e)")
                return
            }
            
            let json = JSON.parse(response!.responseText!)
            
            print("--1: \(json)")
            print("--2: \(json.rawValue)")
//            let todos = [Todo].fromJSONArray(json.rawValue as! Payload)
            
            let todo = Todo(json: json.rawValue as! [String: AnyObject])
            logger.debug("--3: \(todo?.text)")
        }
    }
  
    func addTodo(todo: Todo) {
        let request = Request(url: "/api/Items", method: HttpMethod.POST)
        request.headers = ["Content-Type":"application/json", "Accept":"application/json"];
        logger.debug("**** \(todo.toJSON())")
        let jsonString = JSON(todo.toJSON()!).rawString()

        request.sendString(jsonString!) { (response, error) in
            if let e = error {
                logger.error("Error :: \(e)")
                return
            }
            if response?.statusCode == 200 {
                logger.debug("追加成功: \(response?.responseText)")
                self.loadItems()
            }
        }
    }
    
    func updateTodo(todo:Todo, completionHandler:(NSError?) -> Void){
        let req = Request(url: "/api/items", method: .PUT)
        req.headers = ["Content-Type":"application/json", "Accept":"application/json"];
        let jsonString = JSON(todo.toJSON()!).rawString()

        req.sendString(jsonString!) { (response, error) -> Void in
            if let err = error {
                logger.error(err.description)
                completionHandler(err);
            } else {
                completionHandler(nil)
            }
        }
    }
    
    
    
    func deleteTodo(todo:Todo, completionHandler:(NSError?) -> Void){
        print("削除対象: \(todo)")
        let req = Request(url: "/api/items/" + String(todo.id), method: .DELETE)
        req.headers = ["Content-Type":"application/json", "Accept":"application/json"];
        
        req.sendWithCompletionHandler() { (response, error) -> Void in
            if let err = error {
                logger.error(err.description)
                completionHandler(err);
            } else {
                completionHandler(nil)
            }
        }
    }

    
    // MARK: - Utility Methods
    
    func dispatchOnMainQueueAfterDelay(delay:Double, closure:()->()) {
        dispatch_after(
            dispatch_time(
                DISPATCH_TIME_NOW,
                Int64(delay * Double(NSEC_PER_SEC))+100
            ),
            dispatch_get_main_queue(), closure)
    }
    
    func dateString(date: NSDate) -> String {
        let dateFormatter = NSDateFormatter()
        dateFormatter.locale = NSLocale(localeIdentifier: "ja_JP")
        dateFormatter.dateFormat = "yyyy/MM/dd HH:mm"
        let dateString: String = dateFormatter.stringFromDate(date)
        return dateString
    }
}


