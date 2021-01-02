import React, { useState, useEffect } from 'react'
import { 
  AppState,
  View,
  Text,
  SectionList,
  Keyboard,
  Vibration,
  Image,
  TouchableOpacity,
} from 'react-native'
import { DraxProvider, DraxView } from 'react-native-drax'
import EStyleSheet from 'react-native-extended-stylesheet'

import Api from '../Api.js'
import AddTask from '../components/AddElem/AddTask'
import Footer from '../components/Footer'
import AddButton from '../components/AddButton'
import FocusButton from '../components/FocusButton'
import TaskDescription from '../components/TaskDescription'
import SimpleTask from '../components/Task/SimpleTask'
import RoutineTask from '../components/Task/RoutineTask'

import {
  sortTasks,
  todayDate,
  weekDayDate,
  lastWeekDate,
  lastMonthDate,
  decomposeItemsWeek,
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


function WeeklyTaskList (props) {
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [describeTask, setDescribeTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [showDeletion, setShowDeletion] =useState(false)
  const [date, setDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState([weekDayDate(new Date(), 0), weekDayDate(new Date(), 7)])
  const [itemsMonday, setItemsMonday] = useState([])
  const [itemsTuesday, setItemsTuesday] = useState([])
  const [itemsWednesday, setItemsWednesday] = useState([])
  const [itemsThursday, setItemsThursday] = useState([])
  const [itemsFriday, setItemsFriday] = useState([])
  const [itemsSaturday, setItemsSaturday] = useState([])
  const [itemsSunday, setItemsSunday] = useState([])
  const api = new Api()

  useEffect(() => {
    AppState.addEventListener("change", getAllItems)
    Keyboard.addListener('keyboardDidHide', () => setIsAddingTask(false))
    return () => {
      AppState.addEventListener("change", getAllItems)
      Keyboard.removeListener('keyboardDidHide',  () => setIsAddingTask(false))
    }
  }, [])

  useEffect(() => {
    getAllItems() 
  },[props.task]) 
  
  const getAllItems = async () => {
    const response = await api.getTasks({from: weekDates[0].toJSON(), until: weekDates[1].toJSON()})
    const allTasks = await response.json()
    
  
   if (allTasks) {
      const weekDaysTasks = decomposeItemsWeek(allTasks, date, 'task')
      const weekDaysProjects = decomposeItemsWeek(props.projects, date, 'project')
      const weekDaysGoals = decomposeItemsWeek(props.goals, date, 'goal')


      setItemsMonday([...weekDaysGoals[0], ...weekDaysProjects[0], ...weekDaysTasks[0]])
      setItemsTuesday([...weekDaysGoals[1], ...weekDaysProjects[1], ...weekDaysTasks[1]])
      setItemsWednesday([...weekDaysGoals[2], ...weekDaysProjects[2], ...weekDaysTasks[2]])
      setItemsThursday([...weekDaysGoals[3], ...weekDaysProjects[3], ...weekDaysTasks[3]])
      setItemsFriday([...weekDaysGoals[4], ...weekDaysProjects[4], ...weekDaysTasks[4]])
      setItemsSaturday([...weekDaysGoals[5], ...weekDaysProjects[5], ...weekDaysTasks[5]])
      setItemsSunday([...weekDaysGoals[6], ...weekDaysProjects[6], ...weekDaysTasks[6]])
    }
    setIsRefreshing(false)
  }

  
  
  const id2List = {
    Monday: itemsMonday,
    Tuesday: itemsTuesday,
    Wednesday: itemsWednesday,
    Thursday: itemsThursday,
    Friday: itemsFriday,
    Saturday: itemsSaturday,
    Sunday: itemsSunday,
  }

  const id2DueDate = id => {

    const matrix = {
      monday: weekDayDate(date, 0),
      tuesday: weekDayDate(date, 1),
      wednesday: weekDayDate(date, 2),
      thursday: weekDayDate(date, 3),
      friday: weekDayDate(date, 4),
      saturday: weekDayDate(date, 5),
      sunday: weekDayDate(date, 6),
    }
    return matrix[id]

  }

  const getList = id => id2List[id]

  const DATA = [
    {
      title: "Monday",
      data: itemsMonday 
    },
    {
      title: "Tuesday",
      data: itemsTuesday 
    },
    {
      title: "Wednesday",
      data: itemsWednesday, 
    },
    {
      title: "Thursday",
      data: itemsThursday 
    },
    {
      title: "Friday",
      data: itemsFriday
    },
    {
      title: "Saturday",
      data: itemsSaturday
    },
    {
      title: "Sunday",
      data: itemsSunday
    },
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

          if (result.monday)
            setItemsMonday(sortTasks(result.monday))
          if (result.tuesday)
            setItemsTuesday(sortTasks(result.tuesday))
          if (result.wednesday)
            setItemsWednesday(sortTasks(result.wednesday))
          if (result.thursday)
            setItemsThursday(sortTasks(result.thursday))
          if (result.friday)
            setItemsFriday(sortTasks(result.friday))
          if (result.saturday)
            setItemsSaturday(sortTasks(result.saturday))
          if (result.sunday)
            setItemsSunday(sortTasks(result.sunday))
        api.updateTask(action.draggableId, {dueDate: id2DueDate(action.destination.droppableId)})
          .then(resp => {
            if (resp.status !== 200)
              getTasks()
          })
       }
    }

  const onCreateTask = (task) => {
    const newDate = new Date()
    if ((weekDates[0] <= newDate && weekDates[1] > newDate) || weekDates[0] <= newDate) {
      const newDateDay = newDate.getDay()
      if (newDateDay === 1) setItemsMonday(sortTasks([...itemsMonday, task]))
      else if (newDateDay === 2) setItemsTuesday(sortTasks([...itemsTuesday, task]))
      else if (newDateDay === 3) setItemsWednesday(sortTasks([...itemsWednesday, task]))
      else if (newDateDay === 4) setItemsThursday(sortTasks([...itemsThursday, task]))
      else if (newDateDay === 5) setItemsFriday(sortTasks([...itemsFriday, task]))
      else if (newDateDay === 6) setItemsSaturday(sortTasks([...itemsSaturday, task]))
      else if (newDateDay === 0) setItemsSunday(sortTasks([...itemsSunday, task]))
    }
    else
      setItemsMonday(sortTasks([...itemsMonday, task]))
  }

  const getFunctions = (title) => {
    if (title === 'Monday')
      return [itemsMonday, setItemsMonday]
    else if (title === 'Tuesday')
      return [itemsTuesday, setItemsTuesday]
    else if (title === 'Wednesday')
      return [itemsWednesday, setItemsWednesday]
    else if (title === 'Thursday')
      return [itemsThursday, setItemsThursday]
    else if (title === 'Friday')
      return [itemsFriday, setItemsFriday]
    else if (title === 'Saturday')
      return [itemsSaturday, setItemsSaturday]
    else if (title === 'Sunday')
      return [itemsSunday, setItemsSunday]

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
	    <FocusButton type={'week'} navigation={props.navigation}/>
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
                <View style={styles.navigation}>
                  <Footer
                    current={'tasks'} 
                    navigation={props.navigation}
                  />
                </View>
              )}
              {!draggedTask && !isAddingTask && (
                <AddButton 
                  style={styles.addButton}
                  onClick={() => setIsAddingTask(true)} 
                />
              )}
              {!draggedTask && isAddingTask && (
                <View style={[styles.addTaskContainer, {backgroundColor: showDeletion ? 'lightblue': 'white'}]}>
                  <AddTask
                    isWeek={true}
                    onCreate={onCreateTask}
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

const styles = EStyleSheet.create({
  wrapper: {
    height: '100%'
  },
  listContainer: {
    height: '92%'
  },
  listContainerDragged: {
    height: '88%'
  },
  navigation:{
    height: '8%',
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
    fontSize: '18rem',
    fontWeight: 'bold',
    marginBottom: '10rem',
    color: '#32A3BC',
  },
  backgroundItem: {
    height: '40rem',
    backgroundColor: '#E5E5E5'
  },
  backgroundReceivingItem: {
    height: '40rem',
    backgroundColor: 'lightblue'
  },
  backgroundTitle: {
    height: '50rem',
    flexDirection: 'column-reverse',
    left: '10rem',
  },
  backgroundReceivingTitle: {
    height: '50rem',
    flexDirection: 'column-reverse',
    left: '10rem',
    backgroundColor: 'lightblue'
  },
  trashImage: {
    height: '52rem',
    width: '50rem'
  },
  addButton: {
    position: 'absolute',
    bottom: '90rem',
    right: '30rem',
  },
})


export default WeeklyTaskList
