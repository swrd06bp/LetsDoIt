import React, { useState } from 'react'

import GoalShape from '../GoalShape'
import Api from '../../Api'

function Goal (props) {
  const [isOver, setIsOver] = useState(false)
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteGoal(props.item._id)
    props.onUpdate()
  }

  return (
    <div 
      style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
      onClick={() => props.onDescribe({
        task: null,
        goal: props.goal ? null : props.item,
        project: null, 
      })}
    >
    <GoalShape colorCode={props.item.colorCode} />
    <div>
      {props.item.content}
    </div>
      <div style={{visibility: isOver ? 'visible': 'hidden', cursor: 'pointer'}} onClick={onDelete}>
        <img className='deleteTask' alt='delete' src='/trash.png' width='10' height='10'/>
      </div>
    </div>
  )
}

export default Goal
