import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  CheckBox,
  Image,
  SectionList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import Api from '../Api.js'
import AddTask from '../components/AddTask'
import {
  todayDate,
  decomposeTasksToday,
} from '../utils'


const Item = (props) => {
  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {isDone: !props.item.isDone})
    props.onUpdate()
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()

  }
  return(
    <View 
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}> 
        <CheckBox 
          value={props.item.isDone}
          onValueChange={onCheckboxChange}
        />
        <View style={{flexGrow: 1, }} onClick={() => props.onDescribe(props.task ? null : props.item)}>
        <Text style={{fontSize:13, textDecorationLine: props.item.isDone ? 'line-through': null, color: props.item.isDone ? 'grey': 'black'}}>{props.item.content}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity 
          style={{backgroundColor: props.item.list === 'Personal' ? 'blue' : 'brown', borderRadius: 60}}
          onPress={onListChange}
        >
          <View style={{margin: 2}}>
            <Text style={{fontSize: 9, fontWeight: 'bold',  color: 'white'}}>{props.item.list}</Text>
          </View>
        </TouchableOpacity>
      
      </View>
    </View>
  )  
}

function TodayTaskList (props) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [itemsUnfinished, setItemsUnifinished] = useState([])
  const [itemsToday, setItemsToday] = useState([])
  const [itemsTomorrow, setItemsTomorrow] = useState([])
  const [itemsUpcoming, setItemsUpcoming] = useState([])
  const [itemsSomeday, setItemsSomeday] = useState([])
  const api = new Api()


  useEffect(() => {
    getTasks() 
  },[props.task]) 


  const getTasks = async () => {
    setIsRefreshing(true)
    const response = await api.getTasks({from: todayDate().toJSON(), someday: true, unfinished: true})
    const allTasks = await response.json()

    if (allTasks) {
      const { unfinishedTasks, todayTasks, tomorrowTasks, upcomingTasks, somedayTasks } = decomposeTasksToday(allTasks)

      setItemsUnifinished(unfinishedTasks)
      setItemsToday(todayTasks)
      setItemsTomorrow(tomorrowTasks)
      setItemsUpcoming(upcomingTasks)
      setItemsSomeday(somedayTasks)
    }
    setIsRefreshing(false)
  }

  const DATA = [
  {
    title: "Unfinished",
    data: itemsUnfinished 
  },
  {
    title: "Today",
    data: itemsToday 
  },
  {
    title: "Upcoming",
    data: itemsUpcoming 
  },
  {
    title: "Someday",
    data: itemsSomeday 
  }
]

  return (
    <View>
      <SafeAreaView>
        <View style={{height: '80%'}}>
          <SectionList
            refreshing={isRefreshing}
            onRefresh={() => getTasks()}
            sections={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item item={item} onUpdate={getTasks} />}
            renderSectionHeader={({ section }) => {
              if (section.title === 'Unfinished' && !section.data.length)
                return null
              else {
                return (
                  <Text style={{fontSize: 18}}>{section.title}</Text>
                )
              }
            }}
          />     
        </View>
          <View style={{height: '20%', justifyContent: 'center'}}>
          <AddTask onUpdate={getTasks}/>
          </View>
      </SafeAreaView>
    </View>
  )
}



export default TodayTaskList
