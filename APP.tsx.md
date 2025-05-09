
// In App.js in a new project
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Firstlogin from './app1stlogin';
import SingupHO from './appsingupHO';
import { Button, HeaderTitle } from '@react-navigation/elements';
import LoginScreen from './Login';
import { Header } from 'react-native/Libraries/NewAppScreen';

function HomeScreen({ navigation }:any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 18, color: 'green' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Firstlogin} />
      <Stack.Screen name="UserLogin" component={LoginScreen} />
      <Stack.Screen name="Login" component={Firstlogin} />
      <Stack.Screen name="SignUp" component={SingupHO} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}  

