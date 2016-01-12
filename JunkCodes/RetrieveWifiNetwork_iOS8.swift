import SystemConfiguration.CaptiveNetwork


/// 有効なWiFiネットワーク情報をすべて取得して、結果をコンソールに表示する
/// iOS9未満の場合（ただし、iOS9以上ではDeprecatedなAPIを使用）
/// CNCopySupportedInterfaces, CNCopyCurrentNetworkInfo
func retrieveWifiNetwork() {
    let interfaces:CFArray! = CNCopySupportedInterfaces()
    print("interfaces: \(interfaces)")

    for i in 0..<CFArrayGetCount(interfaces) {
        let interfaceName: UnsafePointer<Void> = CFArrayGetValueAtIndex(interfaces, i)
        let rec = unsafeBitCast(interfaceName, AnyObject.self)
        let unsafeInterfaceData = CNCopyCurrentNetworkInfo("\(rec)")
        var ssid = ""
        if unsafeInterfaceData != nil {
            let interfaceData = unsafeInterfaceData! as Dictionary!
            ssid = interfaceData["SSID"] as! String
        } else {
            ssid = ""
        }
        print("currentSSID: \(ssid)")
    }
}
