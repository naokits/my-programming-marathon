//
//  ViewController.m
//  helloPush
//
//  Created by Joshua Alger on 10/22/15.
//  Copyright © 2015 IBM. All rights reserved.
//

#import "ViewController.h"
#import <IMFCore/IMFCore.h>
#import "TodoItem.h"
@interface ViewController ()
@property NSMutableArray *itemList;
@property NSString *backendRoute;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.itemList = [[NSMutableArray alloc]init];
    IMFClient *imfClient = [IMFClient sharedInstance];
    _backendRoute =[NSString stringWithFormat:@"%@",imfClient.backendRoute];
    self.refreshControl = [[UIRefreshControl alloc]init];
    [self.tableView addSubview:self.refreshControl];
    [self.refreshControl addTarget:self action:@selector(handleRefreshAction) forControlEvents:UIControlEventValueChanged];
    [self listItems];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)listItems
{
    NSString *restAPIURL = [NSString stringWithFormat:@"%@/api/Items",_backendRoute];
    IMFResourceRequest* request = [IMFResourceRequest requestWithPath:restAPIURL];
    [request setHTTPMethod:@"GET"];
    [request sendWithCompletionHandler:^(IMFResponse *response, NSError *error) {
        if (error != nil) {
            NSLog(@"Error pulling items from Bluemix: %@",error);
        }
        else {
            NSMutableArray *responseArray = [response.responseJson mutableCopy];
            NSMutableArray *itemArray =[[NSMutableArray alloc]init];
            for (NSDictionary *dic in responseArray){
                TodoItem *item = [TodoItem alloc];
                item.text = (NSString*) [dic valueForKey:@"text"];
                item.idNumber = (NSNumber*) [dic valueForKey:@"id"];
                item.isDone =   [[dic valueForKey:@"isDone"] boolValue];
                [itemArray addObject:item];
            }
        self.itemList = itemArray;
        [self reloadLocalTableData];
        }
    }];
}


- (void) createItem: (NSString*) itemText
{
    NSString *restAPIURL = [NSString stringWithFormat:@"%@/api/Items",_backendRoute];
    IMFResourceRequest* request = [IMFResourceRequest requestWithPath:restAPIURL];
	
	NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:
							  itemText, @"text",
							  @"false", @"isDone", nil];
	
	NSData *data = [NSJSONSerialization dataWithJSONObject:jsonDict options:NSJSONWritingPrettyPrinted error:nil];
	
	[request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:data];
    [request sendWithCompletionHandler:^(IMFResponse *response, NSError *error) {
        if (error != nil) {
            NSLog(@"createItem failed with error: %@",error);
        }
        else {
            NSLog(@"Item created successfully");
            [self listItems];
        }
    }];
}



- (void) updateItem: (TodoItem*) item
{
    NSString *restAPIURL = [NSString stringWithFormat:@"%@/api/Items",_backendRoute];
    IMFResourceRequest* request = [IMFResourceRequest requestWithPath:restAPIURL];
	
	NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:
							  item.text, @"text",
							  item.isDone ? @"true" : @"false", @"isDone",
							  item.idNumber, @"id", nil];
	
	NSData *data = [NSJSONSerialization dataWithJSONObject:jsonDict options:NSJSONWritingPrettyPrinted error:nil];

	[request setHTTPMethod:@"PUT"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:data];
    [request sendWithCompletionHandler:^(IMFResponse *response, NSError *error) {
        if (error != nil) {
            NSLog(@"updateItem failed with error: %@",error);
        }
        else {
            NSLog(@"Item  updated successfully");
            [self listItems];
        }
    }];
    
    
}

-(void) deleteItem: (TodoItem*) item
{
    NSString *restAPIURL = [NSString stringWithFormat:@"%@/api/Items/%@",_backendRoute,item.idNumber];
    IMFResourceRequest* request = [IMFResourceRequest requestWithPath:restAPIURL];
    [request setHTTPMethod:@"DELETE"];
    [request sendWithCompletionHandler:^(IMFResponse *response, NSError *error) {
        if (error != nil) {
            NSLog(@"deleteItem failed with error: %@",error);
        }
        else {
            NSLog(@"Item  deleted successfully");
        }
		[self listItems];
    }];
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 2;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (section == 0) {
        return self.itemList.count;
    } else {
        return 1;
    }
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell;
    if( indexPath.section == 0){
        cell = [tableView dequeueReusableCellWithIdentifier:@"ItemCell" forIndexPath:indexPath];
        TodoItem *item = (TodoItem*)self.itemList[indexPath.row];
        for (UIView *view in [cell.contentView subviews]) {
            if([view isKindOfClass:[UITextField class]]){
                ((UITextField*)view).tag = indexPath.row;
            }
            if(item.isDone){
                NSDictionary* attributes = @{NSStrikethroughStyleAttributeName: [NSNumber numberWithInt:NSUnderlineStyleSingle]};
                NSAttributedString* stringWithAttributes = [[NSAttributedString alloc] initWithString:item.text attributes:attributes];
                ((UITextField*)view).attributedText =stringWithAttributes;
                
                cell.accessoryType =UITableViewCellAccessoryCheckmark;
            }
            else{
                
                NSDictionary* attributes = @{};
                NSAttributedString* stringWithAttributes = [[NSAttributedString alloc] initWithString:item.text attributes:attributes];
                ((UITextField*)view).attributedText =stringWithAttributes;
                cell.accessoryType = UITableViewCellAccessoryNone;
            }
        }
        
        cell.contentView.tag = 0;
    } else {
        cell = [tableView dequeueReusableCellWithIdentifier:@"AddCell" forIndexPath:indexPath];
        cell.contentView.tag = 1;
    }
    return cell;
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    return indexPath.section == 0;
}

// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [self deleteItem:self.itemList[indexPath.row]];
        [self.itemList removeObjectAtIndex:indexPath.row];
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    if (indexPath.section == 0) {
        TodoItem *item = self.itemList[indexPath.row];
        if(item.isDone){
            item.isDone = false;
            [tableView cellForRowAtIndexPath:indexPath].accessoryType = UITableViewCellAccessoryNone;
            
        }
        else{
            item.isDone = true;
            [tableView cellForRowAtIndexPath:indexPath].accessoryType = UITableViewCellAccessoryCheckmark;
            
        }
        [self updateItem:item];
        
    }
}


- (BOOL) textFieldShouldReturn:(UITextField *)textField{
    [self handleTextFields:textField];
    return YES;
}

- (void) handleTextFields:(UITextField *)textField{
    if (textField.superview.tag == 1 && textField.text.length > 0) {
        [self addItemFromtextField:textField];
    } else {
        [self updateItemFromtextField:textField];
    }
    [textField resignFirstResponder];
}

- (void) updateItemFromtextField:(UITextField *)textField{
    UITableViewCell *cell = (UITableViewCell *)textField.superview.superview;
    NSIndexPath *indexPath = [self.tableView indexPathForCell:cell];
    TodoItem *item = self.itemList[indexPath.row];
    item.text = textField.text;
    [self updateItem:item];
}

- (void) addItemFromtextField:(UITextField *)textField{
    NSString *itemText = textField.text;
    [self createItem:itemText];
    textField.text = @"";
}

-(void) reloadLocalTableData
{
    [self.itemList sortUsingComparator:^NSComparisonResult(TodoItem* item1, TodoItem* item2) {
        return [item1.text caseInsensitiveCompare:item2.text];
    }];
    [self.tableView performSelectorOnMainThread:@selector(reloadData) withObject:nil waitUntilDone:NO];
}
-(void) handleRefreshAction{
    [self listItems];
    [self.refreshControl endRefreshing];
}



@end
