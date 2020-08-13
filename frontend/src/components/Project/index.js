import React, { useState } from 'react'
import ProjectShape from '../ProjectShape'

import Api from '../../Api'

function Project (props) {
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteProject(props.item._id)
    props.onUpdate()
  }


  return (
    <div 
      style={{display: 'flex', flexDirection: 'row', alignItems: 'center', background: props.project && props.project._id === props.item._id ? 'lightgreen' : 'white'}}
      onClick={() => props.onDescribe({
        task: null,
        goal: null,
        project: props.project ? null : props.item,
      })}
    >
      <ProjectShape colorCode={props.item.colorCode} />
      {props.item.content}
    </div>
  )
}

export default Project

