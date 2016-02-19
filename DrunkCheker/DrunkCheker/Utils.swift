//
//  Utils.swift
//  DrunkCheker
//
//  Created by naokits on 9/16/15.
//  Copyright (c) 2015 nkapp. All rights reserved.
//

import Foundation

// お酒情報
struct Alcohol {
    var name: String
    var percentate: Float
    var group: String // ビールかウィスキーかなど
}

public struct Utils {
    enum DrunkLevel {
        case Level0, Level1, Level2, Level3, Level4, Level5, Level6
        
        // 引数ありコンストラクタ
        init(bloodAlcoholLevel: Float) {
            switch bloodAlcoholLevel {
            case 0..<0.02:
                print("飲み始め: \(bloodAlcoholLevel)")
                self = .Level0
            case 0.02...0.04:
                print("爽快期: \(bloodAlcoholLevel)")
                self = .Level1
            case 0.05...0.10:
                print("ほろよい期: \(bloodAlcoholLevel)")
                self = .Level2
            case 0.11...0.15:
                print("酩酊初期: \(bloodAlcoholLevel)")
                self = .Level3
            case 0.16...0.30:
                print("酩酊期: \(bloodAlcoholLevel)")
                self = .Level4
            case 0.31...0.40:
                print("泥酔期: \(bloodAlcoholLevel)")
                self = .Level5
            case 0.41...0.50:
                print("昏睡期: \(bloodAlcoholLevel)")
                self = .Level6
            case 0.51..<1.00:
                self = .Level6
            default:
                print("当てはまるものがない")
                self = .Level0
            }
        }
    }
    
    /// 係数
    private let coefficient = Float(833)
    /// アルコールの比重
    private let alcoholeDensity = Float(0.8)

    /// 体重（Kg）
    var weight: Float = Float(0.0)
    /// 飲酒量（ml）
    var drinkedAmount: Float = Float(0.0)
    /// アルコール度数（%）
    var alcoholPercentage = Float(7.0) // RedHorse
//    static let alcoholPercentage = Float(40.0) // Tanduai 5 Years
    /// 血中アルコール濃度（%）
    var bloodAlcoholLevel = Float(0.0)
    
    /// 摂取した純アルコール量 (g)
    var alcoholAmount: Float {
        get {
            return drinkedAmount * (alcoholPercentage / 100.0) * alcoholeDensity
        }
    }
    
    // 摂取したアルコールが消失するまでの時間
    var time: Float {
        get {
            return alcoholAmount / 5.0
        }
    }
    
    /// 飲酒量（ml） x アルコール度数（%） x アルコールの比重（0.8） = 純アルコール量（g）
    func calcAlcoholAmount(drinkedAmount: Float) -> Float {
        let alcoholAmount = drinkedAmount * (alcoholPercentage / 100.0) * alcoholeDensity
        return alcoholAmount
    }
    
    /// 摂取したアルコールが消失するまでの時間を算出します
    ///
    /// http://www.kirin.co.jp/csv/arp/self_check/check_list.html
    /// :parameter: alcoholAmount 摂取した純アルコール量
    /// :return: vanishHour アルコールが消失するまでの時間
    func calcVanishHour(alcoholAmount: Float) -> Float {
        let vanishHour = alcoholAmount / 5.0
        return vanishHour
    }
    
    /// 酔いの状態を判別する
    func judge(bloodAlcoholLevel: Float) {
        switch bloodAlcoholLevel {
        case 0..<0.02:
            print("飲み始め")
        case 0.02...0.04:
            print("爽快期")
        case 0.05...0.10:
            print("ほろよい期")
        case 0.11...0.15:
            print("酩酊初期")
        case 0.16...0.30:
            print("酩酊期")
        case 0.31...0.40:
            print("泥酔期")
        case 0.41...0.50:
            print("昏睡期")
        default:
            print("当てはまるものがない")
        }
    }
    
    func calcBloodAlcoholLevel(drinkedAmount: Float, weight: Float) -> Float {
        // 血中アルコール濃度の算出
        let bloodAlcoholLevel = (drinkedAmount * alcoholPercentage) / (weight * coefficient)
        
//        self.judge(bloodAlcoholLevel)
        
        return bloodAlcoholLevel
    }

    // 飲酒速度、二日酔い防止
}




