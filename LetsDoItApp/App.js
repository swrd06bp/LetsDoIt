import React from 'react'
import { Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MenuProvider } from 'react-native-popup-menu'

import Home from './src/home'
import LandingPage from './src/landing'
import LoginPage from './src/login'
import ListGroceries from './src/listgroceries'

const Stack = createStackNavigator()


const App: () => React$Node = () => {
  // change fontFamily
  Text.defaultProps = Text.defaultProps || {}
  if (Platform.OS !== 'ios') 
    Text.defaultProps.style =  { fontFamily: 'muli_regular' }

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={() => ({
              headerShown: false
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={() => ({
              headerShown: false
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="HomePage"
            component={Home}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => <Text style={styles.title}>LetsDoIt</Text>,
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="ListGroceries"
            component={ListGroceries}
          >
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 10,

  }
})

export default App
