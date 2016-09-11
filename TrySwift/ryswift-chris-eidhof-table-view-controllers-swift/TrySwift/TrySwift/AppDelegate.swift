//
//  AppDelegate.swift
//  TrySwift
//
//  Created by Naoki Tsutsui on 9/8/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

struct Person {
    let name: String
    let city: String
}

let people = [
    Person(name: "Chris", city: "Berlin"),
    Person(name: "Natash", city: "Tokyo"),
    Person(name: "Ayaka", city: "San Francisco"),
    Person(name: "Ash", city: "New York")
]

let pokedex = ["Pikachu", "Snorlax", "Delphox"]

struct UndoHistory<Item> {
    let initialValue: [Item]
    var history: [[Item]] = []
    
    init(_ initialValue: [Item]) {
        self.initialValue = initialValue
    }
    
    var currentValue: [Item] {
        get { return history.last ?? initialValue }
        set { history.append(newValue) }
    }
    
    var canUndo: Bool {
        return !history.isEmpty
    }
    
    mutating func undo() {
        history.popLast()
    }
}

struct TableViewConfiguration<Item> {
    var items: [Item]
    var style: UITableViewStyle
    var cellStyle: UITableViewCellStyle
    var editable: Bool
    var configureCell: (UITableViewCell, Item) -> ()
}

final class MyTableViewController<Item>: UITableViewController {
    var history: UndoHistory<Item> {
        didSet {
            tableView.reloadData()
            navigationItem.rightBarButtonItem = history.canUndo ? UIBarButtonItem(barButtonSystemItem: .Undo, target: self, action: #selector(MyTableViewController.undo(_:))) : nil
        }
    }
    var items: [Item] {
        get { return history.currentValue }
        set { history.currentValue = newValue }
    }
    let cellStyle: UITableViewCellStyle
    let configureCell: (cell: UITableViewCell, item: Item) -> ()
    
    init(configuration: TableViewConfiguration<Item>) {
        self.history = UndoHistory(configuration.items)
        self.cellStyle = configuration.cellStyle
        self.configureCell = configuration.configureCell
        super.init(style: configuration.style)
        
        if configuration.editable {
            navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .Edit, target: self, action: #selector(MyTableViewController.edit(_:)))
        }
    }
    
    func edit(sender: AnyObject) {
        self.tableView.editing = !self.tableView.editing
    }
    
    func undo(sender: AnyObject) {
        history.undo()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items.count
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: cellStyle, reuseIdentifier: nil)
        
        let item = items[indexPath.row]
        configureCell(cell: cell, item: item)
        
        return cell
    }
    
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        guard editingStyle == .Delete else { return }
        items.removeAtIndex(indexPath.row)
    }
}

let config = TableViewConfiguration(items: people, style: .Plain, cellStyle: .Subtitle, editable: true) { cell, item in
    cell.textLabel?.text = item.name
    cell.detailTextLabel?.text = item.city
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        var myConfig = config
        myConfig.style = .Grouped
        let tableVC = MyTableViewController(configuration: myConfig)
        
        tableVC.title = "People"
        let navigationController = UINavigationController(rootViewController: tableVC)
        
        window?.rootViewController = navigationController

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
}
