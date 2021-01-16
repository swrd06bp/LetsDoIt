import React, { useEffect } from 'react'
import { Text, Platform, TouchableOpacity, Dimensions, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MenuProvider } from 'react-native-popup-menu'
import EStyleSheet from 'react-native-extended-stylesheet'



import Home from './src/Pages/home'
import HappinessPage from './src/Pages/HappinessPage'
import GoalsSection from './src/Pages/GoalsSection'
import HabitPage from './src/Pages/GoalsSection/HabitPage'
import ProjectPage from './src/Pages/GoalsSection/ProjectPage'
import LandingPage from './src/Pages/landing'
import HappinessInput from './src/Pages/happiness/HappinessInput'
import LoginPage from './src/Pages/login'
import DayFocus from './src/Pages/dayfocus'

const Stack = createStackNavigator()



const App: () => React$Node = () => {

  // apply rem for all absolute size
  const { height, width } = Dimensions.get('window')
  const dimPhone = Platform.OS === 'ios' ? 900 : 690
  const rem = Math.max(height, width) / dimPhone
  EStyleSheet.build({
    $rem: rem,
  })


  // change fontFamily
  Text.defaultProps = Text.defaultProps || {}
  Text.defaultProps.style =  { fontFamily: 'muli' }

 

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
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={() => ({
              headerShown: false
            })} 
          />
          <Stack.Screen
            name="HomePage"
            component={Home}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          />
          <Stack.Screen
            name="GoalsSection"
            component={GoalsSection}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          />
          <Stack.Screen
            name="HabitPage"
            component={HabitPage}
            options={() => ({
              headerTitle: () => null,
            })} 
          />
          <Stack.Screen
            name="ProjectPage"
            component={ProjectPage}
            options={() => ({
              headerTitle: () => null,
            })} 
          />
          <Stack.Screen
            name="HappinessPage"
            component={HappinessPage}
            options={() => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image source={require('./static/logo.png')} style={styles.companyLogo} />
               ),
            })} 
          />
          <Stack.Screen
            name="DayFocus"
            component={DayFocus}
            options={() => ({
              headerTitle: () => null,
            })} 
          />
          <Stack.Screen
            name="HappinessInput"
            component={HappinessInput}
            options={() => ({
              headerTitle: () => null,
            })} 
          />
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
