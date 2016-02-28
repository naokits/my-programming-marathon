//
//  ViewController.swift
//  MKDirectionsDemo
//
//  Created by Naoki Tsutsui on 2/28/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import MapKit

class ViewController: UIViewController, MKMapViewDelegate {
    
    // MARK: - Properties

    /// マップビュー
    @IBOutlet weak var mapView: MKMapView!
    /// 目的地までの所要時間（移動手段によって変わる）
    @IBOutlet weak var expectedTravelTime: UILabel!
    /// 目的地までの距離
    @IBOutlet weak var distance: UILabel!

    // MARK: - View Cycle

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        setupMapView()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Setup

    func setupMapView() {
        mapView.delegate = self
        
        // 出発点（渋谷駅）
        let myLatitude = 35.658200
        let myLongitude = 139.701552
        
        // 目的地（ドンキホーテ渋谷店）
        let reqLatitude = 35.660130
        let reqLongitude = 139.696839
        
        // 目的地の座標を指定
        let requestCoordinate = CLLocationCoordinate2DMake(reqLatitude, reqLongitude)
        let fromCoordinate = CLLocationCoordinate2DMake(myLatitude, myLongitude)
        
        // 地図の中心を出発点と目的地の中間に設定
        let center = CLLocationCoordinate2DMake((myLatitude + reqLatitude)/2, (myLongitude + reqLongitude)/2)
        mapView.setCenterCoordinate(center, animated: true)
        
        // 縮尺指定
        let mySpan = MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        let myRegion = MKCoordinateRegion(center: center, span: mySpan)
        
        mapView.region = myRegion
        
        let fromPlace = MKPlacemark(coordinate: fromCoordinate, addressDictionary: nil)
        let fromItem = MKMapItem(placemark: fromPlace)

        let toPlace = MKPlacemark(coordinate: requestCoordinate, addressDictionary: nil)
        let toItem = MKMapItem(placemark: toPlace)
        
        let req = MKDirectionsRequest()
        req.source = fromItem // 出発地のItemをセット
        req.destination = toItem // 目的地のItemをセット
        req.requestsAlternateRoutes = true // 複数経路の検索を有効
        // myRequest.transportType = MKDirectionsTransportType.Automobile // 移動手段を車に設定
        req.transportType = MKDirectionsTransportType.Walking // 移動手段を徒歩に設定

        let myDirections = MKDirections(request: req)
        
        // 複数の経路を探索する
        myDirections.calculateDirectionsWithCompletionHandler { response, error in
            if let e = error {
                debugPrint("エラー： \(e.localizedDescription)")
                return
            }
            if response!.routes.isEmpty {
                debugPrint("ルートが見つかりません： 経路数: \(response!.routes.count)")
                return
            }
            
            let route = response!.routes[0] as MKRoute
            self.mapView.addOverlay(route.polyline) // ルートを描画
            
            self.distance.text = "\(route.distance/1000.0)km"
            self.expectedTravelTime.text = "\(Int(route.expectedTravelTime/60)) 分"
        }

        addAnnotation(fromCoordinate, toCoordinate: requestCoordinate)
    }
    
    /// 出発地点と到着地点に、ピンを生成してMapViewに表示する
    func addAnnotation(fromCoordinate: CLLocationCoordinate2D, toCoordinate: CLLocationCoordinate2D) {
        addAnnotation(fromCoordinate, title: "出発地点")
        addAnnotation(toCoordinate, title: "目的地点")
    }
    
    func addAnnotation(coordinate: CLLocationCoordinate2D, title: String) {
        let toPin = MKPointAnnotation()
        toPin.coordinate = coordinate
        toPin.title = title
        mapView.addAnnotation(toPin)
    }
    
    // MARK: - MKMapViewDelegate

    /// 経路のラインを描画する
    func mapView(mapView: MKMapView, rendererForOverlay overlay: MKOverlay) -> MKOverlayRenderer {
        let route = overlay as! MKPolyline
        let routeRenderer = MKPolylineRenderer(polyline: route)
        
        routeRenderer.lineWidth = 3.0
        routeRenderer.strokeColor = UIColor.redColor()
        
        return routeRenderer
    }
}

