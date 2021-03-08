import React from 'react'


function ProjectShape (props) {
  return (
    <div 
      title={props.project ? props.project.content : null}
      style={{
      backgroundColor: props.project ? props.project.colorCode : null, 
      width: 15, 
      height: 15,
      borderRadius: 20,
      cursor: 'auto',
    }} />
  )
}

export default ProjectShape
