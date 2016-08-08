//: Playground - noun: a place where people can play

import UIKit
import XCPlayground
import RxSwift
import RxCocoa

XCPlaygroundPage.currentPage.needsIndefiniteExecution = true

enum HogeType: UInt32 {
    case Type1
    case Type2
}

//let hoge = Observable<Int>.interval(1.0, scheduler: MainScheduler.instance)
//    .map { _ in HogeType(rawValue: 1)
//    print("")
//}

//let trigger = [hoge, hoge]
//.zip { $0 }
//.skip(1)

//_ = hoge.takeUntil(hoge)
//.subscribe(onNext: {
//    print("hgoe")
//    }, onError: { (error) in
//        print(error)
//    }, onCompleted: { 
//        print("終了")
//    }, onDisposed: { 
//        print("解除")
//})

//func hogehoge() {
//    let scheduler = MainScheduler.instance
// Observable<Int>
//    .interval(1.0, scheduler: scheduler)
//    .subscribeOn(scheduler)
//    .flatMapFirst { _ in
//        print("hogehgoe")
//    }
//}

class ViewModel {
    let isUpdated = Observable<Void>()
    
    private func didSomething() {
        isUpdated.next()
    }
}



//class User {
//    let id: Int
//    let name: String
//    
//    init(id: Int, name: String) {
//        self.id = id
//        self.name = name
//    }
//}

struct User {
    let id: Int
    let name: String
}

class UserContainer {
    let user: User
    init(user: User) {
        self.user = user
    }
}

let user = User(id: 1, name: "naokits")

NSNotificationCenter.defaultCenter.postNotificationName("hogeNotification", object: nil, userInfo: ["user": UserContainer(user: user)])


