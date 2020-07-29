import React, { useState } from 'react'
import {
  View,
} from 'react-native';

import TodayTaskList from './TodayTaskList'


export default function Home (props) {
  const [task, setTask] = useState(null)

  return (
    <View>
      <TodayTaskList task={task} onDescribe={setTask}/>
    </View>
  )
}

