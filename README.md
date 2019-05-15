## Amplify Social Auth Example

In order to successfully persist a Federated Identity in AWS Amplify, the user needs to be added to a User Pool.

Amplify currently only handles this correctly when users are added and authenticated through the `withOAuth` HOC. After successful Cognition or Social Auth. A JWT token and refresh token is returned for the current user in the User Pool. The tokens have a 60 min expiry but Amplify will "magically" handle the refresh whenever `currentSession()` is called.

In this example, Google is configured, but Facebook could easily be added.

The only downside to this implementation is that it uses the webview login method as opposed to using native which you get from react-native-google-signin.

## Config

Basic AWS config is loaded from aws-exports.js. In addition to this you need to specify some Authentication parameters:
##### domain
##### scope
##### redirectSignIn
##### redirectSignOut
##### responseType