import SystemConfiguration.CaptiveNetwork


/// 有効なWiFiネットワーク情報をすべて取得して、結果をコンソールに表示する
/// iOS9未満の場合（ただし、iOS9以上ではDeprecatedなAPIを使用）
/// CNCopySupportedInterfaces, CNCopyCurrentNetworkInfo
/// iOS9.2上でも一応動作する
/// http://qiita.com/naokits/items/aa16e1553880c7ddbfbf
func printRetrievedWifiNetwork() {
    guard let interfaces:CFArray! = CNCopySupportedInterfaces() else {
        return
    }
    print("interfaces: \(interfaces)")
    
    for i in 0..<CFArrayGetCount(interfaces) {
        guard let interfaceName: UnsafePointer<Void> = CFArrayGetValueAtIndex(interfaces, i) else {
            continue
        }
        let rec = unsafeBitCast(interfaceName, AnyObject.self)
        guard let unsafeInterfaceData = CNCopyCurrentNetworkInfo("\(rec)") else {
            continue
        }
        guard let interfaceData = unsafeInterfaceData as Dictionary! else {
            continue
        }
        print("SSID: \(interfaceData["SSID"] as! String)")
        print("BSSID: \(interfaceData["BSSID"] as! String)")
    }
}
