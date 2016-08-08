//
//  ViewModel.swift
//  RACPlayground
//
//  Created by Naoki Tsutsui on 8/3/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation
import Bond
import youtube_ios_player_helper

// MARK: - State Type

enum RepeatStateType {
    case Off, One, All
}

enum ShuffleStateType {
    case Off, On
}

enum PlayStateType {
    case Pause
    case Play
    case TogglePlayPause
    case PreviousTrack
    case NextTrack
}

/*: 状態の要件
 
 リピートボタン
 状態の変更は、オフ、1曲リピート、全曲リピートという順序で変更される
 状態が変更されたら、ボタンのタイトルも変更する
 
 シャッフルボタン
 状態の変更は、オフ、オンという順序で変更される
 状態が変更されたら、ボタンのタイトルも変更する
 */

// MARK: - States

/// 管理する各種状態の定義

struct PlayerState {
    // 再生状態（再生 or 一時停止）
    var playState: PlayStateType = .Pause
    
    // シャッフルの状態
    var shuffleState = false
    
    // リピート状態（オフ、1曲リピート、全曲リピート）
    var repeaStatet: RepeatStateType = .Off
}


struct ViewModel {
    // MARK: - Properties
    
    // バックグラウンド再生の制御で使用
    var isBackgroundPlay = false
    
    var isAutoPlay = false
    
    let playerState = Observable<YTPlayerState>(.Unstarted)
    let shuffleButtonState = Observable<ShuffleStateType>(.Off)
    let repeatButtonState = Observable<RepeatStateType>(.Off)

    // プレイリスト
    let playlist = Observable<[String]>([""])

    // 再生順を格納したビデオID文字列の配列
    let playIndexes = Observable<[String]>([""])

    // 再生中のインデックス
    let currentPlayListIndex = Observable<Int>(0)

    // 自動再生
    let autoPlay = Observable<Bool>(false)
    
    let sf5Videos = ["isbHSb-dw5s", "F5lPWmPPpxI", "xNkAE09eCgw", "ON3cyF0vIjM", "hFCJ-3Y5rkM", "UeYqDQ3wxps"]
    let insectVideos = ["HhkN4dZjv2c", "hJGvRkOZ2xk", "Zdd5s73HEbs"]
    let miscVideos = ["vKoMlGEeZAk", "YvzB97ge80g", "aRpgTYeE0RE", "isbHSb-dw5s", "SpoAOzDmndk", "ilAB8JRMlcM", "bNJJkkW0dDU"]
    let originalPlaylist = ["vKoMlGEeZAk", "YvzB97ge80g", "aRpgTYeE0RE", "isbHSb-dw5s", "SpoAOzDmndk", "ilAB8JRMlcM"]
    let musicVideos = ["_Q5-4yMi-xg", "W6QjKT1A2pI", "NshFw-eUj4c", "wDIUyyQqQ_M"]
    let problemVideos = ["ZwE1imnpim0", "bj5RSMOct2E"]
    
    // MARK: - Initialize

    init() {
        playlist.value = musicVideos
//        playlist.value = problemVideos
    }

    
    // MARK: - Functions

    func updatePlayState(state: YTPlayerState) {
        self.playerState.value = state
    }
    
    func isPlayingVideo() -> Bool {
        return playerState.value == .Playing
    }
    
    func isEndedVideo() -> Bool {
        return playerState.value == .Unstarted
    }
    
    func updateRepeatState() {
        var stateValue = self.repeatButtonState.value
        if stateValue == RepeatStateType.Off {
            stateValue = .One
        } else if stateValue == RepeatStateType.One {
            stateValue = .All
        } else if stateValue == RepeatStateType.All {
            stateValue = RepeatStateType.Off
        } else {
            stateValue = RepeatStateType.Off
        }
        
        self.repeatButtonState.value = stateValue
    }
    
    func isRepeat() -> Bool {
        return self.repeatButtonState.value == RepeatStateType.Off ? false : true
    }

    func updateShuffleState() {
        var stateValue = self.shuffleButtonState.value
        if stateValue == ShuffleStateType.Off {
            stateValue = ShuffleStateType.On
        } else if stateValue == ShuffleStateType.On {
            stateValue = ShuffleStateType.Off
        } else {
            stateValue = ShuffleStateType.Off
        }
        
        shuffleButtonState.value = stateValue
    }
    
    func isShuffle() -> Bool {
        if self.shuffleButtonState.value == .On {
            return true
        } else {
            return false
        }
    }
    
    func shufflePlaylist() {
        let list = self.playlist.value
        self.playlist.value.shuffle(list.count)
        // シャッフルしたので、再生インデックスを先頭にする
        self.currentPlayListIndex.value = 0
        print("シャッフル後のリスト: \(self.playlist.value)")
    }

    func nextVideoIndex() {
        if self.currentPlayListIndex.value < self.playlist.value.count-1 {
            self.currentPlayListIndex.value += 1
        } else {
            // インデックスを先頭に戻す
            self.currentPlayListIndex.next(0)
        }
    }

    func previousVideoIndex() {
        if self.currentPlayListIndex.value > 0 {
            self.currentPlayListIndex.value -= 1
        }
    }
}

// MARK: - Misc View Model

class TimeViewModel : NSObject {
    
    let timestamp = Observable<NSDate>(NSDate())
    
    override init() {
        super.init()
        NSTimer.scheduledTimerWithTimeInterval(1.0, target: self, selector: #selector(TimeViewModel.onUpdate(_:)), userInfo: nil, repeats: true)
        
    }
    
    func onUpdate(timer : NSTimer){
        timestamp.value = NSDate()
    }
}

//---------------------------------------------------------------------

/*

enum RequestState {
    case None
    case Requesting
    case Error
}

protocol RequestListStateType {
    associatedtype Item
    var items: ObservableArray<Item> { get }
    var requestState: Observable<RequestState> { get }
    var hasVisibleItems: Observable<Bool> { get }
}

extension RequestListStateType {
    func binding() {
        items
            .map { $0.sequence.count > 0 }
            .bindTo(hasVisibleItems)
    }
}

protocol RequestListType: RequestListStateType {}
extension RequestListType {
    func hoge() {
        self.requestState.value = .None
    }
}

struct RequestListViewModel<T>: RequestListType {
    typealias Item = T
    let items = ObservableArray([])
    let requestState = Observable<RequestState>(.None)
    let hasVisibleItems = Observable<Bool>(false)

    init() {
        binding()
    }
}
 
 */

// 配列をシャッフルするメソッドを追加

extension Array {
    mutating func shuffle(count: Int) {
        for _ in 0..<count {
            self.sortInPlace({ (_, _) -> Bool in
                arc4random() < arc4random()
            })
        }
    }
}

extension NSMutableArray {
    func shuffle(count: Int) {
        for i in 0..<count {
            let nElements: Int = count - i
            let n: Int = Int(arc4random_uniform(UInt32(nElements))) + i
            self.exchangeObjectAtIndex(i, withObjectAtIndex: n)
        }
    }
}

