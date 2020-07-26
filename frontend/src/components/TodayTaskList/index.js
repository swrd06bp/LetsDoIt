import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Api from '../../Api.js'
import SingleTaskList from './SingleTaskList'
import {
  todayDate,
  tomorrowDate,
  dayAfterDate,
  decomposeTasks,
} from '../../utils'


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
  const [itemsToday, setItemsToday] = useState([])
  const [itemsTomorrow, setItemsTomorrow] = useState([])
  const [itemsUpcoming, setItemsUpcoming] = useState([])
  const [itemsSomeday, setItemsSomeday] = useState([])
  const api = new Api()


  useEffect(() => {
    getTasks() 
  },[]) 


  const getTasks = async () => {
    const response = await api.getTasks({from: todayDate().toJSON(), until: null})
    const allTasks = await response.json()

    const { todayTasks, tomorrowTasks, upcomingTasks, somedayTasks } = decomposeTasks(allTasks)

    setItemsToday(todayTasks)
    setItemsTomorrow(tomorrowTasks)
    setItemsUpcoming(upcomingTasks)
    setItemsSomeday(somedayTasks)
  }


  
  const id2List = {
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

      if (source.droppableId !== destination.droppableId) {
          const result = move(
              getList(source.droppableId),
              getList(destination.droppableId),
              source,
              destination
          )

        console.log(action)

        if (result.today)
          setItemsToday(result.today)
        if (result.tomorrow)
          setItemsTomorrow(result.tomorrow)
        if (result.upcoming)
          setItemsUpcoming(result.upcoming)
        if (result.someday)
          setItemsSomeday(result.someday)

           
          api.updateTask(action.draggableId, {dueDate: id2DueDate(action.destination.droppableId)})
        }
    }



  return (
    <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <h2>Today</h2>
                <SingleTaskList
                  droppableId={"today"}
                  items={itemsToday}
                />
                <h2>Tomorrow</h2>
                <SingleTaskList
                  droppableId={"tomorrow"}
                  items={itemsTomorrow}
                />
                <h2>Upcoming</h2>
                <SingleTaskList
                  droppableId={"upcoming"}
                  items={itemsUpcoming}
                />
                <h2>Someday</h2>
                <SingleTaskList
                  droppableId={"someday"}
                  items={itemsSomeday}
                />
            </DragDropContext>
    </div>
  )
}



export default TodayTaskList
