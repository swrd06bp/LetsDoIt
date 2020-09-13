import React, { useState, useLayoutEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import TodayTaskList from './TodayTaskList'
import Api from '../Api'

function homeAction(routeName) {
  return CommonActions.reset({
    index: 0,
    routes: [
      {name: routeName},
    ],
  })
}

export default function Home (props) {
  const [task, setTask] = useState(null)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => props.navigation.navigate('ListGroceries')}>
            <Text>Grocery</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
            const api = new Api()
            api.logout()
            props.navigation.dispatch(homeAction('LoginPage'))
          }} >
            <Text>Logout</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [])

  return (
    <SafeAreaView>
      <View style={styles.todayTaskList}>
      <TodayTaskList task={task} onDescribe={setTask}/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  todayTaskList: {
    height: '100%',
  },
  footer: {
    backgroundColor: 'white',
    height: '10%', 
    borderWidth: 1,
    borderColor: 'lightblue',
  }, 
  optionImage: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
})
