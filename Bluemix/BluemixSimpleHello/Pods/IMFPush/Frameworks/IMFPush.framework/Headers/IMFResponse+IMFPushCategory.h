/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

#import <IMFCore/IMFCore.h>
#import <IMFPush/IMFPush.h>

@interface IMFResponse (IMFPushCategory)

/*!
 * Get a dictionary of subscriptions of the application.
 *
 * @return A dictionary containing subscriptions.
 */
- (NSDictionary*) subscriptions;

/*!
 * Get a list of available tags for subscription.
 *
 * @return An array of tags.
 */
- (NSArray*) availableTags;

/*!
 * Get the subscription status by parsing multi-part response
 *
 * @return A dictionary containing subscription status.
 */
- (NSDictionary*) subscribeStatus;

/*!
 * Get the unsubscription status by parsing multi-part response
 *
 * @return A dictionary containing unsubscription status.
 */
- (NSDictionary*) unsubscribeStatus;

@end
