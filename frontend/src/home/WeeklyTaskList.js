import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Api from '../Api.js'
import TaskList from '../components/TaskList'
import {
  weekDayDate,
  decomposeTasksWeek,
} from '../utils'


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




function WeeklyTaskList (props) {
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
    getTasks() 
  },[props.task, date]) 


  const getTasks = async () => {
    const response = await api.getTasks({from: weekDates[0].toJSON(), until: weekDates[1].toJSON()})
    const allTasks = await response.json()

    if (allTasks) {

      const weekDaysTasks = decomposeTasksWeek(allTasks, date)


      setItemsMonday(weekDaysTasks[0])
      setItemsTuesday(weekDaysTasks[1])
      setItemsWednesday(weekDaysTasks[2])
      setItemsThursday(weekDaysTasks[3])
      setItemsFriday(weekDaysTasks[4])
      setItemsSaturday(weekDaysTasks[5])
      setItemsSunday(weekDaysTasks[6])
    }
  }


  
  const id2List = {
    monday: itemsMonday,
    tuesday: itemsTuesday,
    wednesday: itemsWednesday,
    thursday: itemsThursday,
    friday: itemsFriday,
    saturday: itemsSaturday,
    sunday: itemsSunday,
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

        if (result.monday)
          setItemsMonday(result.monday)
        if (result.tuesday)
          setItemsTuesday(result.tuesday)
        if (result.wednesday)
          setItemsWednesday(result.wednesday)
        if (result.thursday)
          setItemsThursday(result.thursday)
        if (result.friday)
          setItemsFriday(result.friday)
        if (result.saturday)
          setItemsSaturday(result.saturday)
        if (result.sunday)
          setItemsSunday(result.sunday)

           
          api.updateTask(action.draggableId, {dueDate: id2DueDate(action.destination.droppableId)})
        }
    }

  const getOtherWeek = next => {
    let newDate
    if (next === 0) {
      newDate = new Date()
    } else {
      newDate = new Date(JSON.parse(JSON.stringify(date)))
      newDate.setDate(newDate.getDate() + 7*next)
    }
    setDate(newDate)
    setWeekDates([weekDayDate(newDate, 0), weekDayDate(newDate, 7)])
  }



  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <button onClick={() => {getOtherWeek(0)}}>
          now
        </button>
        <button onClick={() => {getOtherWeek(-1)}}>
          &lt;
      </button>
        <button onClick={() => {getOtherWeek(1)}}>
          &gt;
        </button>
      </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Monday</h2>
                  <h5>{id2DueDate('monday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"monday"}
                    items={itemsMonday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Tuesday</h2>
                  <h5>{id2DueDate('tuesday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"tuesday"}
                    items={itemsTuesday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Wednesday</h2>
                  <h5>{id2DueDate('wednesday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"wednesday"}
                    items={itemsWednesday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Thursday</h2>
                  <h5>{id2DueDate('thursday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"thursday"}
                    items={itemsThursday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Friday</h2>
                  <h5>{id2DueDate('friday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"friday"}
                    items={itemsFriday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Saturday</h2>
                  <h5>{id2DueDate('saturday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"saturday"}
                    items={itemsSaturday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={{textAlign: 'center', width: 150}}>
                  <h2>Sunday</h2>
                  <h5>{id2DueDate('sunday').toLocaleDateString()}</h5>
                  <TaskList
                    droppableId={"sunday"}
                    items={itemsSunday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
              </div>
            </DragDropContext>
    </div>
  )
}



export default WeeklyTaskList

