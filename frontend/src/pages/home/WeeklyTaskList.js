import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Api from '../../app/Api'
import TaskList from '../../components/TaskList'
import { getDimRatio } from '../../app/DynamicSizing'
import {
  weekDayDate,
  todayDate,
  decomposeItemsWeek,
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

  const getTasks = async () => {
    const response = await api.getTasks({from: weekDates[0].toJSON(), until: weekDates[1].toJSON()})
    const allTasks = await response.json()

    if (allTasks) {
      const weekDaysTasks = decomposeItemsWeek(allTasks, date, 'task')
      const weekDaysProjects = decomposeItemsWeek(props.projects, date, 'project')
      const weekDaysGoals = decomposeItemsWeek(props.goals, date, 'goal')

      setItemsMonday([weekDaysGoals[0], ...weekDaysProjects[0], ...weekDaysTasks[0]])
      setItemsTuesday([...weekDaysGoals[1], ...weekDaysProjects[1], ...weekDaysTasks[1]])
      setItemsWednesday([...weekDaysGoals[2], ...weekDaysProjects[2], ...weekDaysTasks[2]])
      setItemsThursday([...weekDaysGoals[3], ...weekDaysProjects[3], ...weekDaysTasks[3]])
      setItemsFriday([...weekDaysGoals[4], ...weekDaysProjects[4], ...weekDaysTasks[4]])
      setItemsSaturday([...weekDaysGoals[5], ...weekDaysProjects[5], ...weekDaysTasks[5]])
      setItemsSunday([...weekDaysGoals[6], ...weekDaysProjects[6], ...weekDaysTasks[6]])
    }
  }


  useEffect(() => {
    getTasks() 
  },[props.task, date]) 



  
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
    <div style={styles().wrapper}>
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
        <div style={styles().monthTitle}>{id2DueDate('monday').toLocaleString('default', { month: 'long' }) + ' ' + id2DueDate('monday').getFullYear()}</div>
      </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={styles().calendarContainer}>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Monday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('monday').getDate()}</div>
                  <TaskList
                    droppableId={"monday"}
                    items={itemsMonday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    isPast={id2DueDate('monday') < todayDate()}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Tuesday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('tuesday').getDate()}</div>
                  <TaskList
                    droppableId={"tuesday"}
                    items={itemsTuesday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    isPast={id2DueDate('tuesday') < todayDate()}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Wednesday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('wednesday').getDate()}</div>
                  <TaskList
                    droppableId={"wednesday"}
                    items={itemsWednesday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    isPast={id2DueDate('wednesday') < todayDate()}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Thursday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('thursday').getDate()}</div>
                  <TaskList
                    droppableId={"thursday"}
                    items={itemsThursday}
                    onUpdate={getTasks}
                    onDescribe={props.onDescribe}
                    isPast={id2DueDate('thursday') < todayDate()}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Friday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('friday').getDate()}</div>
                  <TaskList
                    droppableId={"friday"}
                    items={itemsFriday}
                    onUpdate={getTasks}
                    isPast={id2DueDate('friday') < todayDate()}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Saturday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('saturday').getDate()}</div>
                  <TaskList
                    droppableId={"saturday"}
                    items={itemsSaturday}
                    onUpdate={getTasks}
                    isPast={id2DueDate('saturday') < todayDate()}
                    onDescribe={props.onDescribe}
                    task={props.task}
                    scale={0.7}
                    projects={props.projects}
                    goals={props.goals}
                  />
                </div>
                <div style={styles().dayContainer}>
                  <div style={styles().dayTitle}>Sunday</div>
                  <div style={styles().dayNumberTitle}>{id2DueDate('sunday').getDate()}</div>
                  <TaskList
                    droppableId={"sunday"}
                    items={itemsSunday}
                    onUpdate={getTasks}
                    isPast={id2DueDate('sunday') < todayDate()}
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

const styles = () => ({
  wrapper: {
    height: 600 * getDimRatio().Y,
    background: 'white',
    borderRadius: 20,
    padding: 20,
    boxShadow: '2px 4px #888888',
  },
  dayContainer: {
    textAlign: 'center', 
    width: 150 * getDimRatio().X,
  },
  dayTitle: {
    fontSize: 25 * getDimRatio().X
  },
  dayNumberTitle: {
    fontSize: 20 * getDimRatio().X
  },
  monthTitle: {
    fontSize: 20 * getDimRatio().X,
    marginLeft: 10,
  },
  calendarContainer: {
    display: 'flex',
    flexDirection: 'row',
  }
})



export default WeeklyTaskList

