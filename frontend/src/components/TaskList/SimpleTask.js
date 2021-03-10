import React, { useState } from 'react'

import ProjectShape from '../Project/ProjectShape'
import GoalShape from '../Goal/GoalShape'
import ListButton from '../ListButton'
import DeleteButton from '../DeleteButton'
import Api from '../../app/Api'
import moment from 'moment'
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
  
  const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

  const links = props.item.note ? props.item.note.match(regex) : []

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
            textDecoration: props.item.doneAt && props.type === 'day' ? 'line-through': null,
          }} 
          onClick={() => {props.onDescribe({task: props.item, project: null, goal: null, habit: null})}}
        >
          {props.item.content} 
          {links && links.length > 0 && (
              <a href={links[0]}>&nbsp;- link</a>
          )}
        </div>
      </div>
      <div style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
      {props.item.isNotification && !props.item.doneAt && props.type === 'day' && ( 
        <img 
          src='/notification.png' 
          alt='sdf'
          height='13'
          width='13'
          title={moment(props.item.dueDate).format('hh:MM')}
          style={{cursor: 'default'}}
        />
      )}
       <div>
        {isOver && props.type === 'week' && (  
        <div> 
          <DeleteButton width='13' height='13' onDelete={onDelete} />
        </div>
        )}
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
        {isOver && props.type === 'day' && (  
        <div> 
          <DeleteButton width='13' height='13' onDelete={onDelete} />
        </div>
        )}
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
