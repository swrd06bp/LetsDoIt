import React from 'react'
import { Text, StyleSheet, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/home'

const Stack = createStackNavigator()

const App: () => React$Node = () => {
  // change fontFamily
  Text.defaultProps = Text.defaultProps || {}
  if (Platform.OS !== 'ios') 
    Text.defaultProps.style =  { fontFamily: 'muli_regular' }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LandingPage"
          component={Home}
          options={() => ({
            headerTitle: () => null,
            headerLeft: () => <Text style={styles.title}>LetsDoIt</Text>
          })} 
        >
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
