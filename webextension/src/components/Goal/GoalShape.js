import React from 'react'


function GoalShape (props) {
  return (
    <div
      title={props.goal ? props.goal.content : null}
    style={{
      backgroundColor: props.goal ? props.goal.colorCode : null, 
      width: 15,
      height: 15,
      cursor: 'auto',
    }} />
  )
}

export default GoalShape

