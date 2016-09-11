//
//  ViewModel.swift
//  RACPlayground
//
//  Created by Naoki Tsutsui on 8/3/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Foundation
import RxSwift
import RxCocoa
import ObjectiveC

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
 
 リピートボタンUI操作でのみ変更される
 状態の変更は、オフ、1曲リピート、全曲リピートという順序で変更される
 状態が変更されたら、ボタンのタイトルも変更する
 
 シャッフルボタンUI操作でのみ変更される
 状態の変更は、オフ、オンという順序で変更される
 状態が変更されたら、ボタンのタイトルも変更する
 */

// MARK: - States

/// 管理する各種状態の定義
struct AppState {
//struct AppState: StateType {
    
    // 再生状態（再生 or 一時停止）
    var playState: PlayStateType = .Pause
    
    // シャッフルの状態
    var shuffleState = false
    
    // リピート状態（オフ、1曲リピート、全曲リピート）
    var repeaStatet: RepeatStateType = .Off
    
    // 再生中のビデオID
    var playingVideoId = ""
    
    // 選択中のプレイリスト
    var playlistId: Int = 0
    
    var playerState = PlayerState()
}

struct PlayerState {
    // 再生状態（再生 or 一時停止）
    var playState: PlayStateType = .Pause
    
    // シャッフルの状態
    var shuffleState = false
    
    // リピート状態（オフ、1曲リピート、全曲リピート）
    var repeaStatet: RepeatStateType = .Off
}



class Dog: NSObject {

    var event: Observable<String>?
    
    override init() {
        
    }

}

class Hoge {
    private let eventSubject = PublishSubject<String>()
    
    var event: Observable<String> { return eventSubject }
    
    func doSomething() {
        // 略
        eventSubject.onNext("イベントが発行されました")  // イベント発行
    }
}

/*
class Presenter {
    private let buttonHiddenSubject = BehaviorSubject(value: false)
    
    var buttonHidden: Observable<Bool> { return buttonHiddenSubject }
    
    func start() {
        buttonHidden.doOnNext { (<#Bool#>) in
            <#code#>
        }
        buttonHidden.onNext(true)
        // ...
    }
    
    func stop() {
        buttonHidden.onNext(false)
        // ...
    }
}
*/


class ViewModel {
    // バックグラウンド再生の制御で使用
    var isBackgroundPlay = false
    
    
    let enableShuffleButton: Observable<Bool>
    
//    let shuffleButton: Observable<Bool>
    


    var dog = Dog()

    init() {
//        // 3文字以上だったらボタンをenbaleにする
//        enableLoginButton = Observable.combineLatest(userName.asObservable(), password.asObservable()) {
//            $0.0.characters.count >= 3 && $0.1.characters.count >= 3
//        }
        
        enableShuffleButton = Observable.combinela
    }

    func hoge() {
        let disposable = dog.event?.subscribe(onNext: { (value) in
            // 通常処理
            print("通常処理")
            }, onError: { (errortype) in
                print(errortype)
            }, onCompleted: { 
                print("終了")
            }, onDisposed: { 
                print("購読解除")
        })
        
        // 購読解除
        disposable?.dispose()
    }
    
    func tappedShuffleButton() {
        print("たっぷ")
    }
    

}