import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import Api from '../../Api'

const grid = 2

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
})

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',


    // styles we need to apply on draggables
    ...draggableStyle
})


function Task (props) {

  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {isDone: !props.item.isDone})
    props.onUpdate()
  }
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteTask(props.item.id)
    props.onUpdate()
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()
  }

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
        checked={props.item.isDone}
        onChange={onCheckboxChange}
      />
      <div style={{display: 'flex', flexGrow: 1}} onClick={() => props.onDescribe(props.task ? null : props.item)}>
      {props.item.content}
      </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div 
          style={{fontSize: 11, background: 'yellow', borderRadius: 60}}
          onClick={onListChange}
        >
          <div style={{margin: 2}}>
          {props.item.list}
          </div>
        </div>
      
        <div style={{visibility: props.item.isDone && isOver ? 'visible': 'hidden'}} onClick={onDelete}>
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
                style={getListStyle(snapshot.isDraggingOver)}>
                {props.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}>
                                 <Task item={item} onDescribe={props.onDescribe} task={props.task} onUpdate={props.onUpdate}/>
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  )

}

export default TaskList
