import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Api from '../../app/Api'
import TaskList from '../../components/TaskList'
import AddTask from '../../components/AddTask'
import { getDimRatio } from '../../app/DynamicSizing'
import {
  todayDate,
  decomposeTasksToday,
} from '../../app/utils'


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

  const getTasks = useCallback(async () => {
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
  }, [])


  useEffect(() => {
    getTasks() 
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

      if (source.droppableId !== destination.droppableId && destination.droppableId !== 'unfinished') {
          const result = move(
              getList(source.droppableId),
              getList(destination.droppableId),
              source,
              destination
          )

        if (result.unfinished)
          setItemsUnifinished(result.unfinished)
        if (result.today)
          setItemsToday(result.today)
        if (result.tomorrow)
          setItemsTomorrow(result.tomorrow)
        if (result.upcoming)
          setItemsUpcoming(result.upcoming)
        if (result.someday)
          setItemsSomeday(result.someday)

           
          api.updateTask(action.draggableId, {dueDate: id2DueDate(action.destination.droppableId)})
            .then(getTasks())
        }
    }



  return (
    <div style={styles().wrapper}>
      <h3 style={styles().titleDoTo}>To Do</h3>
      <div style={styles().allTasksContainer}>
            <DragDropContext onDragEnd={onDragEnd}>
              {itemsUnfinished.length > 0 && (
                <div>
                  <h3 style={styles().sectionTitleText}>Unfinished</h3>
                  <TaskList
                    droppableId={"unfinished"}
                    items={itemsUnfinished}
                    onUpdate={getTasks}
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
                  onUpdate={getTasks}
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
                  onUpdate={getTasks}
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
                  onUpdate={getTasks}
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
                  onUpdate={getTasks}
                  onDescribe={props.onDescribe}
                  goals={props.goals}
                  projects={props.projects}
                  task={props.task}
                  scale={1}
                />
              </div>
            </DragDropContext>
       </div>
      <AddTask onUpdate={getTasks}/>
    </div>
  )
}

const styles =  () => ({
  wrapper: {
    background: 'white',
    width: 700 * getDimRatio().X,
    height: 550* getDimRatio().Y,
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
    fontSize: 20 * getDimRatio().X,
  },
  titleDoTo: {
    fontSize: 25 * getDimRatio().X,
    marginLeft: 10,
    fontWeight: 'normal',
    height: '5%',
  },
})


export default TodayTaskList
