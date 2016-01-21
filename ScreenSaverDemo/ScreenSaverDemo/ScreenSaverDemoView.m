//
//  ScreenSaverDemoView.m
//  ScreenSaverDemo
//
//  Created by Naoki Tsutsui on 1/20/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

#import "ScreenSaverDemoView.h"
#import <WebKit/WebKit.h>

#define INTERVAL (NSTimeInterval)60.0*3

@implementation ScreenSaverDemoView

WebView *webView;

int count = 0;

- (instancetype)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview
{
    self = [super initWithFrame:frame isPreview:isPreview];
    if (self) {
        [self setAnimationTimeInterval:INTERVAL];
        
        webView = [[WebView alloc] initWithFrame:[self bounds] frameName:nil groupName:nil];
        [webView setDrawsBackground:YES]; // 効果がよくわからない

        [self addSubview:webView];
    }
    return self;
}

- (void)startAnimation
{
    [super startAnimation];
}

- (void)stopAnimation
{
    [super stopAnimation];
}

- (void)drawRect:(NSRect)rect
{
    [super drawRect:rect];
}

- (void)animateOneFrame
{
    [self displayFavoritSite];
}

- (BOOL)hasConfigureSheet
{
    return NO;
}

- (NSWindow*)configureSheet
{
    return nil;
}

// MARK: - Misc

- (void)displayFavoritSite
{
    if (count == 1) {
        [webView setMainFrameURL:@"http://news.google.co.jp"];
    } else if (count == 2) {
        [webView setMainFrameURL:@"https://web.kamel.io"];
    } else if (count == 3) {
        [webView setMainFrameURL:@"http://qiita.com"];
    } else if (count == 4) {
        [webView setMainFrameURL:@"https://www.youtube.com/"];
    } else if (count == 5) {
        [webView setMainFrameURL:@"https://github.com/naokits/ManzaiVideoPlayer/blob/dev/ManzaiVideoPlayer/FirstViewController.swift#L20-L31"];
    } else {
        [webView setMainFrameURL:@"https://developer.apple.com/jp/documentation/"];
        count = 0;
    }
    
    count++;
}

- (void)displayLocalHTML
{
    NSString *path = [NSString stringWithFormat:@"file://%@/html/index.html",
                      [[NSBundle bundleForClass:[self class]] resourcePath]];
    [webView setMainFrameURL:path];
}

@end
