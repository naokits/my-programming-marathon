//: Playground - noun: a place where people can play

import UIKit
import XCPlayground


struct Person {
    let name: String
    let city: String
}

let people: [Person] = [
    Person(name: "Chris", city: "Berlin"),
    Person(name: "Natash", city: "Tokyo"),
    Person(name: "Ayaka", city: "San Francisco"),
    Person(name: "Ash", city: "New York")
]

let pokedex: [String] = ["Pikachu", "Snorlax", "Delphox"]

final class MyTableViewController<Item>: UITableViewController {
    let items: [Item]
    let cellStyle: UITableViewCellStyle
    let configureCell: (cell: UITableViewCell, item: Item) -> ()
    
    init(items: [Item], style: UITableViewStyle, cellStyle: UITableViewCellStyle, editable: Bool, configureCell: (UITableViewCell, Item) -> ()) {
        self.items = items
        self.cellStyle = cellStyle
        self.configureCell = configureCell
        super.init(style: style)
        
        if editable {
            navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .Edit, target: self, action: #selector(MyTableViewController.edit(_:)))
        }
    }
    
    func edit(sender: AnyObject) {
        self.tableView.editing = !self.tableView.editing
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
}

let tableVC = MyTableViewController(items: people, style: .Plain, cellStyle: .Subtitle, editable: true) { (cell, item) in
    cell.textLabel?.text = item.name
    cell.detailTextLabel?.text = item.city
}

let vc = MyTableViewController(items: pokedex, style: .Grouped, cellStyle: .Default, editable: true) { (cell, item) in
    cell.textLabel?.text = item
}

tableVC.title = "People"

let navigationController = UINavigationController(rootViewController: tableVC)

navigationController.view.frame = CGRect(x: 0, y: 0, width: 320, height: 480)


// 非同期処理を有効
XCPlaygroundPage.currentPage.needsIndefiniteExecution = true
// ナビゲーションコントローラを表示
XCPlaygroundPage.currentPage.liveView = navigationController

