import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  SectionList,
  Keyboard,
  Vibration,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { DraxProvider, DraxView } from 'react-native-drax'
import Api from '../Api.js'
import AddTask from '../components/AddElem/AddTask'
import AddButton from '../components/AddButton'
import FocusButton from '../components/FocusButton'
import TaskDescription from '../components/TaskDescription'
import SimpleTask from '../components/Task/SimpleTask'
import RoutineTask from '../components/Task/RoutineTask'

import {
  sortTasks,
  todayDate,
  lastWeekDate,
  lastMonthDate,
  decomposeTasksToday,
  generateRoutineTask,
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
  const [isAddingTask, setIsAddingTask] = useState(false)
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
    Keyboard.addListener('keyboardDidHide', () => setIsAddingTask(false))
    getAllItems() 
    return () => Keyboard.removeAllListeners('keyboardDidHide')
  },[props.task]) 
  
  const getAllTasks = async () => {
    const response = await api.getTasks({
      from: todayDate().toJSON(),
      someday: true,
      unfinished: true,
    })
    const allTasks = await response.json()
  
    if (allTasks)
      return  decomposeTasksToday(allTasks)
    else 
      return {
        unfinishedTasks: [],
        todayTasks: [],
        tomorrowTasks: [],
        upcomingTasks: [],
        somedayTasks: []
      }
  }
  
  const getAllRoutines = async () => {
    const response = await api.getHabits({unfinished: true})
    const allHabits = await response.json()

    let allRoutineTasks = []
    for (let habit of allHabits) {
      // get the doneRoutines
      const since = habit.frequency.type === 'day' ? todayDate() 
        : (habit.frequency.type === 'week' ? lastWeekDate() : lastMonthDate())
      const response = await api.getRoutinesHabit({
        habitId: habit._id,
        isDone: true,
        since,
        limit: habit.frequency.number,
      })
      const doneRoutines = await response.json()

      // get the unDoneRoutines
      const resp = await api.getRoutinesHabit({
        habitId: habit._id,
        isDone: false,
        since,
        limit: 1,
      })
      const unDoneRoutines = await resp.json()
      
      const routineTask = generateRoutineTask({habit, doneRoutines, unDoneRoutines})
      if (routineTask)
        allRoutineTasks.push(routineTask)
    }

    return allRoutineTasks
  }
  
  const getAllItems = async () => {
    // get all routines
    const allRoutineTasks = await getAllRoutines()
      
    // get all tasks
    const { 
      unfinishedTasks,
      todayTasks,
      tomorrowTasks,
      upcomingTasks,
      somedayTasks
    } = await getAllTasks()


    setItemsUnifinished(unfinishedTasks)
    setItemsToday([...allRoutineTasks, ...todayTasks])
    setItemsTomorrow(tomorrowTasks)
    setItemsUpcoming(upcomingTasks)
    setItemsSomeday(somedayTasks)
    
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
            .then(getAllItems)
        }
    }

  const onCreate = (task) => {
    setItemsToday(sortTasks([task, ...itemsToday]))
  }

  const getFunctions = (title) => {
    if (title === 'Today')
      return [itemsToday, setItemsToday]
    else if (title === 'Tomorrow')
      return [itemsTomorrow, setItemsTomorrow]
    else if (title === 'Upcoming')
      return [itemsUpcoming, setItemsUpcoming]
    else if (title === 'Someday')
      return [itemsSomeday, setItemsSomeday]
    else if (title === 'Unfinished')
      return [itemsUnfinished, setItemsUnifinished]
  }

  const getDeletedList = (taskId, title) => {
    const [listTasks, setListFunction] = getFunctions(title)
    const index = listTasks.map(x => x._id).indexOf(taskId)
    listTasks.splice(index, 1)
    setListFunction([...listTasks])
  }

  const getDoneList = (taskId, title) => {
    const [listTasks, setListFunction] = getFunctions(title)
    listTasks.map(x => {
      if(x._id === taskId) {
        x.doneAt = x.doneAt ? null : new Date()
        return x
      }
      else
        return x
    })
    setListFunction([...listTasks])
    getAllItems()
  }
  

  return (
    <View>
      {describeTask && ( <TaskDescription 
        task={describeTask}
        projects={props.projects}
        goals={props.goals}
        isVisible={describeTask ? true : false} 
        onDescribe={setDescribeTask}
        onUpdate={getAllItems}
      />)}
      <View style={styles.wrapper}>
	    <FocusButton type={'day'} navigation={props.navigation}/>
        <DraxProvider>
          <View style={draggedTask || isAddingTask ? styles.listContainerDragged : styles.listContainer}>
            <SectionList
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true)
                getAllItems()
              }}
              sections={DATA}
              keyExtractor={(item) => item.id}
              renderItem={({ item, section }) => (
                <DraxView
                  style={styles.backgroundItem}
                  receivingStyle={styles.backgroundReceivingItem}
                  renderContent={({ viewState }) => {
                    if (item.type === 'task')
                      return (
                        <TouchableOpacity onPress={() => setDescribeTask(item)}>
                        <SimpleTask 
                          item={item}
                          projects={props.projects}
                          goals={props.goals}
                          onUpdate={getAllItems}
                          isSelected={draggedTask && draggedTask.id === item.id} 
                          onDoneChange={(taskId) => {
                            getDoneList(taskId, section.title)
                          }}
                        />
                        </TouchableOpacity>
                      )
                    else if (item.type === 'routine')
                      return (
                        <RoutineTask
                          item={item}
                          onDescribe={() => {}}
                          onUpdate={getAllItems}
                        />
                      )

                  }}
                  longPressDelay={1000}
                  animateSnapback={false}
                  onDragStart={(event)=> {
                    setDraggedTask({id: item.id, droppableId: section.title})
                    Vibration.vibrate(200)
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
              {!draggedTask && !isAddingTask && (
                <AddButton 
                  style={styles.addButton}
                  onClick={() => setIsAddingTask(true)} 
                />
              )}
              {!draggedTask && isAddingTask && (
                <View style={[styles.addTaskContainer, {backgroundColor: showDeletion ? 'lightblue': 'white'}]}>
                  <AddTask 
                    onCreate={(task, chosenDateOption) => {
                      if (chosenDateOption === 'Today')
                        setItemsToday(sortTasks([task, ...itemsToday]))
                      else if (chosenDateOption === 'Tomorrow')
                        setItemsTomorrow(sortTasks([task, ...itemsTomorrow]))
                      else if (chosenDateOption === 'Next Monday')
                        setItemsUpcoming(sortTasks([task, ...itemsUpcoming]))
                      else if (chosenDateOption === 'Someday')
                        setItemsSomeday(sortTasks([task, ...itemsSomeday]))
                    }}
                    onUpdate={getAllItems}
                  />
                </View>
              )}
              {draggedTask && (
                <View style={[styles.removeTaskContainer, {backgroundColor: showDeletion ? 'lightblue': 'white'}]}>
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
                          Vibration.vibrate(400)
                          getDeletedList(draggedTask.id, draggedTask.droppableId)
                          setDraggedTask(null)
                          setShowDeletion(false)
                        })
                      
                    }}
                    onDragEnd={() => setDraggedTask(null)}
                  />
                </View>
              )}
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
    height: '100%'
  },
  listContainerDragged: {
    height: '88%'
  },
  addTaskContainer: {
    height: '22%',
    justifyContent: 'center',
  },
  removeTaskContainer: {
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
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
})


export default TodayTaskList
