import React, { useState, useLayoutEffect } from 'react'
import { CommonActions } from '@react-navigation/native'
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

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
        <TouchableOpacity
          onPress={() => {
            const api = new Api()
            api.logout()
            props.navigation.dispatch(homeAction('LoginPage'))
          }}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
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
})
