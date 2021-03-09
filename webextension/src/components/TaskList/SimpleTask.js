import React, { useState } from 'react'

import ProjectShape from '../Project/ProjectShape'
import GoalShape from '../Goal/GoalShape'
import ListButton from '../ListButton'
import DeleteButton from '../DeleteButton'
import Api from '../../app/Api'
import { getDimRatioText } from '../../app/DynamicSizing'
import { todayDate } from '../../app/utils'


function SimpleTask (props) {

  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async (doneAt) => {
    if (new Date(doneAt) >= todayDate() || !doneAt) {
      const api = new Api()
      await api.updateTask(props.item.id, {doneAt: props.item.doneAt ? null : new Date()})
      props.onDoneChange(props.item.id)
    }
  }
  
  const onDelete = async () => {
    const api = new Api()
    await api.deleteTask(props.item.id)
    props.onDelete(props.item.id)
  }

  
  const  project = props.projects.filter(x => x._id === props.item.projectId).length
    ? props.projects.filter(x => x._id === props.item.projectId)[0] : null
  
  const  goal = props.goals.filter(x => x._id === props.item.goalId).length
    ? props.goals.filter(x => x._id === props.item.goalId)[0] : null


  const scale = (props.type === 'day' || isOver) ? 1 : 0.8


  return (
    <div 
      onMouseOver={() => setIsOver(true)} 
      onMouseLeave={() => setIsOver(false)} 
      className='taskWrapper'
      style={{
        ...styles.wrapper,
        background: isOver && !props.isSelected
          ? '#FAFAFA' : null }}
    >
      <div style={styles.infoContainer}> 
        <input 
          type='Checkbox'  
          className='doneCheckbox' 
          checked={props.item.doneAt ? true : false}
          onChange={() => onCheckboxChange(props.item.doneAt)}
        />
        <div
          style={{
            display: 'flex',
            height: '100%',
            marginLeft: 5,
            flexGrow: 1,
            fontSize:18 * scale * getDimRatioText().X,
            textDecoration: props.item.doneAt ? 'line-through': null,
            color: props.item.doneAt ? 'grey': 'black',
          }} 
          onClick={() => {
            props.onDescribe({task: props.item, project: null, goal: null})
          }}
        >
          {props.item.content}
        </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
       <div>
          {!props.hideList && (
            <ListButton
              scale={scale}
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
            <ProjectShape project={project} />
            <GoalShape goal={goal} />
          </div>
        </div>
      
        <div 
          style={{visibility: isOver ? 'visible': 'hidden'}} 
        >
          <DeleteButton width='13' height='13' onDelete={onDelete} />
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
