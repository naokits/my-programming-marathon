//
//  FirstViewController.swift
//  DrunkCheker
//
//  Created by naokits on 9/16/15.
//  Copyright (c) 2015 nkapp. All rights reserved.
//

import UIKit

class FirstViewController: UIViewController {
    
    var drunkLevel: Utils.DrunkLevel = Utils.DrunkLevel.Level0 {
        didSet {
            print("変更")
            print(drunkLevel)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        self.hoge()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
    func hoge() {
        let utils = Utils()
        let bloodAlcoholLevel = utils.calcBloodAlcoholLevel(3000.0, weight: 75.0)
        print(bloodAlcoholLevel)
//        utils.judge(bloodAlcoholLevel)
        
        drunkLevel = Utils.DrunkLevel.init(bloodAlcoholLevel: bloodAlcoholLevel)
//        print(drunkLevel)
    }

}

