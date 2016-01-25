//
//  ScreenSaverDemo.swift
//  ScreenSaverDemo
//
//  Created by Naoki Tsutsui on 1/25/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

//import Foundation

import ScreenSaver
import WebKit


class ScreenSaverDemoView: ScreenSaverView {

    // MARK: - Properties

    let INTERVAL = 60.0 * 3
    var count = Int(0)
    var webView: WebView?

    // MARK: - Initialization

    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    override init?(frame: NSRect, isPreview: Bool) {
        super.init(frame: frame, isPreview: isPreview)
        self.animationTimeInterval = INTERVAL
        webView = WebView(frame: self.bounds, frameName: nil, groupName: nil)
        webView?.drawsBackground = true // 効果がよくわからない
        self.addSubview(webView!)
    }

    // MARK: - ScreenSaver Lifecycle

    override func startAnimation() {
        super.startAnimation()
    }
    
    override func stopAnimation() {
        super.stopAnimation()
    }
    
    override func drawRect(rect: NSRect) {
        super.drawRect(rect)
    }
    
    override func animateOneFrame() {
        displayFavoritSite()
        return
    }
    
    override func hasConfigureSheet() -> Bool {
        return false
    }
    
    override func configureSheet() -> NSWindow? {
        return nil
    }
    
    // MARK: - Misc
    
    func displayFavoritSite() {
        switch count {
        case 1:
            webView?.mainFrameURL = "http://news.google.co.jp"
        case 2:
            webView?.mainFrameURL = "https://web.kamel.io"
        case 3:
            webView?.mainFrameURL = "http://qiita.com"
        case 4:
            webView?.mainFrameURL = "https://www.youtube.com/"
        case 5:
            webView?.mainFrameURL = "https://github.com/naokits/ManzaiVideoPlayer/blob/dev/ManzaiVideoPlayer/FirstViewController.swift#L20-L31"
        default:
            displayLocalHTML()
            count = 0
        }
        count++
    }

    func displayLocalHTML() {
        let resourcePath = NSBundle.mainBundle().resourcePath
        let dir = NSString(format: "file://%@/html", resourcePath!)
        let path = dir.stringByAppendingPathComponent("index.html")
        // パスは正しいが、内容が表示されない
        webView?.mainFrameURL = path
    }
}


/*
extension String {
    
    /// String -> NSString に変換する
    func to_ns() -> NSString {
        return (self as NSString)
    }
    
    func substringFromIndex(index: Int) -> String {
        return to_ns().substringFromIndex(index)
    }
    
    func substringToIndex(index: Int) -> String {
        return to_ns().substringToIndex(index)
    }
    
    func substringWithRange(range: NSRange) -> String {
        return to_ns().substringWithRange(range)
    }
    
    var lastPathComponent: String {
        return to_ns().lastPathComponent
    }
    
    var pathExtension: String {
        return to_ns().pathExtension
    }
    
    var stringByDeletingLastPathComponent: String {
        return to_ns().stringByDeletingLastPathComponent
    }
    
    var stringByDeletingPathExtension: String {
        return to_ns().stringByDeletingPathExtension
    }
    
    var pathComponents: [String] {
        return to_ns().pathComponents
    }
    
    var length: Int {
        return self.characters.count
    }
    
    func stringByAppendingPathComponent(path: String) -> String {
        return to_ns().stringByAppendingPathComponent(path)
    }
    
    func stringByAppendingPathExtension(ext: String) -> String? {
        return to_ns().stringByAppendingPathExtension(ext)
    }
    
}
*/