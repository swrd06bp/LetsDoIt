import React, { useState } from 'react'

import Api from '../../app/Api'
import { getDimRatio } from '../../app/DynamicSizing'
import { todayDate } from '../../app/utils'


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


  const scale = props.type === 'day' ? 1 : 0.7

  return (
    <div
      style={{display: 'flex', alignItems: 'center', background: isOver ? '#FAFAFA' : 'white'}}
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
    >
     <div style={{borderRadius: 10, background: '#C4C4C4', fontSize: 11 * getDimRatio().X, fontWeight: 'bold',width: 60 * getDimRatio().X, textAlign: 'center', padding: 3}}>
      {date} 
     </div>
      <div 
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
          <div 
            style={{display: 'flex', height: '100%', marginLeft: 5, flexGrow: 1, fontSize:15 * scale * getDimRatio().X, textDecoration: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}}
            onClick={() => {
              props.onDescribe({
                task: props.item,
                project: props.project ? props.project : null,
                goal: props.goal ? props.goal : null,
              })
            }}>
            {props.item.content}
          </div>
        </div>
        <div style={{visibility: props.item.doneAt && isOver ? 'visible': 'hidden', cursor: 'pointer'}} onClick={onDelete}>
          <img className='deleteTask' alt='delete' src='/trash.png' width='10' height='10'/>
        </div>
    </div>
    </div>
  )
}

export default ProjectTask

