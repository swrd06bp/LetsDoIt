import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  SectionList,
  Vibration,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { DraxProvider, DraxView } from 'react-native-drax'
import Api from '../Api.js'
import AddTask from '../components/AddTask'
import TaskDescription from '../components/TaskDescription'
import Task from '../components/Task'

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


function TodayTaskList (props) {
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [describeTask, setDescribeTask] = useState(null)
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
      {describeTask && ( <TaskDescription 
        task={describeTask}
        isVisible={describeTask ? true : false} 
        onDescribe={setDescribeTask}
        onUpdate={getTasks}
      />)}
      <View style={styles.wrapper}>
        <DraxProvider>
          <View style={styles.listContainer}>
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
                  style={styles.backgroundItem}
                  receivingStyle={styles.backgroundReceivingItem}
                  renderContent={({ viewState }) => {
                    return (
                      <TouchableOpacity onPress={() => setDescribeTask(item)}>
                      <Task 
                        item={item}
                        onUpdate={getTasks}
                        isSelected={draggedTask && draggedTask.id === item.id} 
                      />
                      </TouchableOpacity>
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
                      style={styles.backgroundTitle}
                      receivingStyle={styles.backgroundReceivingTitle}
                      renderContent={({ viewState }) => {
                        return (
                          <Text style={styles.sectionTitleColor}>{section.title}</Text>
                        )
                      }}
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
            <View style={[styles.addTaskContainer, {backgroundColor: showDeletion ? 'lightblue': 'white'}]}>
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
                            style={styles.trashImage}
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
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%'
  },
  listContainer: {
    height: '88%'
  },
  addTaskContainer: {
    height: '12%',
    justifyContent: 'center',
  },
  sectionTitleColor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#32A3BC',
  },
  backgroundItem: {
    height: 40,
    backgroundColor: '#E5E5E5'
  },
  backgroundReceivingItem: {
    height: 40,
    backgroundColor: 'lightblue'
  },
  backgroundTitle: {
    height: 50,
    flexDirection: 'column-reverse',
    left: 10,
  },
  backgroundReceivingTitle: {
    height: 50,
    flexDirection: 'column-reverse',
    left: 10,
    backgroundColor: 'lightblue'
  },
  trashImage: {
    height: 52,
    width: 50
  },
})


export default TodayTaskList
