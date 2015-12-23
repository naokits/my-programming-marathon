//
//  DetailViewController.swift
//  YoutubeClient
//
//  Created by Naoki Tsutsui on 12/23/15.
//  Copyright © 2015 Naoki Tsutsui. All rights reserved.
//

import UIKit
import youtube_parser
import AVKit
import AVFoundation

class DetailViewController: UIViewController {

    @IBOutlet weak var playButton: UIButton!
    @IBOutlet weak var detailDescriptionLabel: UILabel!

    let moviePlayer = AVPlayerViewController()


    var detailItem: AnyObject? {
        didSet {
            // Update the view.
            self.configureView()
        }
    }

    func configureView() {
        // Update the user interface for the detail item.
        if let youtubeURLString = self.detailItem {
            if let label = self.detailDescriptionLabel {
                label.text = youtubeURLString.description
            }
            
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.configureView()
        
        
        moviePlayer.view.frame = view.frame
//        view.addSubview(moviePlayer.view)
        self.presentViewController(moviePlayer, animated: true) { () -> Void in
            //
        }
        

//        let youtubeURL = NSURL(string: "https://www.youtube.com/watch?v=swZJwZeMesk")!
        if let videoInfo = self.detailItem {
            if let videoURLString = videoInfo["url"] as? String {
                let youtubeURL = NSURL(string: videoURLString)!
                playVideoWithYoutubeURL(youtubeURL)
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    func playVideoWithYoutubeURL(url: NSURL) {
        let playerItem = AVPlayerItem.init(URL: url)
        let player = AVPlayer(playerItem: playerItem)
        
        self.moviePlayer.player = player

        
        Youtube.h264videosWithYoutubeURL(url, completion: { (videoInfo, error) -> Void in
            if let videoURLString = videoInfo?["url"] as? String where ((videoInfo?["title"] as? String) != nil) {
                
                print("動画のURL: \(videoURLString)")
                let playerItem = AVPlayerItem.init(URL: NSURL(string: videoURLString)!)
                let player = AVPlayer(playerItem: playerItem)
                
                self.moviePlayer.player = player
//                self.moviePlayer.contentURL = NSURL(string: videoURLString)

            }
        })
    }
    
    @IBAction func tappedPlayButton(sender: AnyObject) {
    }

}

