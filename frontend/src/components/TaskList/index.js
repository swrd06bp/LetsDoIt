import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import ProjectShape from '../ProjectShape'
import GoalShape from '../GoalShape'
import ListButton from '../ListButton'
import Api from '../../Api'
import { todayDate } from '../../utils'

const grid = 2

const getListStyle = (isDraggingOver, scale, isPast) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    height: scale === 1 ? null : 300,
    overflow: scale === 1 ? null : 'auto',
    opacity: isPast ? 0.4 : 1,
})

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',
    borderRadius: 10,


    // styles we need to apply on draggables
    ...draggableStyle
})


function Task (props) {

  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async (doneAt) => {
    if (new Date(doneAt) >= todayDate() || !doneAt) {
      const api = new Api()
      await api.updateTask(props.item.id, {doneAt: props.item.doneAt ? null : new Date()})
      props.onUpdate()
    }
  }
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteTask(props.item.id)
    props.onUpdate()
  }

  
  let projectColorCode 
  if (props.projects)  
    projectColorCode = props.projects.filter(x => x._id === props.item.projectId).length
    ? props.projects.filter(x => x._id === props.item.projectId)[0].colorCode : null
  
  let goalColorCode 
  if (props.goals) 
    goalColorCode = props.goals.filter(x => x._id === props.item.goalId).length
    ? props.goals.filter(x => x._id === props.item.goalId)[0].colorCode : null


  return (
    <div 
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
      className='taskWrapper'
      style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
    >
      <div style={{display: 'flex', alignItems: 'center', width: '80%'}}> 
      <input 
        type='Checkbox'  
        className='doneCheckbox' 
        checked={props.item.doneAt ? true : false}
        onChange={() => onCheckboxChange(props.item.doneAt)}
      />
      <div style={{display: 'flex', flexGrow: 1, fontSize:13 * props.scale, textDecoration: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}} onClick={() => props.onDescribe({task: props.task ? null : props.item, project: null, goal: null})}>
      {props.item.content}
      </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
       <div>
          {!props.hideList && (
          <ListButton scale={props.scale} item={props.item} onUpdate={props.onUpdate}/>
          )}
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <ProjectShape colorCode={projectColorCode} />
            <GoalShape colorCode={goalColorCode} />
          </div>
        </div>
      
        <div style={{visibility: props.item.doneAt && isOver ? 'visible': 'hidden', cursor: 'pointer'}} onClick={onDelete}>
          <img className='deleteTask' alt='delete' src='/trash.png' width='10' height='10'/>
        </div>
      </div>
    </div>
  )
}


function TaskList (props) {

  return (
    <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, props.scale)}>
                {props.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => {
                          const isSelected = snapshot.isDragging || (props.task && props.task.id === item.id)
                          const isPast = item.dueDate && todayDate() >= new Date(item.dueDate)
                          return (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    isSelected,
                                    provided.draggableProps.style,
                                    isPast,
                                )}>
                                 <Task 
                                  item={item}
                                  onDescribe={props.onDescribe}
                                  scale={props.scale}
                                  task={props.task}
                                  onUpdate={props.onUpdate}
                                  goals={props.goals}
                                  projects={props.projects}
                                  hideList={props.hideList}
                                />
                            </div>
                          )
                        }}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  )

}

export default TaskList
