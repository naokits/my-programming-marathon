//
//  MasterViewController.swift
//  NCMB_iOSAppDemo
//
//  Created by Naoki Tsutsui on 1/30/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import NCMB

class MasterViewController: UITableViewController {

    // MARK: - Properties
    
    let locationManager = CLLocationManager()
    var detailViewController: DetailViewController? = nil
    var objects = [AnyObject]()

    // MARK: - ViewController Cycle

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
    }

    override func viewWillAppear(animated: Bool) {
        self.clearsSelectionOnViewWillAppear = self.splitViewController!.collapsed
        super.viewWillAppear(animated)
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        if let user = NCMBUser.currentUser() {
            print("ログイン中: \(user)")
            search2()
        } else {
            print("ログインしていない")
            // とりあえず、通常通りに宣言
            let name = "Main"
            let identifier = "Login"
            let storyboard = UIStoryboard(name: name, bundle: nil)
            let viewController = storyboard.instantiateViewControllerWithIdentifier(identifier) as! LoginViewController
            self.navigationController?.presentViewController(viewController, animated: true, completion: nil)
        }
        setupLocation()
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
    
    // MARK: - GEO Search

    func search() {
        // 自宅付近
        let latitude = Double(7.028841)
        let longitude = Double(125.088840)
        let geoPoint = NCMBGeoPoint(latitude: latitude, longitude: longitude)

        let geoQuery = User.query()
        geoQuery.whereKey("geoPoint", nearGeoPoint: geoPoint, withinKilometers: Double(1.0))
        geoQuery.limit = 10

        do {
            let points = try geoQuery.findObjects() as NSArray
            let user = points.lastObject as! NCMBUser // ("geoPoint.latitude")
            print("-------- \(user.userName)")

        } catch {
            print(error)
        }
        
        geoQuery.findObjectsInBackgroundWithBlock { objects, error in
            if let e = error {
                print("失敗: \(e)")
                return
            }
            if let users:[User] = objects as? [User] {
                print("********** \(users)")
            }
        }
    }
    
    func search2() {
        // 自宅付近
        let latitude = Double(7.028841)
        let longitude = Double(125.088840)
        let geoPoint = NCMBGeoPoint(latitude: latitude, longitude: longitude)
        
        let geoQuery = Location.query()
        geoQuery.whereKey("geoPoint", nearGeoPoint: geoPoint, withinKilometers: Double(2.0))
        geoQuery.limit = 20
        
        do {
            let points = try geoQuery.findObjects() as NSArray
            for point in points as! [Location] {
                print("-------- \(point.name)")
            }
        } catch {
            print("失敗: \(error)")
        }
    }

    
    // MARK: - Setup
    
    func setupLocation() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        //        locationManager.distanceFilter = 100
        locationManager.startUpdatingLocation()
    }
    
    func addLocation() {
        let latitude = 35.690921
        let longitude = 139.700258
        let geoPoint = NCMBGeoPoint(latitude: latitude, longitude: longitude)
        
        let location = Location.object() as! Location
        location.geoPoint = geoPoint
        location.name = "新宿駅"
        location.setObject("新宿駅", forKey: "name")
        location.saveInBackgroundWithBlock { error in
            if let e = error {
                print("端末情報の保存失敗: \(e)")
            } else {
                print("端末情報の保存成功")
            }
        }
    }

}


//--------------------------------------------------------------------------
// MARK: - CLLocationManagerDelegate
//--------------------------------------------------------------------------

extension MasterViewController: CLLocationManagerDelegate {
    /// Invoked when new locations are available.  Required for delivery of
    /// deferred locations.  If implemented, updates will
    /// not be delivered to locationManager:didUpdateToLocation:fromLocation:
    ///
    /// locations is an array of CLLocation objects in chronological order.
    func locationManager(manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("ロケーションの数: \(locations.count)")
        
        if let location = locations.first {
            print("Current location: \(location)")
//            textView.text = location.description
            
            let cordinate = locations[0].coordinate
            print("緯度: \(cordinate.latitude)")
            print("経度: \(cordinate.longitude)")
        } else {
            // ...
            print("エラー")
        }
    }
    
    /// Invoked when a new heading is available.
    func locationManager(manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        
    }
    
    /// Invoked when a new heading is available. Return YES to display heading calibration info. The display
    /// will remain until heading is calibrated, unless dismissed early via dismissHeadingCalibrationDisplay.
    func locationManagerShouldDisplayHeadingCalibration(manager: CLLocationManager) -> Bool {
        return false
    }
    
    /// Invoked when there's a state transition for a monitored region or in response to a request for state via a
    /// a call to requestStateForRegion:.
    func locationManager(manager: CLLocationManager, didDetermineState state: CLRegionState, forRegion region: CLRegion) {
        
    }
    
    /// Invoked when a new set of beacons are available in the specified region.
    /// beacons is an array of CLBeacon objects.
    /// If beacons is empty, it may be assumed no beacons that match the specified region are nearby.
    /// Similarly if a specific beacon no longer appears in beacons, it may be assumed the beacon is no longer received
    /// by the device.
    func locationManager(manager: CLLocationManager, didRangeBeacons beacons: [CLBeacon], inRegion region: CLBeaconRegion) {
        
    }
    
    /// Invoked when an error has occurred ranging beacons in a region. Error types are defined in "CLError.h".
    func locationManager(manager: CLLocationManager, rangingBeaconsDidFailForRegion region: CLBeaconRegion, withError error: NSError) {
        
    }
    
    /// Invoked when the user enters a monitored region.  This callback will be invoked for every allocated
    /// CLLocationManager instance with a non-nil delegate that implements this method.
    func locationManager(manager: CLLocationManager, didEnterRegion region: CLRegion) {
        
    }
    
    /// Invoked when the user exits a monitored region.  This callback will be invoked for every allocated
    /// CLLocationManager instance with a non-nil delegate that implements this method.
    func locationManager(manager: CLLocationManager, didExitRegion region: CLRegion) {
        
    }
    
    /// Invoked when an error has occurred. Error types are defined in "CLError.h".
    func locationManager(manager: CLLocationManager, didFailWithError error: NSError) {
        print("Error finding location: \(error.localizedDescription)")
    }
    
    /// Invoked when a region monitoring error has occurred. Error types are defined in "CLError.h".
    func locationManager(manager: CLLocationManager, monitoringDidFailForRegion region: CLRegion?, withError error: NSError) {
        
    }
    
    /// Invoked when the authorization status changes for this application.
    func locationManager(manager: CLLocationManager, didChangeAuthorizationStatus status: CLAuthorizationStatus) {
        print("didChangeAuthorizationStatus");
        var statusStr = ""
        
        switch (status) {
        case .NotDetermined:
            // User has not yet made a choice with regards to this application
            statusStr = "NotDetermined"
            // 未認証ならリクエストダイアログ出す。info.plistに `NSLocationWhenInUseUsageDescription` が定義されていること。
            locationManager.requestWhenInUseAuthorization()
            
            //            if CLLocationManager.authorizationStatus() != CLAuthorizationStatus.AuthorizedAlways {
            //                locationManager.requestAlwaysAuthorization()
            //            }
        case .Restricted:
            // This application is not authorized to use location services.  Due
            // to active restrictions on location services, the user cannot change
            // this status, and may not have personally denied authorization
            statusStr = "Restricted"
        case .Denied:
            // User has explicitly denied authorization for this application, or
            // location services are disabled in Settings.
            statusStr = "Denied"
        case .AuthorizedAlways:
            // User has granted authorization to use their location at any time,
            // including monitoring for regions, visits, or significant location changes.
            statusStr = "AuthorizedAlways"
        case .AuthorizedWhenInUse:
            // User has granted authorization to use their location only when your app
            // is visible to them (it will be made visible to them if you continue to
            // receive location updates while in the background).  Authorization to use
            // launch APIs has not been granted.
            statusStr = "AuthorizedWhenInUse"
        }
        print(" CLAuthorizationStatus: \(statusStr)")
    }
    
    
    /// Invoked when a monitoring for a region started successfully.
    func locationManager(manager: CLLocationManager, didStartMonitoringForRegion region: CLRegion) {
        
    }
    
    /// Invoked when location updates are automatically paused.
    func locationManagerDidPauseLocationUpdates(manager: CLLocationManager) {
        
    }
    
    /// Invoked when location updates are automatically resumed.
    ///
    /// In the event that your application is terminated while suspended, you will
    /// not receive this notification.
    func locationManagerDidResumeLocationUpdates(manager: CLLocationManager) {
        
    }
    
    /// Invoked when deferred updates will no longer be delivered. Stopping
    /// location, disallowing deferred updates, and meeting a specified criterion
    /// are all possible reasons for finishing deferred updates.
    ///
    /// An error will be returned if deferred updates end before the specified
    /// criteria are met (see CLError), otherwise error will be nil.
    func locationManager(manager: CLLocationManager, didFinishDeferredUpdatesWithError error: NSError?) {
        
    }
    
    /// Invoked when the CLLocationManager determines that the device has visited
    /// a location, if visit monitoring is currently started (possibly from a
    /// prior launch).
    func locationManager(manager: CLLocationManager, didVisit visit: CLVisit) {
        
    }
}

