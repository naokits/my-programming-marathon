//
//  CustomButton.swift
//  IBDesignableDemo
//
//  Created by Naoki Tsutsui on 1/29/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import UIKit

@IBDesignable

class CustomButton: UIButton {

    @IBInspectable var textColor: UIColor?
    
    @IBInspectable var cornerRadius: CGFloat = 0 {
        didSet {
            layer.cornerRadius = cornerRadius
        }
    }
    
    @IBInspectable var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
        }
    }
    
    @IBInspectable var borderColor: UIColor = UIColor.clearColor() {
        didSet {
            layer.borderColor = borderColor.CGColor
        }
    }
    
}
