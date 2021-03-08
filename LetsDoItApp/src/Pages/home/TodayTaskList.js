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
  ActivityIndicator,
} from 'react-native'
import moment from 'moment'
import EStyleSheet from 'react-native-extended-stylesheet'
import { DraxProvider, DraxView } from 'react-native-drax'

import Api from '../../Api'
import Footer from '../../components/Footer'
import AddTask from '../../components/AddElem/AddTask'
import AddButton from '../../components/AddButton'
import FocusButton from '../../components/FocusButton'
import TaskDescription from '../../components/TaskDescription'
import HappinessTask from '../../components/Task/HappinessTask'
import SimpleTask from '../../components/Task/SimpleTask'
import RoutineTask from '../../components/Task/RoutineTask'


import {
  sortTasks,
  todayDate,
  lastWeekDate,
  lastMonthDate,
  decomposeTasksToday,
  generateRoutineTask,
} from '../../utils'

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


  const number = (new Date()).getFullYear()*1000 
    + (Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) 
      - Date.UTC(new Date().getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
 

  useEffect(() => {
    AppState.addEventListener("change", getAllItems)
    Keyboard.addListener('keyboardDidHide', () => setIsAddingTask(false))
    return () => {
      Keyboard.removeListener('keyboardDidHide', () => setIsAddingTask(false))
      AppState.addEventListener("change", getAllItems)
    }
  }, [])


  useEffect(() => {  
    getAllItems() 
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
      const isFinishedGoal = props.goals.filter(x => x._id === habit.goalId && x.doneAt).length > 0
      if (isFinishedGoal)
        continue
      // get the doneRoutines
      const since = habit.frequency.type === 'day' ? todayDate().toJSON() 
        : (habit.frequency.type === 'week' ? lastWeekDate().toJSON() : lastMonthDate().toJSON())
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

  const getHappiness = async () => {
    const resp = await api.getHappiness({currentYear: parseInt(moment(new Date()).format('YYYY')), limit: 1})
    const json = await resp.json()
    if (!json.length || new Date(json[0].dueDate) < todayDate()) 
      return [{id: 'happiness', type: 'happiness'}]
    else 
      return []
  }
  
  const getAllItems = async () => {
    const happinessTask = await getHappiness()

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
    setItemsToday([...happinessTask, ...allRoutineTasks, ...todayTasks])
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

  const isDataEmpty = itemsUnfinished.length === 0
    && itemsToday.length === 0
    && itemsTomorrow.length === 0
    && itemsSomeday.length === 0


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
      {!isAddingTask && (
        <View style={styles.wrapper}>
	    
        <FocusButton type={'day'} number={number} navigation={props.navigation}/>
        <DraxProvider>
          <View style={draggedTask ? styles.listContainerDragged : styles.listContainer}>
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
                    if (item.type === 'routine')
                      return (
                        <RoutineTask
                          item={item}
                          onDescribe={() => {}}
                          onUpdate={getAllItems}
                        />
                      )
                    else if (item.type === 'happiness')
                      return (
                        <HappinessTask
                          navigation={props.navigation}
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
                if ((section.title === 'Unfinished' && section.data.length === 0) || (section.data.length === 0 && !draggedTask))
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
            
             {isDataEmpty && !isRefreshing && (
              <View style={styles.noDataContainer}>
              <TouchableOpacity style={styles.noDataButton} onPress={() => setIsAddingTask(true)}>
               <Text style={styles.noDataText}>No task for now</Text>
               <Text style={styles.noDataAddText}>Add a new one</Text>
              </TouchableOpacity>
              </View>
            )}
            {isDataEmpty && isRefreshing && (
              <View style={styles.noDataContainer}>
                <ActivityIndicator size='large' />
              </View>
            )}                    

            </View>
              {!draggedTask && (
                <View style={styles.navigation}>
                  <Footer
                    current={'tasks'} 
                    navigation={props.navigation}
                  />
                </View>
              )}
              {!draggedTask && (
                <AddButton 
                  style={styles.addButton}
                  onClick={() => setIsAddingTask(true)} 
                />
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
                            source={require('../../../static/trash.png')}
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
       )}
       {isAddingTask && (
        <View style={styles.addTaskContainer}>
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
  navigation: {
    height: '8%',
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
  noDataContainer: {
    alignItems: 'center'
  },
  noDataButton: {
    alignItems: 'center'
  },
  noDataText: {
    fontSize: '14rem',
  },
  noDataAddText: {
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: '14rem'
  },
})


export default TodayTaskList
