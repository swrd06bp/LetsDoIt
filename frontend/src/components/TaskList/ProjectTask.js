import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import ProjectShape from '../ProjectShape'
import GoalShape from '../GoalShape'
import ListButton from '../ListButton'
import Api from '../../Api'
import { todayDate } from '../../utils'


function ProjectTask (props) {

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

  const date = props.item.doneAt ?
    props.item.doneAt.slice(0, 10) :
    props.item.dueDate ?
      props.item.dueDate.slice(0, 10) :
      'Someday'



  return (
    <div style={{display: 'flex', alignItems: 'center',}}>
     <div style={{borderRadius: 10, background: '#C4C4C4', fontSize: 11, fontWeight: 'bold',width: 60, textAlign: 'center', padding: 3,}}>
      {date} 
     </div>
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
      <div style={{display: 'flex', height: '100%', flexGrow: 1, fontSize:13 * props.scale, textDecoration: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}} onClick={() => props.onDescribe({task: props.task ? null : props.item, project: null, goal: null})}>
      {props.item.content}
      </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
        <div style={{visibility: props.item.doneAt && isOver ? 'visible': 'hidden', cursor: 'pointer'}} onClick={onDelete}>
          <img className='deleteTask' alt='delete' src='/trash.png' width='10' height='10'/>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProjectTask

