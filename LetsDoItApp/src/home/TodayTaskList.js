import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  SectionList,
  Vibration,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import { DraxProvider, DraxView } from 'react-native-drax'
import CheckBox from '@react-native-community/checkbox'
import Api from '../Api.js'
import AddTask from '../components/AddTask'

import {
  todayDate,
  decomposeTasksToday,
} from '../utils'

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = JSON.parse(JSON.stringify(source))
    const destClone = JSON.parse(JSON.stringify(destination))
    const index = sourceClone.map(x=>x.id).indexOf(droppableDestination.id)
    const [removed] = sourceClone.splice(index, 1)

    destClone.splice(0, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
}

const Item = (props) => {
  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {doneAt: !props.item.doneAt ? new Date() : null})
    props.onUpdate()
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()
  }

  return(
    <View 
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 37, backgroundColor: props.isSelected ? 'lightgreen' :'white', borderRadius: 40, marginHorizontal: 5, elevation: props.item.doneAt ? 0 : 20}}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', width: '80%', left: 10}}> 
        <CheckBox 
          value={props.item.doneAt ? true : false}
          onValueChange={onCheckboxChange}
        />
        <View style={{flexGrow: 1, }} onClick={() => props.onDescribe(props.task ? null : props.item)}>
        <Text style={{fontSize:14, textDecorationLine: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}}>{props.item.content}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity 
          style={{backgroundColor: props.item.list === 'Personal' ? 'blue' : 'brown', borderRadius: 60, marginHorizontal: 10, elevation: 6}}
          onPress={onListChange}
        >
          <View style={{margin: 2}}>
            <Text style={{fontSize: 10, fontWeight: 'bold',  color: 'white'}}>{props.item.list}</Text>
          </View>
        </TouchableOpacity>
      
      </View>
    </View>
  )  
}

function TodayTaskList (props) {
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [draggedTask, setDraggedTask] = useState(null)
  const [showDeletion, setShowDeletion] =useState(false)
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
  
  const id2List = {
    Unfinished: itemsUnfinished,
    Today: itemsToday,
    Tomorrow: itemsTomorrow,
    Upcoming: itemsUpcoming,
    Someday: itemsSomeday,
  }

  const id2DueDate = id => {
    const matrix = {
      Today: new Date().toJSON(),
      Tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)).toJSON(),
      Upcoming: new Date(new Date().setDate(new Date().getDate() + 7)).toJSON(),
      Someday: null,
    }
    return matrix[id]

  }

  const getList = id => id2List[id]

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
      title: "Tomorrow",
      data: itemsTomorrow, 
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
  
  const onDragEnd = action => {
      const { source, destination } = action

      // dropped outside the list
      if (!destination) {
          return
      }

      if (source.droppableId !== destination.droppableId && destination.droppableId !== 'Unfinished') {
          const result = move(
            getList(source.droppableId),
            getList(destination.droppableId),
            source,
            destination
          )

        if (result.Unfinished)
          setItemsUnifinished(result.Unfinished)
        if (result.Today)
          setItemsToday(result.Today)
        if (result.Tomorrow)
          setItemsTomorrow(result.Tomorrow)
        if (result.Upcoming)
          setItemsUpcoming(result.Upcoming)
        if (result.Someday)
          setItemsSomeday(result.Someday)

           
          api.updateTask(source.id, {dueDate: id2DueDate(destination.droppableId)})
            .then(getTasks)
        }
    }


  return (
    <View>
      <SafeAreaView>
        <View style={{height: '100%'}}>
        <DraxProvider>
          <View style={{height: '80%'}}>
            <SectionList
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true)
                getTasks()
              }}
              sections={DATA}
              keyExtractor={(item) => item.id}
              renderItem={({ item, section }) => (
                <DraxView
                  style={{height: 40, backgroundColor: '#E5E5E5'}}
                  receivingStyle={{height: 40, backgroundColor: 'lightblue'}}
                  renderContent={({ viewState }) => {
                    return (
                      <Item item={item} onUpdate={getTasks} isSelected={draggedTask && draggedTask.id === item.id} />
                    )
                  }}
                  longPressDelay={1000}
                  animateSnapback={false}
                  onDragStart={(event)=> {
                    setDraggedTask({id: item.id, droppableId: section.title})
                    Vibration.vibrate()
                  }}
                  onReceiveDragDrop={(event) => {
                    const destination = {droppableId: section.title}
                    if (draggedTask)
                      onDragEnd({source: draggedTask, destination})
                    setDraggedTask(null)
                  }}
                  onDragEnd={() => setDraggedTask(null)}
                 />
              )}
              renderSectionHeader={({ section }) => {
                if (section.title === 'Unfinished' && !section.data.length)
                  return null
                else {
                  return (
                    <DraxView
                      noHover={true}
                      style={{height: 50, flexDirection: 'column-reverse', left: 10}}
                      receivingStyle={{height: 50, flexDirection: 'column-reverse', left: 10, backgroundColor: 'lightblue'}}
                      renderContent={({ viewState }) => {
                        return (
                          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>{section.title}</Text>
                        )
                      }}
                      onReceiveDragEnter={(event) => {console.log(event)}}
                      onReceiveDragDrop={(event) => {
                        const destination = {droppableId: section.title}
                        if (draggedTask)
                          onDragEnd({source: draggedTask, destination})
                        setDraggedTask(null)
                      }}
                    />
                  )
                }
              }}
            />     
            </View>
            <View style={{height: '15%', justifyContent: 'center', backgroundColor: showDeletion ? 'lightblue': 'white'}}>
              {!draggedTask && (
                <AddTask onUpdate={getTasks}/>
              )}
              {draggedTask && (
                  <DraxView
                    noHover={true}
                    onReceiveDragEnter={() => setShowDeletion(true)}
                    onReceiveDragExit={() => setShowDeletion(false)}
                    renderContent={({ viewState }) => {
                      return (
                        <View style={{alignItems: 'center'}}>
                          <Image 
                            source={require('../../static/trash.png')}
                            style={{height: 52, width: 50}}
                          /> 
                        </View>
                      )
                    }}
                    onReceiveDragDrop={(event) => {
                      api.deleteTask(draggedTask.id)
                        .then(() => {
                          getTasks()
                          setDraggedTask(null)
                          setShowDeletion(false)
                        })
                      
                    }}
                    onDragEnd={() => setDraggedTask(null)}
                  />
              )}
            </View>
          </DraxProvider>
        </View>
      </SafeAreaView>
    </View>
  )
}



export default TodayTaskList
