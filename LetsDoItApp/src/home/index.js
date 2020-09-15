import React, { useState, useEffect, useLayoutEffect } from 'react'
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
import { todayDate } from '../utils'
import Api from '../Api'

function homeAction(routeName) {
  return CommonActions.reset({
    index: 0,
    routes: [
      {name: routeName},
    ],
  })
}

function CheckYourself (props) {
  const [showLink, setShowLink] = useState(false)

  useEffect(() => {
    getHappiness() 
  }, [])

  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness(1)
    const json = await resp.json()
    if (!json.length || new Date(json[0].createdAt) < todayDate()) 
      setShowLink(true) 
  }

  if (!showLink) return null

  return (
    <TouchableOpacity
      onPress={() => {props.navigation.navigate('HappinessInput')}}
    >
      <Text style={styles.headerTitle}>Check yourself</Text>
    </TouchableOpacity>
  )
}

export default function Home (props) {
  const [task, setTask] = useState(null)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => <CheckYourself navigation={props.navigation} />,
      headerRight: () => (
        <View>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
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
  headerTitle: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'blue',

  },
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
