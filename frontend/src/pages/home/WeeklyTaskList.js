import React, { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useMixpanel } from 'react-mixpanel-browser'
import moment from 'moment'
import Select from 'react-select'

import Api from '../../app/Api'
import TaskList from '../../components/TaskList'
import AddTask from '../../components/AddTask'
import WeekGoal from '../../components/WeekGoal'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import { updateSocketElems, removeSocketListener } from '../../app/socket'
import {
  sortTasks,
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
  const getInitialDropdownOptions = () => {
    let initialDropdownOptions = [
      {value: 'All', label: 'All'},
      {label: 'Lists', options: [
        {value: 'Work', label: 'Work'},
        {value: 'Personal', label: 'Personal'}
      ]}
    ]
  
    let projectItems = []
    for (let project of props.projects) {
      projectItems.push({value: project._id, label: project.content})
    }
    if (props.projects.length)
      initialDropdownOptions.push({label: 'Projects', options: projectItems})

    let goalItems = []
    for (let goal of props.goals) {
      goalItems.push({value: goal._id, label: goal.content})
    }

    if (props.goals.length)
      initialDropdownOptions.push({label: 'Goals', options: goalItems})

    
    return initialDropdownOptions
  }

  const [date, setDate] = useState(new Date())
  const [weekDates, setWeekDates] = useState([weekDayDate(new Date(), 0), weekDayDate(new Date(), 7)])
  const [itemsMonday, setItemsMonday] = useState([])
  const [itemsTuesday, setItemsTuesday] = useState([])
  const [itemsWednesday, setItemsWednesday] = useState([])
  const [itemsThursday, setItemsThursday] = useState([])
  const [itemsFriday, setItemsFriday] = useState([])
  const [itemsSaturday, setItemsSaturday] = useState([])
  const [itemsSunday, setItemsSunday] = useState([])
  const [selectedDropdownOption, setSelectedDropdownOption] = useState({value: 'All', label: 'All'})
  const [dropdownOptions, setDropdownOptions] = useState(getInitialDropdownOptions())
  
  const api = new Api()
  const mixpanel = useMixpanel()



  const getTasks = async () => {
    let response
    if (props.projects.map(x => x._id).includes(selectedDropdownOption.value))
      response = await api.getTasksProject(selectedDropdownOption.value)
    else if (props.goals.map(x => x._id).includes(selectedDropdownOption.value))
      response = await api.getTasksGoal(selectedDropdownOption.value)
    else
      response = await api.getTasks({from: weekDates[0].toJSON(), until: weekDates[1].toJSON()})
    let allTasks = await response.json()

   
    //filter on the list
    if (selectedList)
      allTasks = allTasks.filter(x => x.list === selectedList)

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
  }



  useEffect(() => {
    getTasks() 
    updateSocketElems('tasks', (err, data) => getTasks())
    return () => removeSocketListener('tasks')
  },[props.task, date]) 

  useEffect(() => {
    getTasks() 
  }, [selectedDropdownOption.value])


  // choose the selectedList for the filter
  let selectedList = null
  if (['Work', 'Personal'].includes(selectedDropdownOption.value))
    selectedList = selectedDropdownOption.value
  else if (props.projects.map(x => x._id).includes(selectedDropdownOption.value))
    selectedList = props.projects.filter(x => x._id === selectedDropdownOption.value)[0].list
  else if (props.goals.map(x => x._id).includes(selectedDropdownOption.value))
    selectedList = props.goals.filter(x => x._id === selectedDropdownOption.value)[0].list

  
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
      if (mixpanel.config.token)
        mixpanel.track('Week Task List - move a task', {
          origin: source.droppableId,
          destination: destination.droppableId 
        })

      if (source.droppableId !== destination.droppableId) {
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

  const getNewDueDate = () => {
    let nowDate = new Date()
    if ((weekDates[0] <= nowDate && weekDates[1] > nowDate) || weekDates[0] <= nowDate)
      return nowDate
    else
      return weekDates[0]
  }

  const onCreateTask = (task) => {
    if (mixpanel.config.token)
      mixpanel.track('Week Task List - Create a task')
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

  const getDeletedList = (taskId, listTasks, setListFunction) => {
    if (mixpanel.config.token)
      mixpanel.track('Week Task List - Delete a task')
    const index = listTasks.map(x => x._id).indexOf(taskId)
    listTasks.splice(index, 1)
    setListFunction([...listTasks])
  }

  const getDoneList = (taskId, listTasks) => {
    if (mixpanel.config.token)
      mixpanel.track('Week Task List - Make a task done')

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
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div
            style={styles().toolButton}
            onMouseOver={(event) => {
              event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#32A3BC'
            }}
            onClick={() => {getOtherWeek(0)}}
          >
            now
          </div>
          <div
            style={styles().toolButton}
            onMouseOver={(event) => {
              event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#32A3BC'
            }}
            onClick={() => {getOtherWeek(-1)}}
          >
            &lt;
        </div>
          <div
            style={styles().toolButton}
            onMouseOver={(event) => {
              event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#32A3BC'
            }}
            onClick={() => {getOtherWeek(1)}}
          >
            &gt;
          </div>
          <div style={styles().monthTitle}>{id2DueDate('monday').toLocaleString('default', { month: 'long' }) + ' ' + id2DueDate('monday').getFullYear()}</div>
        </div>
        <WeekGoal weekNumber={date.getFullYear()*100 + parseInt(moment(date).isoWeek())} />
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
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsMonday, setItemsMonday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsMonday)
                setItemsMonday([...listTasks])
                getTasks()
              }}
              task={props.task}
              isPast={id2DueDate('monday') < todayDate()}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('monday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('monday').getFullYear()*1000 + moment(id2DueDate('monday')).dayOfYear()}
                scale={0.7}
              />
              )}   
            </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Tuesday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('tuesday').getDate()}</div>
            <TaskList
              droppableId={"tuesday"}
              items={itemsTuesday}
              onUpdate={getTasks}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsTuesday, setItemsTuesday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsTuesday)
                setItemsTuesday([...listTasks])
                getTasks()
              }}
              onDescribe={props.onDescribe}
              task={props.task}
              isPast={id2DueDate('tuesday') < todayDate()}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('tuesday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('tuesday').getFullYear()*1000 + moment(id2DueDate('tuesday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Wednesday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('wednesday').getDate()}</div>
            <TaskList
              droppableId={"wednesday"}
              items={itemsWednesday}
              onUpdate={getTasks}
              onDescribe={props.onDescribe}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsWednesday, setItemsWednesday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsWednesday)
                setItemsWednesday([...listTasks])
                getTasks()
              }}
              task={props.task}
              scale={0.7}
              isPast={id2DueDate('wednesday') < todayDate()}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('wednesday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('wednesday').getFullYear()*1000 + moment(id2DueDate('wednesday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Thursday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('thursday').getDate()}</div>
            <TaskList
              droppableId={"thursday"}
              items={itemsThursday}
              onUpdate={getTasks}
              onDescribe={props.onDescribe}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsThursday, setItemsThursday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsThursday)
                setItemsThursday([...listTasks])
                getTasks()
              }}
              isPast={id2DueDate('thursday') < todayDate()}
              task={props.task}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('thursday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('thursday').getFullYear()*1000 + moment(id2DueDate('thursday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Friday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('friday').getDate()}</div>
            <TaskList
              droppableId={"friday"}
              items={itemsFriday}
              onUpdate={getTasks}
              isPast={id2DueDate('friday') < todayDate()}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsFriday, setItemsFriday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsFriday)
                setItemsFriday([...listTasks])
                getTasks()
              }}
              onDescribe={props.onDescribe}
              task={props.task}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('friday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('friday').getFullYear()*1000 + moment(id2DueDate('friday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Saturday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('saturday').getDate()}</div>
            <TaskList
              droppableId={"saturday"}
              items={itemsSaturday}
              onUpdate={getTasks}
              isPast={id2DueDate('saturday') < todayDate()}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsSaturday, setItemsSaturday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsSaturday)
                setItemsSaturday([...listTasks])
                getTasks()
              }}
              onDescribe={props.onDescribe}
              task={props.task}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('saturday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('saturday').getFullYear()*1000 + moment(id2DueDate('saturday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
          <div style={styles().dayContainer}>
            <div style={styles().dayTitle}>Sunday</div>
            <div style={styles().dayNumberTitle}>{id2DueDate('sunday').getDate()}</div>
            <TaskList
              droppableId={"sunday"}
              items={itemsSunday}
              onUpdate={getTasks}
              isPast={id2DueDate('sunday') < todayDate()}
              onDelete={(taskId) => {
                getDeletedList(taskId, itemsSunday, setItemsSunday)
              }}
              onDoneChange={(taskId) => {
                const listTasks = getDoneList(taskId, itemsSunday)
                setItemsSunday([...listTasks])
                getTasks()
              }}
              onDescribe={props.onDescribe}
              task={props.task}
              scale={0.7}
              projects={props.projects}
              goals={props.goals}
            />
            <div style={styles().footNoteFocus}>
              {id2DueDate('sunday') <= todayDate() && ( <WeekGoal
                day={true}
                weekNumber={id2DueDate('sunday').getFullYear()*1000 + moment(id2DueDate('sunday')).dayOfYear()}
                scale={0.7}
              />
              )}   
          </div>
          </div>
        </div>
      </DragDropContext>
      <div style={styles().footer}>
        <div style={styles().filtersContainer}>
          <div>Filter</div>
          <div style={styles().filtersDropdown}>
          <Select
            styles={styles().dropdownSelect}
            options={dropdownOptions}
            selectValue={selectedDropdownOption.value}
            onChange={setSelectedDropdownOption}
          />
          </div>
        </div>
        <AddTask
          dueDate={getNewDueDate()}
          onCreate={onCreateTask}
          list={selectedList}
          projectId={props.projects.map(x => x._id).includes(selectedDropdownOption.value) ? 
            selectedDropdownOption.value : null}
          goalId={props.goals.map(x => x._id).includes(selectedDropdownOption.value) ? 
            selectedDropdownOption.value : null}
        />
      </div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    background: 'white',
    borderRadius: 20,
    padding: 20,
    boxShadow: '2px 4px #888888',
  },
  dayContainer: {
    textAlign: 'center', 
    width: 190 * getDimRatio().X,
  },
  dayTitle: {
    color: '#32A3BC',
    fontWeight: 'bold',
    fontSize: 23 * getDimRatioText().X
  },
  dayNumberTitle: {
    color: '#32A3BC',
    fontSize: 21 * getDimRatioText().X
  },
  monthTitle: {
    fontSize: 23 * getDimRatioText().X,
    marginLeft: 10,
  },
  calendarContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14 * getDimRatio().X
  },
  filtersDropdown: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 200* getDimRatio().X,
    marginLeft: 10,
    fontSize: 14 * getDimRatio().X
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#32A3BC',
    borderColor: 'white',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18 * getDimRatioText().X,
    color: 'white',
    borderStyle: 'solid',
  },
  dropdownSelect: {
    control: (styles) => ({...styles, width: 240 * getDimRatio().X})
  },
  footNoteFocus: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    overflow: 'hidden',
  },
})



export default WeeklyTaskList

