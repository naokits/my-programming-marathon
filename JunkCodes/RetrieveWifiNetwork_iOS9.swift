
import NetworkExtension.NEHotspotHelper

/// iOS9以上の場合
/// 有効なWiFiネットワーク情報をすべて取得して、結果をコンソールに表示する
/// networkextension@apple.com にメールを送って、返信メールの内容に答える必要がある
/// Appleの許可が得られるまでは、supportedNetworkInterfacesの結果は常に空
func retrieveWifiNetwork() {
    let interfaces = NEHotspotHelper.supportedNetworkInterfaces()
    
    print("--- \(interfaces)") // Appleの許可が得られるまで、常に空
    
    for interface in interfaces as! [NEHotspotNetwork] {
        print("--- \(interfaces)")
        let ssid = interface.SSID
        let bssid = interface.BSSID
        let secure = interface.secure
        let autoJoined = interface.autoJoined
        let signalStrength = interface.signalStrength
        
        print("ssid: \(ssid)")
        print("bssid: \(bssid)")
        print("secure: \(secure)")
        print("autoJoined: \(autoJoined)")
        print("signalStrength: \(signalStrength)")
    }
}
