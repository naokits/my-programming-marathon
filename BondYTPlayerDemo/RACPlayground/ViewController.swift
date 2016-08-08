//
//  ViewController.swift
//  RACPlayground
//
//  Created by Naoki Tsutsui on 8/2/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit
import Bond
import youtube_ios_player_helper
import ObjectiveC


class ViewController: UIViewController, UIWebViewDelegate {
    
    let viewModel = ViewModel()
    
    // MARK: - YouTubeDataApi_iOS myKey
    // let YouTubeApiKey = "AIzaSyCBGyBYhnXtLV1A6VPEvrbOw8Vg9_NyYiQ"
    
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
    
//    var shuffledVideoList: [String]?
//    var videoList = ["YvzB97ge80g"]
    
    var PlayerWidth: String!   // Playerの幅
    var PlayerHeight: String!  // Playerの高さ
    
    // 自動的にunsubscribeする場合に使用する
    let disposeBag = DisposeBag()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        self.playerView.delegate = self
        self.loadCurrentVideo()
    }
    
    override func viewDidAppear(animated: Bool) {
        self.setup()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Misc
    
    func loadVideo(moveID: String) {
        self.playerView.loadWithVideoId(moveID, playerVars: [
            "playsinline":0,
            "rel": 0,
            "controls": 1,
            "showinfo": 0,
            "autoplay": 0,
            "autohide": 1,
            "modestbranding": 1,
            "origin": "https://www.youtube.com/"
            ])
    }
    
    // MARK: - Setup
    
    func setup() {
        
        self.setupUI()
        self.setupObserver()
        self.setupBind()
    }
    
    func setupBind() {
        self.viewModel.playerState.map { (state) -> String in
            var str = ""
            
            switch state {
            case .Unstarted:
//                str = "停止中"
                str = "▶️"
                self.playButton.enabled = true
            case .Ended:
//                str = "再生終了"
                str = "▶️"
                if self.viewModel.repeatButtonState.value == RepeatStateType.One {
                    self.loadCurrentVideo()
//                    self.playerView.stopVideo()
//                    self.playerView.playVideo()
                } else {
                    if self.viewModel.repeatButtonState.value == RepeatStateType.All {
                        self.viewModel.nextVideoIndex()
                    }
                }
            case .Playing:
                self.playButton.enabled = true
                self.playButton.tintColor = UIColor.redColor()
//                return "再生中"
                return "⏸"
            case .Paused:
//                str = "一時停止中"
                str = "▶️"
                //            if self.isBackgroundPlay {
                //                log.debug("バックグラウンドで再生する")
                //                playerView.playVideo()
                //                self.isBackgroundPlay = false
            //            }
            case .Buffering:
                self.playButton.enabled = false
//                str = "読込中"
                str = "🔄"
            case .Queued:
                str = "キュー"
            default:
                str = "デフォルト"
            }
            return str
        }.bindTo(self.playButton.bnd_title)
     
        self.viewModel.shuffleButtonState.map { (state) -> String in
            if self.viewModel.isShuffle() {
                self.viewModel.shufflePlaylist()
                return "🔀"
            } else {
                return String("S:\(state)")
            }
        }.bindTo(self.shuffleButton.bnd_title)

        self.viewModel.repeatButtonState.map({ (state) -> String in
            print(state)
            if state == RepeatStateType.One {
                return "🔂"
            } else if state == RepeatStateType.All {
                return "🔁"
            } else {
                return String("R:\(state)")
            }
        }).bindTo(self.repeatButton.bnd_title)
    }
    
    func setupObserver() {
        self.playButton.bnd_tap.observe { _ in
            print("再生ボタンがタップされた: \(self.viewModel.playerState.value.rawValue)")
            if self.viewModel.isPlayingVideo() {
                self.playerView.pauseVideo()
            } else if self.viewModel.isEndedVideo() {
                self.loadCurrentVideo()
                self.playerView.playVideo()
            } else {
                self.playerView.playVideo()
            }
        }
        
        self.shuffleButton.bnd_tap.observe { _ in
            self.viewModel.updateShuffleState()
        }
        
        self.repeatButton.bnd_tap.observe { _ in
            self.viewModel.updateRepeatState()
        }
        
        self.previousButton.bnd_tap.observe { (_) in
            self.viewModel.previousVideoIndex()
        }
        
        self.nextButton.bnd_tap.observe { (_) in
            self.viewModel.nextVideoIndex()
        }
        
        self.viewModel.currentPlayListIndex.observeNew { (index) in
            log.debug("インデックス: \(index)")
            log.info("再生中のビデオを停止してから、\(self.viewModel.playlist.value[index]) のビデオをローディング")
            self.playerView.stopVideo()
            let videoid = self.viewModel.playlist.value[index]
            self.loadVideo(videoid)
        }
        
        self.viewModel.playlist.observe { (playlist) in
            print("プレイリスト: \(playlist)")
        }
    }
    
    func setupUI() {

        // self.setupPlayerSize()
        self.allDisablePlayerButton()
    }
    
    func setupPlayerSize() {
        // Playerのサイズを計算
        let width: Int = Int(displayWidth)
        self.PlayerWidth = String(width)
        let Height = displayWidth / 1.77777777777778
        let height: Int = Int(Height)
        self.PlayerHeight = String(height)
    }

    // 現在の再生インデックスの動画をロードする
    func loadCurrentVideo() {
        let index = self.viewModel.currentPlayListIndex.value
        let videoid = self.viewModel.playlist.value[index]
        self.loadVideo(videoid)
    }

    private func allDisablePlayerButton() {
        self.playButton.enabled = false
        self.previousButton.enabled = false
        self.nextButton.enabled = false
        self.shuffleButton.enabled = false
        self.repeatButton.enabled = false
    }
}


// MARK: - YTPlayerViewDelegate

/**
 * A delegate for ViewControllers to respond to YouTube player events outside
 * of the view, such as changes to video playback state or playback errors.
 * The callback functions correlate to the events fired by the IFrame API.
 * For the full documentation, see the IFrame documentation here:
 *     https://developers.google.com/youtube/iframe_api_reference#Events
 */
extension ViewController: YTPlayerViewDelegate {
    /**
     * Invoked when the player view is ready to receive API calls.
     *
     * @param playerView The YTPlayerView instance that has become ready.
     */
    func playerViewDidBecomeReady(playerView: YTPlayerView) {
        log.debug("準備完了")
        self.playButton.enabled = true
        
        if self.viewModel.playlist.value.count > 0 {
            self.previousButton.enabled = true
            self.nextButton.enabled = true
            self.repeatButton.enabled = true
            self.shuffleButton.enabled = true
        }
        self.playerView.playVideo()
    }
    
    /**
     * Callback invoked when player state has changed, e.g. stopped or started playback.
     *
     * @param playerView The YTPlayerView instance where playback state has changed.
     * @param state YTPlayerState designating the new playback state.
     */
    func playerView(playerView: YTPlayerView, didChangeToState state: YTPlayerState) {
        log.debug(state.rawValue)
        self.viewModel.updatePlayState(state)
    }
    
    /**
     * Callback invoked when an error has occured.
     *
     * @param playerView The YTPlayerView instance where the error has occurred.
     * @param error YTPlayerError containing the error state.
     */
    func playerView(playerView: YTPlayerView, receivedError error: YTPlayerError) {
        log.error(error.rawValue)
    }
    
    /**
     * Callback invoked when playback quality has changed.
     *
     * @param playerView The YTPlayerView instance where playback quality has changed.
     * @param quality YTPlaybackQuality designating the new playback quality.
     */
    func playerView(playerView: YTPlayerView, didChangeToQuality quality: YTPlaybackQuality) {
        // log.debug(quality.rawValue)
    }
    
    /**
     * Callback invoked frequently when playBack is plaing.
     *
     * @param playerView The YTPlayerView instance where the error has occurred.
     * @param playTime float containing curretn playback time.
     */
    func playerView(playerView: YTPlayerView, didPlayTime playTime: Float) {
        // let progress = NSTimeInterval(playTime) / self.playerView.duration()
        // log.debug("再生時間: \(progress)")
        // self.playtimeSlider.value = Float(progress)
    }
}
