import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import ProjectShape from '../ProjectShape'
import GoalShape from '../GoalShape'
import ListButton from '../ListButton'
import Api from '../../Api'
import { getDimRatio } from '../../DynamicSizing'
import { todayDate } from '../../utils'


function SimpleTask (props) {

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

  
  const  projectColorCode = props.projects.filter(x => x._id === props.item.projectId).length
    ? props.projects.filter(x => x._id === props.item.projectId)[0].colorCode : null
  
  const  goalColorCode = props.goals.filter(x => x._id === props.item.goalId).length
    ? props.goals.filter(x => x._id === props.item.goalId)[0].colorCode : null


  return (
    <div 
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
      className='taskWrapper'
      style={styles.wrapper}
    >
      <div style={styles.infoContainer}> 
        <input 
          type='Checkbox'  
          className='doneCheckbox' 
          checked={props.item.doneAt ? true : false}
          onChange={() => onCheckboxChange(props.item.doneAt)}
        />
        <div
          style={{display: 'flex', height: '100%', marginLeft: 5, flexGrow: 1, fontSize:15 * props.scale * getDimRatio().X, textDecoration: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}} 
          onClick={() => {props.onDescribe({task: props.item, project: null, goal: null})}}
        >
          {props.item.content}
        </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
       <div>
          {!props.hideList && (
            <ListButton
              scale={props.scale}
              active={true}
              item={props.item}
              onListChange={ (list) => {
                const api = new Api()
                api.updateTask(props.item.id, {list})
                  .then(props.onUpdate())
              }}
            />
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

const styles = {
  wrapper: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
  }
}


export default SimpleTask
