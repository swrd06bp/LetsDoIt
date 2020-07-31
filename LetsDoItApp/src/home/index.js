import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
} from 'react-native';

import TodayTaskList from './TodayTaskList'


export default function Home (props) {
  const [task, setTask] = useState(null)

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
