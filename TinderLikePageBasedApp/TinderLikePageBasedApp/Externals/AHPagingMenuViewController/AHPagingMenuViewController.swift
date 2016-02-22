//
//  AHPagingMenuViewController.swift
//  VERSION 1.0 - LICENSE MIT
//
//  Menu Slider Page! Enjoy
//  Swift Version
//
//  Created by André Henrique Silva on 01/04/15.
//  Bugs? Send -> andre.henrique@me.com  Thank you!
//  Copyright (c) 2015 André Henrique Silva. All rights reserved. http://andrehenrique.me =D
//

import UIKit
import ObjectiveC

@objc protocol AHPagingMenuDelegate
{
    /**
    Change position number
    
    - parameter form: position initial
    - parameter to:   position final
    */
    optional func AHPagingMenuDidChangeMenuPosition(form: NSInteger, to: NSInteger);
    
    /**
    Change position obj
    
    - parameter form: obj initial
    - parameter to:   obj final
    */
    optional func AHPagingMenuDidChangeMenuFrom(form: AnyObject, to: AnyObject);
}


var AHPagingMenuViewControllerKey: UInt8 = 0
extension UIViewController {
    
    func setAHPagingController(menuViewController: AHPagingMenuViewController)
    {
        self.willChangeValueForKey("AHPagingMenuViewController")
        objc_setAssociatedObject(self,  &AHPagingMenuViewControllerKey, menuViewController, objc_AssociationPolicy.OBJC_ASSOCIATION_ASSIGN)
        self.didChangeValueForKey("AHPagingMenuViewController")
    }
    
    func pagingMenuViewController() -> AHPagingMenuViewController
    {
        
        let controller = objc_getAssociatedObject(self, &AHPagingMenuViewControllerKey) as! AHPagingMenuViewController;
        return controller;
    }
    
}


class AHPagingMenuViewController: UIViewController, UIScrollViewDelegate
{
    
    //Privates
    internal var bounce:          Bool!
    internal var fade:            Bool!
    internal var transformScale:  Bool!
    internal var showArrow:       Bool!
    internal var changeFont:      Bool!
    internal var changeColor:     Bool!
    internal var currentPage:     NSInteger!
    internal var selectedColor:   UIColor!
    internal var dissectedColor:  UIColor!
    internal var selectedFont:    UIFont!
    internal var dissectedFont:   UIFont!
    internal var scaleMax:        CGFloat!
    internal var scaleMin:        CGFloat!
    internal var viewControllers: NSMutableArray?
    internal var iconsMenu:       NSMutableArray?
    internal var delegate:        AHPagingMenuDelegate?
    
    internal var NAV_SPACE_VALUE:  CGFloat = 15.0
    internal var NAV_HEIGHT:       CGFloat = 45.0 + (UIApplication.sharedApplication().statusBarFrame.size.height)
    internal var NAV_TITLE_SIZE:   CGFloat = 30.0
    
    //Publics
    private var navView:       UIView?
    private var navLine:       UIView?
    private var viewContainer: UIScrollView?
    private var arrowRight:    UIImageView?
    private var arrowLeft:     UIImageView?
    
    // MARK: inits
    
    required init?(coder aDecoder: NSCoder)
    {
        super.init(coder: aDecoder);
        self.inicializeValues(NSArray(), iconsMenu: NSArray(),  position:   0)
    }
    
    init(controllers:NSArray, icons: NSArray)
    {
        super.init(nibName: nil, bundle: nil);
        self.inicializeValues(controllers, iconsMenu: icons , position: 0)
    }
    
    init( controllers:(NSArray), icons: (NSArray), position:(NSInteger))
    {
        super.init(nibName: nil, bundle: nil)
        self.inicializeValues(controllers, iconsMenu: icons, position: position)
    }
    
    // MARK: Cycle Life
    
    override func loadView()
    {
        super.loadView()
        self.view.backgroundColor = UIColor.whiteColor();
        
        let viewConteiner                            = UIScrollView()
        viewConteiner.delegate                       = self
        viewConteiner.pagingEnabled                  = true
        viewConteiner.showsHorizontalScrollIndicator = false
        viewConteiner.showsVerticalScrollIndicator   = false
        viewConteiner.contentSize                    = CGSizeMake(0,0)
        self.view.addSubview(viewConteiner)
        self.viewContainer = viewConteiner
        
        let navView                                  = UIView()
        navView.backgroundColor                      = UIColor.whiteColor()
        navView.clipsToBounds                        = true
        self.view.addSubview(navView)
        self.navView                                 = navView
        
        let arrowRight = UIImageView(image: UIImage(named:"arrowRight"))
        arrowRight.userInteractionEnabled = true
        arrowRight.addGestureRecognizer(UITapGestureRecognizer(target:self, action:Selector("goNextView")))
        arrowRight.image = arrowRight.image?.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        self.navView?.addSubview(arrowRight)
        self.arrowRight = arrowRight;
        
        let arrowLeft = UIImageView(image: UIImage(named:"arrowLeft"))
        arrowLeft.userInteractionEnabled = true
        arrowLeft.addGestureRecognizer(UITapGestureRecognizer(target:self, action:Selector("goPrevieusView")))
        arrowLeft.image = arrowLeft.image?.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
        self.navView?.addSubview(arrowLeft)
        self.arrowLeft = arrowLeft
        
        let navLine = UIView()
        navLine.backgroundColor = UIColor(white: 0.8, alpha: 1.0)
        self.view.addSubview(navLine)
        self.navLine = navLine
        
    }
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        var count = 0
        for controller in self.viewControllers!
        {
            self.includeControllerOnInterface(controller as! UIViewController, titleView: self.iconsMenu!.objectAtIndex(count) as! UIView, tag: count)
            count++
        }
        
        self.viewContainer?.setContentOffset(CGPointMake(CGFloat(self.currentPage!) * self.viewContainer!.frame.size.width, self.viewContainer!.contentOffset.y), animated: false)
        
    }
    
    override func viewDidAppear(animated: Bool)
    {
        super.viewDidAppear(animated)
        self.resetNavBarConfig();
    }
    
    override func viewDidLayoutSubviews()
    {
        super.viewDidLayoutSubviews()
        
        NAV_HEIGHT = 45.0 + UIApplication.sharedApplication().statusBarFrame.size.height
        self.viewContainer?.frame = CGRectMake(0, NAV_HEIGHT, self.view.frame.size.width, self.view.frame.size.height - NAV_HEIGHT)
        self.viewContainer?.contentOffset = CGPointMake(CGFloat(self.currentPage) * self.viewContainer!.frame.size.width, self.viewContainer!.contentOffset.y)
        self.arrowLeft?.center = CGPointMake( NAV_SPACE_VALUE, self.navView!.center.y + (UIApplication.sharedApplication().statusBarFrame.size.height)/2.0)
        self.arrowRight?.center = CGPointMake( self.view.frame.size.width - NAV_SPACE_VALUE , self.navView!.center.y + (UIApplication.sharedApplication().statusBarFrame.size.height)/2.0)
        self.navView?.frame = CGRectMake( 0, 0, self.view.frame.size.width, NAV_HEIGHT)
        self.navLine?.frame = CGRectMake( 0.0, self.navView!.frame.size.height, self.navView!.frame.size.width, 1.0)
        
        var count = 0;
        for controller in self.viewControllers! as NSArray as! [UIViewController]
        {
            controller.view.frame = CGRectMake(self.view.frame.size.width * CGFloat(count), 0, self.view.frame.size.width, self.view.frame.size.height - NAV_HEIGHT)
            
            let titleView = self.iconsMenu?.objectAtIndex(count) as! UIView
            let affine = titleView.transform
            titleView.transform = CGAffineTransformMakeScale(1.0, 1.0)
            
            if(titleView.isKindOfClass(UIImageView))
            {
                let icon = titleView as! UIImageView;
                titleView.frame = CGRectMake( 50.0 * CGFloat(count), 0, ( icon.image != nil ? (NAV_TITLE_SIZE * icon.image!.size.width) / icon.image!.size.height : NAV_TITLE_SIZE ) , NAV_TITLE_SIZE)
                
            }
            else if(titleView.isKindOfClass(UILabel))
            {
                titleView.sizeToFit()
            }
            
            if(self.transformScale!)
            {
                titleView.transform = affine
            }
            
            
            let spacing  = (self.view.frame.size.width/2.0) - self.NAV_SPACE_VALUE - titleView.frame.size.width/2.0 - CGFloat( self.showArrow! ? self.arrowLeft!.image!.size.width : 0.0)
            titleView.center = CGPointMake(self.navView!.center.x + (spacing * CGFloat(count)) - (CGFloat(self.currentPage) * spacing) , self.navView!.center.y + (UIApplication.sharedApplication().statusBarFrame.size.height)/2.0)
            count++
        }
        
        self.viewContainer?.contentSize = CGSizeMake(self.view.frame.size.width * CGFloat(count), self.view.frame.size.height - NAV_HEIGHT)
        
    }
    
    override func shouldAutorotate() -> Bool
    {
        return true;
    }
    
    // MARK: Methods Public
    
    internal func addNewController(controller:UIViewController, title: AnyObject)
    {
        self.viewControllers?.addObject(controller);
        
        if title.isKindOfClass(NSString)
        {
            let label = UILabel()
            label.text = title as? String;
            self.iconsMenu?.addObject(label);
            self.includeControllerOnInterface(controller, titleView: label, tag: self.iconsMenu!.count - 1)
        }
        else if title.isKindOfClass(UIImage)
        {
            let image = UIImageView(image: title as? UIImage)
            image.image = image.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
            image.contentMode = UIViewContentMode.ScaleAspectFill
            self.iconsMenu!.addObject(image)
            self.includeControllerOnInterface(controller, titleView: image, tag: self.iconsMenu!.count - 1)
            
        }
        else
        {
            NSException(name:"ClassRequeredNotFoundException", reason:"Not Allowed Class. NSString or UIImage Please!", userInfo:nil).raise()
        }
        
        self.viewDidLayoutSubviews()
        self.resetNavBarConfig();
        
    }
    
    internal func setPosition(position: NSInteger, animated:Bool)
    {
        self.currentPage = position
        self.viewContainer?.setContentOffset(CGPointMake( CGFloat(self.currentPage!) * self.viewContainer!.frame.size.width, self.viewContainer!.contentOffset.y), animated: animated)
    }
    
    internal func goNextView()
    {
        if self.currentPage! < self.viewControllers!.count
        {
            self.setPosition(self.currentPage! + 1, animated: true)
        }
        
    }
    
    internal func goPrevieusView()
    {
        if self.currentPage > 0
        {
            self.setPosition(self.currentPage! - 1, animated: true)
        }
    }
    
    internal func resetNavBarConfig()
    {
        
        var count = 0;
        for titleView in self.iconsMenu! as NSArray as! [UIView]
        {
            
            if(titleView.isKindOfClass(UIImageView))
            {
                titleView.tintColor =  self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor
            }
            else
            {
                if( titleView.isKindOfClass(UILabel))
                {
                    let titleText = titleView as! UILabel
                    titleText.textColor = self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor
                    titleText.font =  self.changeFont! ? ( count == self.currentPage ? self.selectedFont : self.dissectedFont ) : self.selectedFont
                    
                }
                
            }
            
            let transform = (self.transformScale! ? ( count == self.currentPage ? self.scaleMax: self.scaleMin): self.scaleMax)
            titleView.transform = CGAffineTransformMakeScale(transform!, transform!)
            
            count++
        }
        
        self.arrowLeft!.alpha = (self.showArrow! ? (self.currentPage == 0 ? 0.0 : 1.0) :0.0);
        self.arrowRight!.alpha = (self.showArrow! ?  (self.currentPage == self.viewControllers!.count - 1 ? 0.0 : 1.0) :0.0);
        self.arrowRight!.tintColor = (self.changeColor! ? self.dissectedColor : self.selectedColor)
        self.arrowLeft!.tintColor = (self.changeColor! ? self.dissectedColor : self.selectedColor)
    }
    
    // MARK: Methods Private
    
    private func inicializeValues(viewControllers: NSArray!, iconsMenu: NSArray!, position: NSInteger!)
    {
        
        let elementsController = NSMutableArray();
        
        for controller in viewControllers
        {
            
            if controller.isKindOfClass(UIViewController)
            {
                let controller_element = controller as! UIViewController
                controller_element.setAHPagingController(self)
                elementsController.addObject(controller)
            }
            else
            {
                NSException(name:"ClassRequeredNotFoundException", reason:"Not Allowed Class. Controller Please", userInfo:nil).raise()
            }
            
        }
        
        
        let iconsController = NSMutableArray();
        for icon in iconsMenu
        {
            if icon.isKindOfClass(NSString)
            {
                let label = UILabel()
                label.text = icon as? String
                iconsController.addObject(label)
            }
            else if(icon.isKindOfClass(UIImage))
            {
                let imageView = UIImageView(image: icon as? UIImage)
                imageView.image = imageView.image!.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate)
                imageView.contentMode = UIViewContentMode.ScaleAspectFill
                iconsController.addObject(imageView)
            }
            else
            {
                NSException(name:"ClassRequeredNotFoundException", reason:"Not Allowed Class. NSString or UIImage Please!", userInfo:nil).raise()
            }
        }
        
        if(iconsController.count != elementsController.count)
        {
            NSException(name:"TitleAndControllersException", reason:"Title and controllers not match", userInfo:nil).raise()
        }
        
        self.bounce                = true
        self.fade                  = true
        self.showArrow             = true
        self.transformScale        = false
        self.changeFont            = true
        self.changeColor           = true
        self.selectedColor         = UIColor.blackColor()
        self.dissectedColor        = UIColor(red: 0.0 , green: 122.0/255.0, blue: 1.0, alpha: 1.0)
        self.selectedFont          = UIFont(name: "HelveticaNeue-Medium", size: 16)!
        self.dissectedFont         = UIFont(name: "HelveticaNeue", size: 16)!
        self.currentPage           = position
        self.viewControllers       = elementsController
        self.iconsMenu             = iconsController
        self.scaleMax              = 1.0
        self.scaleMin              = 0.9
        
    }
    
    private func includeControllerOnInterface(controller: UIViewController, titleView:UIView, tag:(NSInteger))
    {
        
        controller.view.clipsToBounds = true;
        controller.view.frame = CGRectMake(self.viewContainer!.contentSize.width, 0.0, self.view.frame.size.width, self.view.frame.size.height - NAV_HEIGHT)
        self.viewContainer?.contentSize = CGSizeMake(self.view.frame.size.width + self.viewContainer!.contentSize.width, self.view.frame.size.height - NAV_HEIGHT)
        self.addChildViewController(controller)
        controller.didMoveToParentViewController(self)
        self.viewContainer?.addSubview(controller.view)
        
        let tap = UITapGestureRecognizer(target:self, action:Selector("tapOnButton:"))
        titleView.addGestureRecognizer(tap)
        titleView.userInteractionEnabled = true;
        titleView.tag = tag
        self.navView?.addSubview(titleView);
    }
    
    func tapOnButton(sender: UITapGestureRecognizer)
    {
        if sender.view!.tag != self.currentPage
        {
            var frame = self.viewContainer!.frame
            frame.origin.y = 0;
            frame.origin.x = frame.size.width * CGFloat(sender.view!.tag)
            self.viewContainer?.scrollRectToVisible(frame, animated:true)
        }
        
    }
    
    private func changeColorFrom(fromColor: (UIColor), toColor: UIColor, porcent:(CGFloat)) ->UIColor
    {
        var redStart: CGFloat = 0
        var greenStart : CGFloat = 0
        var blueStart: CGFloat = 0
        var alphaStart : CGFloat = 0
        fromColor.getRed(&redStart, green: &greenStart, blue: &blueStart, alpha: &alphaStart)
        
        var redFinish: CGFloat = 0
        var greenFinish: CGFloat = 0
        var blueFinish: CGFloat = 0
        var alphaFinish: CGFloat = 0
        toColor.getRed(&redFinish, green: &greenFinish, blue: &blueFinish, alpha: &alphaFinish)
        
        return UIColor(red: (redStart - ((redStart-redFinish) * porcent)) , green: (greenStart - ((greenStart-greenFinish) * porcent)) , blue: (blueStart - ((blueStart-blueFinish) * porcent)) , alpha: (alphaStart - ((alphaStart-alphaFinish) * porcent)));
    }
    
    // MARK: Setters
    
    internal func setBounce(bounce: Bool)
    {
        self.viewContainer?.bounces = bounce;
        self.bounce = bounce;
    }
    
    internal func setFade(fade: Bool)
    {
        self.fade = fade;
    }
    
    internal func setTransformScale(transformScale: Bool)
    {
        self.transformScale = transformScale
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                let transform = (self.transformScale! ? ( count == self.currentPage ? self.scaleMax: self.scaleMin): self.scaleMax);
                titleView.transform = CGAffineTransformMakeScale(transform, transform)
                count++
            }
        }
    }
    
    internal func setShowArrow(showArrow: Bool)
    {
        self.showArrow = showArrow;
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            UIView .animateWithDuration(0.3, animations: { () -> Void in
                self.arrowLeft?.alpha = (self.showArrow! ? (self.currentPage == 0 ? 0.0 : 1.0) : 0.0)
                self.arrowRight?.alpha = (self.showArrow! ? (self.currentPage == self.viewControllers!.count - 1 ? 0.0 : 1.0) :0.0)
                self.viewDidLayoutSubviews()
            })
        }
    }
    
    internal func setChangeFont(changeFont:Bool)
    {
        self.changeFont = changeFont
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.font = self.changeFont! ? ( count == self.currentPage ? self.selectedFont : self.dissectedFont ) : self.selectedFont
                    titleView.sizeToFit()
                }
                
                count++
            }
        }
    }
    
    internal func setChangeColor(changeColor: Bool)
    {
        self.changeColor = changeColor;
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UIImageView)
                {
                    titleView.tintColor = self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor
                }
                else if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.textColor = (self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor)
                }
                
                count++
            }
            self.arrowLeft?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
            self.arrowRight?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
        }
    }
    
    internal func setSelectColor(selectedColor: UIColor)
    {
        self.selectedColor = selectedColor
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UIImageView)
                {
                    titleView.tintColor = self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor
                }
                else if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.textColor = (self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor)
                }
                
                count++
            }
            self.arrowLeft?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
            self.arrowRight?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
        }
    }
    
    internal func setDissectColor(dissectedColor: UIColor)
    {
        self.dissectedColor = dissectedColor
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UIImageView)
                {
                    titleView.tintColor = self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor
                }
                else if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.textColor = (self.changeColor! ? (count == self.currentPage ? self.selectedColor: self.dissectedColor) :  self.selectedColor)
                }
                
                count++
            }
            self.arrowLeft?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
            self.arrowRight?.tintColor = (self.changeColor! ? self.dissectedColor :  self.selectedColor);
        }
    }
    
    internal func setSelectFont(selectedFont: UIFont)
    {
        self.selectedFont = selectedFont
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.font = self.changeFont! ? ( count == self.currentPage ? self.selectedFont : self.dissectedFont ) : self.selectedFont
                    titleView.sizeToFit()
                }
                
                count++
            }
        }
    }
    
    internal func setDissectFont(dissectedFont: UIFont)
    {
        self.dissectedFont = selectedFont
        
        if (self.isViewLoaded() && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                if titleView.isKindOfClass(UILabel)
                {
                    let title = titleView as! UILabel
                    title.font = self.changeFont! ? ( count == self.currentPage ? self.selectedFont : self.dissectedFont ) : self.selectedFont
                    titleView.sizeToFit()
                }
                
                count++
            }
        }
    }
    
    internal func setContentBackgroundColor(backgroundColor: UIColor)
    {
        self.viewContainer?.backgroundColor = backgroundColor
    }
    
    internal func setNavBackgroundColor(backgroundColor: UIColor)
    {
        self.navView?.backgroundColor = backgroundColor
    }
    
    internal func setNavLineBackgroundColor(backgroundColor: UIColor)
    {
        self.navLine?.backgroundColor = backgroundColor
    }
    
    internal func setScaleMax(scaleMax: CGFloat, scaleMin:CGFloat)
    {
        if scaleMax < scaleMin || scaleMin < 0.0  || scaleMax < 0.0
        {
            return;
        }
        
        self.scaleMax = scaleMax;
        self.scaleMin = scaleMin;
        
        if (self.isViewLoaded() && self.transformScale == true && self.view.window != nil)
        {
            var count = 0
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                let transform = (self.transformScale! ? ( count == self.currentPage ? self.scaleMax: self.scaleMin): self.scaleMax);
                
                titleView.transform = CGAffineTransformMakeScale(transform,transform)
                
                if titleView.isKindOfClass(UILabel)
                {
                    titleView.sizeToFit()
                }
                
                count++
            }
        }
        
    }
    
    // MARK: UIScrollViewDelegate
    
    func scrollViewDidScroll(scrollView: UIScrollView)
    {
        
        if scrollView == self.viewContainer
        {
            let xPosition = scrollView.contentOffset.x;
            let fractionalPage = Float(xPosition / scrollView.frame.size.width);
            let currentPage = Int(round(fractionalPage));
            
            if fractionalPage == Float(currentPage) && currentPage != self.currentPage
            {
                self.delegate?.AHPagingMenuDidChangeMenuPosition?(self.currentPage, to: currentPage)
                self.delegate?.AHPagingMenuDidChangeMenuFrom?(self.viewControllers!.objectAtIndex(self.currentPage), to: self.viewControllers!.objectAtIndex(currentPage))
                self.currentPage = currentPage;
                
            }
            
            let porcent = fabs(fractionalPage - Float(currentPage))/0.5;
            
            if self.showArrow!
            {
                if currentPage <= 0
                {
                    self.arrowLeft?.alpha = 0;
                    self.arrowRight?.alpha = 1.0 - CGFloat(porcent);
                }
                else if currentPage >= self.iconsMenu!.count - 1
                {
                    self.arrowLeft?.alpha = 1.0 - CGFloat(porcent);
                    self.arrowRight?.alpha = 0.0;
                }
                else
                {
                    self.arrowLeft?.alpha = 1.0 - CGFloat(porcent);
                    self.arrowRight?.alpha = 1.0 - CGFloat(porcent);
                }
                
            }
            else
            {
                self.arrowLeft?.alpha = 0;
                self.arrowRight?.alpha = 0;
            }
            
            var count = 0;
            for titleView in self.iconsMenu! as NSArray as! [UIView]
            {
                titleView.alpha = CGFloat (( self.fade! ? (count <= (currentPage + 1) && count >= (currentPage - 1) ? 1.3 - porcent : 0.0 ) : (count <= self.currentPage + 1 || count >= self.currentPage - 1 ? 1.0: 0.0)))
                
                let spacing  = (self.view.frame.size.width/2.0) - self.NAV_SPACE_VALUE - titleView.frame.size.width/2 - (self.showArrow! ? self.arrowLeft!.image!.size.width : 0.0)
                
                titleView.center = CGPointMake(self.navView!.center.x + (spacing * CGFloat(count)) - (CGFloat(fractionalPage) * spacing), self.navView!.center.y + (UIApplication.sharedApplication().statusBarFrame.size.height/2.0))
                let distance_center = CGFloat(fabs(titleView.center.x - self.navView!.center.x))
                
                if titleView.isKindOfClass(UIImageView)
                {
                    if( distance_center < spacing)
                    {
                        if self.changeColor!
                        {
                            titleView.tintColor =  self.changeColorFrom(self.selectedColor, toColor: self.dissectedColor, porcent: distance_center/spacing)
                        }
                    }
                }
                else if titleView.isKindOfClass(UILabel)
                {
                    let titleText = titleView as! UILabel;
                    
                    if( distance_center < spacing)
                    {
                        if self.changeColor!
                        {
                            titleText.textColor = self.changeColorFrom(self.selectedColor, toColor: self.dissectedColor, porcent: distance_center/spacing)
                        }
                        
                        if self.changeFont!
                        {
                            titleText.font = (distance_center < spacing/2.0 ? self.selectedFont : self.dissectedFont)
                            titleText.sizeToFit()
                        }
                        
                    }
                    
                }
                
                if (self.transformScale! && count <= (currentPage + 1) && count >= (currentPage - 1))
                {
                    let transform = CGFloat(self.scaleMax! + ((self.scaleMax! - self.scaleMin!) * (-distance_center/spacing)))
                    titleView.transform = CGAffineTransformMakeScale(transform, transform);
                }
                
                count++;
            }
            
        }
        
    }
    
}


