//
//  ViewController.swift
//  RACPlayground
//
//  Created by Naoki Tsutsui on 8/2/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import Result
import RxSwift
import RxCocoa
import youtube_ios_player_helper
import ObjectiveC


class ViewController: UIViewController, UIWebViewDelegate {
    
    let viewModel = ViewModel()
    
    // MARK: - YouTubeDataApi_iOS myKey
//    let YouTubeApiKey = "AIzaSyCBGyBYhnXtLV1A6VPEvrbOw8Vg9_NyYiQ"
    
    // MARK: - ディスプレイサイズ取得
    let displayWidth = UIScreen.mainScreen().bounds.size.width
    let displayHeight = UIScreen.mainScreen().bounds.size.height

    
    // MARK: - Properties
    
    @IBOutlet weak var playerView: YTPlayerView!
    @IBOutlet weak var TitleLabel: UILabel!
    @IBOutlet weak var PlayerHeightConstraint: NSLayoutConstraint!
    
    @IBOutlet weak var playButton: UIButton!
    @IBOutlet weak var playtimeSlider: UISlider!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var previousButton: UIButton!
    @IBOutlet weak var shuffleButton: UIButton!
    @IBOutlet weak var repeatButton: UIButton!
    
    var movieList: [String] = ["ON3cyF0vIjM", "hFCJ-3Y5rkM", "UeYqDQ3wxps"]

    
    var PlayerWidth: String!   // Playerの幅
    var PlayerHeight: String!  // Playerの高さ
    
    
    // 自動的にunsubscribeするために使用する
    let disposeBag = DisposeBag()


    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.setup()
    }
    
    override func viewDidAppear(animated: Bool) {
        let videoid = self.movieList[0]
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
//            "controls": 0,
//            "showinfo": 0,
            "autoplay": 0,
//            "autohide": 1,
            "modestbranding": 1,
            "origin": "https://www.youtube.com/"
            ])
    }

    // MARK: - Setup
    
    func setup() {
        setupUI()
        self.playerView.delegate = self
        
        self.playButton.rx_tap
            .subscribeNext { _ in
                print("rx_tap: ボタンがタップされた")
                self.playerView.playVideo()
            }.addDisposableTo(disposeBag)
        
        self.playButton.rx_controlEvent(UIControlEvents.TouchUpInside)
            .subscribeNext { event in
                print("rx_controlEvent: ボタンがタップされた > \(event)")
            }.addDisposableTo(self.disposeBag)
        
        let h = Hoge()
        h.doSomething()
    }
    
    func setupUI() {
//        self.setupPlayerSize()
        
        self.shuffleButton.rx_tap
            .subscribeNext { [weak self] in
                self?.viewModel.tappedShuffleButton()
        }.addDisposableTo(disposeBag)
        
        // ViewModel -> UIButtonのenabled

    }
    
    func setupPlayerSize() {
        // Playerのサイズを計算
        let width: Int = Int(displayWidth)
        self.PlayerWidth = String(width)
        let Height = displayWidth / 1.77777777777778
        let height: Int = Int(Height)
        self.PlayerHeight = String(height)
    }
}

extension ViewController: YTPlayerViewDelegate {
    func playerViewDidBecomeReady(playerView: YTPlayerView) {
        log.debug("準備完了")
        self.playButton.enabled = true
    }
    
    func playerView(playerView: YTPlayerView, didChangeToState state: YTPlayerState) {
        switch state {
        case .Unstarted:
            log.debug("停止中")
        case .Ended:
            log.debug("再生終了")
//            self.isPlaying = false
        case .Playing:
            log.debug("再生中")
            self.playButton.enabled = true
            self.playButton.titleLabel?.text = "一時停止"
        case .Paused:
            log.debug("一時停止中")
            self.playButton.titleLabel?.text = "再生"

//            if self.isBackgroundPlay {
//                log.debug("バックグラウンドで再生する")
//                playerView.playVideo()
//                self.isBackgroundPlay = false
//            }
        case .Buffering:
            log.debug("バッファリング中")
            self.playButton.enabled = false
        case .Queued:
            log.debug("キューに入った")
        default:
            print("デフォルト")
        }
    }

/*
    func playerView(playerView: YTPlayerView, didPlayTime playTime: Float) {
        let progress = NSTimeInterval(playTime) / self.playerView.duration()
        log.debug("再生時間: \(progress)")
//        self.playtimeSlider.value = Float(progress)
    }
*/
    
}

