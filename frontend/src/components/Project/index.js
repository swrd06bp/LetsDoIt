import React, { useState } from 'react'
import ProjectShape from '../ProjectShape'

import Api from '../../Api'

function Project (props) {
  const [isOver, setIsOver] = useState(false)
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteProject(props.item._id)
    props.onUpdate()
  }


  return (
    <div 
      style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
      onClick={() => props.onDescribe({
        task: null,
        goal: null,
        project: props.project ? null : props.item,
      })}
    >
      <ProjectShape colorCode={props.item.colorCode} />
      {props.item.content}
      <div style={{visibility: isOver ? 'visible': 'hidden', cursor: 'pointer'}} onClick={onDelete}>
        <img className='deleteTask' alt='delete' src='/trash.png' width='10' height='10'/>
      </div>
    </div>
  )
}

export default Project

