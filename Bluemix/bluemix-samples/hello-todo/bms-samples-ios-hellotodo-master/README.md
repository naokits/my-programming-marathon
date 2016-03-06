# iOS helloTodo Sample Application for Bluemix Mobile Services
---
This helloTodo sample app contains an Objective-C project that communicates with a StrongLoop-based mobile backend that was created with the MobileFirst Services Starter Boilerplate on IBM&reg; Bluemix&reg;.

You can either watch the video tutorial or follow the instructions that take you step-by-step through the process of creating a mobile backend and running the sample.

### Before you begin
Before you start, make sure that you have:
* A [Bluemix](http://bluemix.net) account
* XCode Version 7.1

### Video tutorial
![image](video-coming-soon.png)
> We're working on creating a video tutorial. It will be published here when it's ready.

### Configure the helloTodo sample

Use the following steps to configure the helloTodo sample for Objective-C:

1. [Download the helloTodo sample](#download-the-hellotodo-sample)
2. [Configure the mobile backend for your helloTodo application](#configure-the-mobile-backend-for-your-hellotodo-application)
3. [Configure the front end in the helloTodo sample](#configure-the-front-end-in-the-hellotodo-sample)
4. [Run the helloTodo sample application](#run-the-hellotodo-sample-application)


### Download the helloTodo sample
Clone the sample from Github with the following command:

```git clone https://github.com/ibm-bluemix-mobile-services/bms-samples-ios-hellotodo```

### Configure the mobile backend for your helloTodo application

Before you can run the helloTodo application, you must set up a mobile backend for your app on Bluemix.

> If you have already created a mobile backend with the MobileFirst Services Starter boilerplate, you might want to skip to the [Configuring the front end in the helloTodo sample](#configuring-the-front-end-in-the-hellotodo-sample) section.

  The following procedure shows you how to create a MobileFirst Services Starter application. Using the boilerplate to create your app automatically performs the following actions:

* Provisions a Node.js runtime and populates it with with a default helloTodo application that was created with StrongLoop. This application uses the LoopBack framework to expose the `/api/Items` API, which is used by both the Web UI and the helloTodo app sample from this Github repository.
* Adds the following services to the app: Cloudant&reg; NoSQL DB, IBM Push Notifications, and Mobile Client Access.

#### Create a mobile backend in the  Bluemix dashboard

1.	In the **Boilerplates** section of the Bluemix catalog, click **MobileFirst Services Starter**.
2.	Enter a name and host for your mobile backend and click **Create**.
3.	Click **Finish**.
4. Get information about your app. <br/> After the provisioning process is complete, you will see a a page for your newly provisioned mobile backend. Click the **Mobile Options** link in top right part of a screen to find your *appRoute* and *appGUID*. Keep this screen open in your browser; you will need these parameters in the next steps.

#### Access the StrongLoop backend app
1. Open the **appRoute** URL that you copied from the Bluemix dashboard in your browser. You will see the web interface for the helloTodo backend.
2. Start by following the guided experience steps that are described in the web UI. <br/>Eventually, you will try to DELETE a todo item and will discover that this action can only be complete when using the helloTodo mobile apps sample from this Github repository.The mobile backend is protected by a Mobile Client Access by default.  Mobile Client Access is a Bluemix service that provides security and monitoring functionality for mobile backend applications.

> **Tip:** Click the **View API Reference** button on web UI to see the API specs.

The following steps will guide you through obtaining and running the helloTodo mobile application.

### Configure the front end in the helloTodo sample
1. In a terminal, navigate to the `bms-samples-ios-hellotodo` directory where the project was cloned.
2. Navigate to the `helloTodo` folder.
3. If the CocoaPods client is not installed, run the following command: `sudo gem install cocoapods`
4. If the CocoaPods repository is not configured, run the following command: `pod setup`
5. To download and install the required dependencies, run the following commmand: `pod install`
6. Open the Xcode workspace: `open helloToDo.xcworkspace`. From now on, open the xcworkspace file because it contains all the dependencies and configuration.
7. Open the `helloToDo/AppDelegate.m` file and add the corresponding **ApplicationRoute** and
**ApplicationID** values (found in the **Mobile Options** link on the Bluemix Dashboard) in the application `didFinishLaunchingWithOptions` method:

```objective-c
(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

//initialize SDK with IBM Bluemix application ID and route
//TODO: Enter a valid ApplicationRoute for initializaWithBackend Route and a valid ApplicationId for backendGUID
IMFClient *imfClient = [IMFClient sharedInstance];
[imfClient initializeWithBackendRoute:@"<APPLICATION_ROUTE>" backendGUID:@"<APPLICATION_ID>"];			

return YES;
}
```


### Run the helloTodo sample application

In Xcode, click **Product > Run**.  

The helloTodo sample is a single view application with a simple list of to do items. If you previously added data through your web application, you will see the data is automatically pulled into the application.

#### Modify to do items in the iOS app
You can create, add and modify items directly in the application. This sample uses Bluemix Mobile Services SDK, which knows how to handle Mobile Client Access security. Therefore, unlike the web application, you can also DELETE items from mobile app by swiping them. You can also mark items as completed by clicking to the left of the corresponding to do item. When you update an item in the mobile app it will automatically be updated in the web app (you need to refresh the web app). If you make a change in the web UI and want to see it reflected in the mobile app, pull down the todo list to refresh.

### Add authentication to your app
As you recall, the DELETE endpoint can only be accessed by mobile applications because it is protected by the Mobile Client Access service.

By default, Mobile Client Access is not configured to require any interactive authentication (for example, to ask for username and password).

The next step is to learn how to configure authentication with the Mobile Client Access dashboard and instrument your app with required components. For more information, see the  [Mobile Client Access documentation](https://www.ng.bluemix.net/docs/services/mobileaccess/index.html) and [HelloAuthentication sample](https://github.com/ibm-bluemix-mobile-services/bms-samples-ios-helloauthentication).


### Xcode requirement
**Note:** The project has bitcode support disabled because the Bluemix Mobile Services SDK does not currently support bitcode. For more information, see: [Connect Your iOS 9 App to Bluemix](https://developer.ibm.com/bluemix/2015/09/16/connect-your-ios-9-app-to-bluemix/)

### License
This package contains sample code provided in source code form. The samples are licensed under the under the Apache License, Version 2.0 (the "License"). You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 and may also view the license in the license.txt file within this package. Also see the notices.txt file within this package for additional notices.
