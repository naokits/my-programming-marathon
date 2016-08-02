//
//  ViewController.swift
//  RACPlayground
//
//  Created by Naoki Tsutsui on 8/2/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import ReactiveCocoa
import youtube_ios_player_helper

class ViewController: UIViewController, UIWebViewDelegate {
    
    // MARK: - YouTubeDataApi_iOS myKey
    let YouTubeApiKey = "AIzaSyCBGyBYhnXtLV1A6VPEvrbOw8Vg9_NyYiQ"
    
    // MARK: - ディスプレイサイズ取得
    let displayWidth = UIScreen.mainScreen().bounds.size.width
    let displayHeight = UIScreen.mainScreen().bounds.size.height

    
    // MARK: - Properties
    
    @IBOutlet weak var playerView: YTPlayerView!
    @IBOutlet weak var TitleLabel: UILabel!
    @IBOutlet weak var PlayerHeightConstraint: NSLayoutConstraint!
    
    @IBOutlet weak var playButton: UIButton!
    @IBOutlet weak var playtimeSlider: UISlider!
    
    var movieList: [String] = []

    
    var PlayerWidth: String!   // Playerの幅
    var PlayerHeight: String!  // Playerの高さ
    
    // バックグラウンド再生の制御で使用
    var isBackgroundPlay = false


    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        // Playerのサイズを計算
        let width: Int = Int(displayWidth)
        self.PlayerWidth = String(width)
        let Height = displayWidth / 1.77777777777778
        let height: Int = Int(Height)
        self.PlayerHeight = String(height)
        // PlayerHeightConstraint.constant = Height - 1  //謎の1pxの隙間ができるためマイナスする
    }
    
    override func viewDidAppear(animated: Bool) {
        let videoid = "ON3cyF0vIjM"
//        let videoid = "https://www.youtube.com/watch?v=ON3cyF0vIjM"
        self.loadVideo(videoid)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Misc
    
    // FIXME: スペルミスを修正すること
    func loadVideo(moveID: String) {
        self.playerView.loadWithVideoId(moveID, playerVars: [
            "playsinline":1,
            "rel": 0,
            "controls": 0,
            "showinfo": 0,
            "autoplay": 0,
            "autohide": 1,
            "modestbranding": 1,
            "origin": "https://www.youtube.com/"
            ])
    }


}

