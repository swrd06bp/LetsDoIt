import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useMixpanel } from 'react-mixpanel-browser'
import moment from 'moment'

import Api from '../../app/Api'
import TaskList from '../../components/TaskList'
import AddTask from '../../components/AddTask'
import WeekGoal from '../../components/WeekGoal'
import { getDimRatio } from '../../app/DynamicSizing'
import {
  sortTasks,
  todayDate,
  lastWeekDate,
  lastMonthDate,
  decomposeTasksToday,
  generateRoutineTask,
} from '../../app/utils'
import { 
  updateSocketElems,
  removeSocketListener 
} from '../../app/socket'


const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
}




function TodayTaskList (props) {
  const [itemsUnfinished, setItemsUnifinished] = useState([])
  const [itemsToday, setItemsToday] = useState([])
  const [itemsTomorrow, setItemsTomorrow] = useState([])
  const [itemsUpcoming, setItemsUpcoming] = useState([])
  const [itemsSomeday, setItemsSomeday] = useState([])
  const api = new Api()
  const mixpanel = useMixpanel()


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
    const api = new Api()
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
    setItemsToday(sortTasks([
      ...happinessTask,
      ...allRoutineTasks,
      ...todayTasks
    ]))
    setItemsTomorrow(tomorrowTasks)
    setItemsUpcoming(upcomingTasks)
    setItemsSomeday(somedayTasks)
  }


  useEffect(() => {
    updateSocketElems('tasks', (err, data) => getAllItems())
    updateSocketElems('routines', (err, data) => getAllItems())
    updateSocketElems('happiness', (err, data) => getHappiness())
    getAllItems() 
    return () => {
      removeSocketListener('tasks')
      removeSocketListener('routines')
      removeSocketListener('happiness')
}
  },[props.task]) 


  
  const id2List = {
    unfinished: itemsUnfinished,
    today: itemsToday,
    tomorrow: itemsTomorrow,
    upcoming: itemsUpcoming,
    someday: itemsSomeday,
  }

  const id2DueDate = id => {
    const matrix = {
      today: new Date().toJSON(),
      tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)).toJSON(),
      upcoming: new Date(new Date().setDate(new Date().getDate() + 7)).toJSON(),
      someday: null,
    }
    return matrix[id]

  }

  const getList = id => id2List[id]

  const onDragEnd = action => {
      const { source, destination } = action

      // dropped outside the list
      if (!destination) {
          return
      }

      if (mixpanel.config.token)
        mixpanel.track('Today Task List - move a task', {
          origin: source.droppableId,
          destination: destination.droppableId 
        })


      if (source.droppableId !== destination.droppableId 
        && destination.droppableId !== 'unfinished') {
          const result = move(
              getList(source.droppableId),
              getList(destination.droppableId),
              source,
              destination
          )
        
        if (result.unfinished)
          setItemsUnifinished(sortTasks(result.unfinished))
        if (result.today)
          setItemsToday(sortTasks(result.today))
        if (result.tomorrow)
          setItemsTomorrow(sortTasks(result.tomorrow))
        if (result.upcoming)
          setItemsUpcoming(sortTasks(result.upcoming))
        if (result.someday)
          setItemsSomeday(sortTasks(result.someday))

        api.updateTask(action.draggableId, {dueDate: id2DueDate(action.destination.droppableId)})
          .then((resp) => {
            if (resp.status !== 200)
              getAllItems()
          })
        }
    }


  const onCreate = (task) => {
    if (mixpanel.config.token)
      mixpanel.track('Today Task List - Create a task')
    setItemsToday(sortTasks([task, ...itemsToday]))
  }

  const getDeletedList = (taskId, listTasks, setListFunction) => {
    if (mixpanel.config.token)
      mixpanel.track('Today Task List - Delete a task')
    const index = listTasks.map(x => x._id).indexOf(taskId)
    listTasks.splice(index, 1)
    setListFunction([...listTasks])
  }

  const getDoneList = (taskId, listTasks) => {
    if (mixpanel.config.token)
      mixpanel.track('Today Task List - Make a task done')
    return listTasks.map(x => {
      if(x._id === taskId) {
        x.doneAt = x.doneAt ? null : new Date()
        return x
      }
      else
        return x
    })
  }

  return (
    <div style={styles().wrapper}>
      <div style={styles().titleContainer}>
        <div style={styles().titleDoTo}>To Do</div>
        <WeekGoal
          day={true}
          weekNumber={new Date().getFullYear()*1000 + moment(new Date()).dayOfYear()}
          onClick={() => {
          if (mixpanel.config.token)
            mixpanel.track('Today Task List - Set a focus')
          }}
        />
      </div>
      <div style={styles().allTasksContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {itemsUnfinished.length > 0 && (
                <div>
                  <h3 style={styles().sectionTitleText}>Unfinished</h3>
                  <TaskList
                    droppableId={"unfinished"}
                    items={itemsUnfinished}
                    onUpdate={getAllItems}
                    onDelete={(taskId) => {
                      getDeletedList(taskId, itemsUnfinished, setItemsUnifinished)
                    }}
                    onDoneChange={(taskId) => {
                      const listTasks = getDoneList(taskId, itemsUnfinished)
                      setItemsUnifinished([...listTasks])
                      getAllItems()
                    }}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    projects={props.projects}
                    goals={props.goals}
                    scale={1}
                  />
                </div>
              )}
              <div>
                <h3 style={styles().sectionTitleText}>Today</h3>
                <TaskList
                  droppableId={"today"}
                  items={itemsToday}
                  onUpdate={getAllItems}
                  onDelete={(taskId) => {
                    getDeletedList(taskId, itemsToday, setItemsToday)
                  }}
                  onDoneChange={(taskId) => {
                    const listTasks = getDoneList(taskId, itemsToday)
                    setItemsToday([...listTasks])
                    getAllItems()
                  }}
                  onDescribe={props.onDescribe}
                  projects={props.projects}
                  goals={props.goals}
                  task={props.task}
                  scale={1}
                />
              </div>
              <div>
                <h3 style={styles().sectionTitleText}>Tomorrow</h3>
                <TaskList
                  droppableId={"tomorrow"}
                  items={itemsTomorrow}
                  onUpdate={getAllItems}
                  onDelete={(taskId) => {
                    getDeletedList(taskId, itemsTomorrow, setItemsTomorrow)
                  }}
                  onDoneChange={(taskId) => {
                    const listTasks = getDoneList(taskId, itemsTomorrow)
                    setItemsTomorrow([...listTasks])
                    getAllItems()
                  }}
                  onDescribe={props.onDescribe}
                  projects={props.projects}
                  goals={props.goals}
                  task={props.task}
                  scale={1}
                />
              </div>
              <div>
                <h3 style={styles().sectionTitleText}>Upcoming</h3>
                <TaskList
                  droppableId={"upcoming"}
                  items={itemsUpcoming}
                  onUpdate={getAllItems}
                  onDelete={(taskId) => {
                    getDeletedList(taskId, itemsUpcoming, setItemsUpcoming)
                  }}
                  onDoneChange={(taskId) => {
                    const listTasks = getDoneList(taskId, itemsUpcoming)
                    setItemsUpcoming([...listTasks])
                    getAllItems()
                  }}
                  onDescribe={props.onDescribe}
                  projects={props.projects}
                  goals={props.goals}
                  task={props.task}
                  scale={1}
                />
              </div>
              <div>
                <h3 style={styles().sectionTitleText}>Someday</h3>
                <TaskList
                  droppableId={"someday"}
                  items={itemsSomeday}
                  onUpdate={getAllItems}
                  onDelete={(taskId) => {
                    getDeletedList(taskId, itemsSomeday, setItemsSomeday)
                  }}
                  onDoneChange={(taskId) => {
                    const listTasks = getDoneList(taskId, itemsSomeday)
                    setItemsSomeday([...listTasks])
                    getAllItems()
                  }}
                  onDescribe={props.onDescribe}
                  goals={props.goals}
                  projects={props.projects}
                  task={props.task}
                  scale={1}
                />
              </div>
            </DragDropContext>
       </div>
      <AddTask
        onCreate={(task) => {
          setItemsToday(sortTasks([task, ...itemsToday]))
        }}
      />
    </div>
  )
}

const styles =  () => ({
  wrapper: {
    background: 'white',
    width: 900 * getDimRatio().X,
    height: 650* getDimRatio().Y,
    margin: 30,
    borderRadius: 20,
    boxShadow: '2px 4px #888888',
  },
  allTasksContainer: {
    overflow: 'scroll',
    height: '75%',
    margin: 10,
  },
  sectionTitleText: {
    color: '#32A3BC',
    fontWeight: 'bold',
    fontSize: 23 * getDimRatio().X,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  titleDoTo: {
    marginLeft: 10,
    fontSize: 28 * getDimRatio().X,
    fontWeight: 'normal',
    height: '5%',
  },
})


export default TodayTaskList
