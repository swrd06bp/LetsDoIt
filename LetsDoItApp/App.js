import React, { useEffect } from 'react'
import { Text, Platform, TouchableOpacity, Dimensions, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MenuProvider } from 'react-native-popup-menu'
import EStyleSheet from 'react-native-extended-stylesheet'


import Home from './src/home'
import HappinessPage from './src/HappinessPage'
import GoalsSection from './src/GoalsSection'
import LandingPage from './src/landing'
import HappinessInput from './src/happiness/HappinessInput'
import LoginPage from './src/login'
import DayFocus from './src/dayfocus'

const Stack = createStackNavigator()



const App: () => React$Node = () => {

  // apply rem for all absolute size
  const { height, width } = Dimensions.get('window')
  const rem = Math.max(height, width) / 690
  EStyleSheet.build({
    $rem: rem,
  })


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
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="GoalsSection"
            component={GoalsSection}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="HappinessPage"
            component={HappinessPage}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="DayFocus"
            component={DayFocus}
            options={() => ({
              headerTitle: () => null,
            })} 
          >
          </Stack.Screen>
          <Stack.Screen
            name="HappinessInput"
            component={HappinessInput}
            options={() => ({
              headerTitle: () => null,
            })} 
          >
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  )
}

const styles = EStyleSheet.create({
  title: {
    fontFamily: 'Barlow-Bold',
    fontWeight: 'bold',
    fontSize: '16rem',
    marginHorizontal: '10rem',

  },
  companyLogo: {
    height: '40rem',
    width: '60rem',
    marginLeft: '10rem',
  },
})

export default App
