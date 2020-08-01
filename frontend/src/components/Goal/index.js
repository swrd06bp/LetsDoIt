import React, { useState } from 'react'

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
      style={{display: 'flex', flexDirection: 'row'}}
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
    >
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
