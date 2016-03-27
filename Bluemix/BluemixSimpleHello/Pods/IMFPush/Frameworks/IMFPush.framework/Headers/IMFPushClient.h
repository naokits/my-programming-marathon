/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <UIKit/UIKit.h>
#import <IMFCore/IMFCore.h>

//! Project version number for IMFPush.
FOUNDATION_EXPORT double IMFPushVersionNumber;

//! Project version string for IMFPush.
FOUNDATION_EXPORT const unsigned char IMFPushVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <IMFPush/PublicHeader.h>

extern NSString * const IMFPushErrorDomain;

enum{
    IMFPushErrorInternalError					= 1,
    IMFPushErrorInvalidToken					= 2,
    IMFPushErrorRemoteNotificationsNotSupported	= 3,
    IMFPushErrorEmptyTagArray                   = 4,
    IMFPushRegistrationVerificationError        = 5,
    IMFPushRegistrationError                    = 6,
    IMFPushRegistrationUpdateError              = 7,
    IMFPushRetrieveSubscriptionError            = 8,
    IMFPushRetrieveTagsError                    = 9,
    IMFPushTagSubscriptionError                 = 10,
    IMFPushTagUnsubscriptionError               = 11
};

/*!
 * @class IMFPushClient class provides APIs for functionalities that are supported by the IMFPush Notification SDK
 *
 */
@interface IMFPushClient : NSObject

/*!
 * This method initializes the instance of the IMFPush Service for this application.
 *
 * @return The instance of the initialized IMFPush Service
 *
 */
+(IMFPushClient*) sharedInstance;

/*!
 * Gets the Tags that are subscribed by the device
 *
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) retrieveSubscriptionsWithCompletionHandler:(void(^) (IMFResponse *response, NSError* error)) completionHandler;

/*!
 * Gets all the available Tags for the backend mobile application
 *
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) retrieveAvailableTagsWithCompletionHandler:(void(^) (IMFResponse *response, NSError* error)) completionHandler;

/*!
 * Registers the device on to the IMFPush Notification Server
 *
 * @param deviceToken - the device token received from APNS.
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) registerDeviceToken: (NSData*) deviceToken completionHandler: (void(^) (IMFResponse *response, NSError* error)) completionHandler;

/*!
 * Subscribes to a particular backend mobile application Tag(s)
 *
 * @param tagsArray - The Tag array to subscribe to.
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) subscribeToTags: (NSArray*) tagsArray completionHandler: (void(^) (IMFResponse* response, NSError* error)) completionHandler;

/*!
 * Unsubscribes from an backend mobile application Tag(s)
 *
 * @param tagsArray - The Tag name array to unsubscribe from.
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) unsubscribeFromTags: (NSArray*) tagsArray completionHandler: (void(^) (IMFResponse* response, NSError * error))completionHandler;

/*!
 * Unregisters the device from the IMFPush Notification Server
 *
 * @param completionHandler - returns a IMFResponse or NSError
 */
-(void) unregisterDevice: (void(^) (IMFResponse *response, NSError* error)) completionHandler;

/*!
 * Collect analytics information when a new notification is received.
 *
 * @param userInfo - the dictionary containing the notification object.
 */
-(void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo;

@end

@interface IMFPush : NSObject

/**
 * Returns the current IMFPush version
 */
+(NSString*) version;

@end
