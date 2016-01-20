//
//  ScreenSaverDemoView.m
//  ScreenSaverDemo
//
//  Created by Naoki Tsutsui on 1/20/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

#import "ScreenSaverDemoView.h"
#import <WebKit/WebKit.h>

@implementation ScreenSaverDemoView

WebView *webView;

int count = 0;

- (instancetype)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview
{
    self = [super initWithFrame:frame isPreview:isPreview];
    if (self) {
        [self setAnimationTimeInterval:60.0*2];
        
        webView = [[WebView alloc] initWithFrame:[self bounds] frameName:nil groupName:nil];
        [webView setDrawsBackground:NO];
        // [webView setMainFrameURL:[NSString stringWithFormat:@"file://%@/index.html", [[NSBundle bundleForClass:[self class]] resourcePath]]];
        // [webView setMainFrameURL:@"http://news.google.co.jp"];
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
        [webView setMainFrameURL:@"https://web.kamel.io"];
        count = 0;
    }
    count++;
    
    return;
}

- (BOOL)hasConfigureSheet
{
    return NO;
}

- (NSWindow*)configureSheet
{
    return nil;
}

@end
