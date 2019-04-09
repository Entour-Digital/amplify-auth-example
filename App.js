/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, SafeAreaView, StatusBar, Button } from 'react-native';

import { withOAuth } from "aws-amplify-react-native";
import Amplify, { Auth, Hub } from 'aws-amplify';
import config from './aws-exports'
Amplify.configure(config)

const oauth = {
  // Domain name
  domain: 'amplifyauth.auth.eu-west-1.amazoncognito.com',

  // Authorized scopes
  scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],

  // Callback URL
  redirectSignIn: 'amplifyauth://', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // Sign out URL
  redirectSignOut: 'amplifyauth://', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // 'code' for Authorization code grant, 
  // 'token' for Implicit grant
  responseType: 'token',

}

Amplify.configure({
  Auth: {
    oauth: oauth
  }
});



class App extends React.Component {
  constructor(props) {
    super(props);
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          console.log('sign in success');
          Auth.currentAuthenticatedUser().then(user => {
            console.log(user);
            this.setState({ authState: 'signedIn' });
          }).catch(e => {
            console.log(e);
            this.setState({ authState: 'signIn' });
          });
          break;
        case 'signIn_failure':
          console.log('sign in failed');
          break;
        default:
          break;
      }
    });

    Auth.currentSession().then((session) => {
      console.log('current session')
      console.log(session.idToken.jwtToken);
    });
  }
  render() {
    const {
      oAuthUser: user,
      oAuthError: error,
      hostedUISignIn,
      facebookSignIn,
      googleSignIn,
      amazonSignIn,
      customProviderSignIn,
      signOut,
    } = this.props;

    return (
      <SafeAreaView style={styles.safeArea}>
        {user && <Button title="Sign Out" onPress={signOut} icon='logout' />}
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text>{JSON.stringify({ user, error, }, null, 2)}</Text>
          {!user && <React.Fragment>
            {/* Go to the Cognito Hosted UI */}
            <Button title="Cognito" onPress={hostedUISignIn} />

            {/* Go directly to a configured identity provider */}
            <Button title="Facebook" onPress={facebookSignIn} />
            <Button title="Google" onPress={googleSignIn} />
            <Button title="Amazon" onPress={amazonSignIn} />

            {/* e.g. for OIDC providers */}
            <Button title="Yahoo" onPress={() => customProviderSignIn('Yahoo')} />
          </React.Fragment>}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default withOAuth(App);
