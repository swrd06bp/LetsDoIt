import React, { useState, useEffect, useLayoutEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import {
  SafeAreaView,
  View,
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
import EStyleSheet from 'react-native-extended-stylesheet'
import messaging from '@react-native-firebase/messaging'

import TodayTaskList from './TodayTaskList'
import WeeklyTaskList from './WeeklyTaskList'
import { todayDate } from '../../utils'
import Api from '../../Api'

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
  const [isWeekly, setIsWeekly] = useState(false)
  const [allProjects, setAllProjects] = useState([])
  const [allGoals, setAllGoals] = useState([])
  const api = new Api()

  useEffect(() => {
    getData()
    checkPermission()
  }, [])

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission()
    // If Premission granted proceed towards token fetch
    if (enabled) {
      getToken()
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method. 
      requestPermission()
    }
  }

  const getToken = async () => {
    const fcmToken = await messaging().getToken()
    console.log('token', fcmToken)
    const resp = await api.getNotifications()
    const json = await resp.json()

    if (!json.map(x => x.fcmToken).includes(fcmToken))
       await api.postNotifications({fcmToken})

    return fcmToken
  }

  const requestPermission = async () => {
    try {
      await messaging().requestPermission()
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  const getData = async () => {
    const respGoals = await api.getGoals()
    const resultGoals = await respGoals.json()
    const respProjects = await api.getProjects()
    const resultProjects = await respProjects.json()
    setAllGoals(resultGoals)
    setAllProjects(resultProjects)
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => {
            const newIsWeekly = !isWeekly
            setIsWeekly(newIsWeekly)
          }} >
            <Text>See {isWeekly ? 'dayly' : 'weekly'} tasks</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
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
  }, [isWeekly])

  return (
    <SafeAreaView>
      <View style={styles.todayTaskList}>
      {isWeekly && (
        <WeeklyTaskList 
          navigation={props.navigation}
          task={task}
          projects={allProjects}
          goals={allGoals}
          onDescribe={setTask}
          navigation={props.navigation}
        />
      )}
      {!isWeekly && (
        <TodayTaskList
          task={task}
          projects={allProjects} 
          goals={allGoals}
          onDescribe={setTask}
          navigation={props.navigation}
        />
      )}
      </View>
    </SafeAreaView>
  )
}

const styles = EStyleSheet.create({
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
    height: '25rem',
    width: '25rem',
    marginRight: '10rem',
  },
})
