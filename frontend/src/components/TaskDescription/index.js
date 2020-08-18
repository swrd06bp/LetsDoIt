import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Modal from 'react-modal'

import ListButton from '../ListButton'
import GoalShape from '../GoalShape'
import ProjectShape from '../ProjectShape'

import Api from '../../Api'



function TaskDescription (props) {
  const [content, setContent] = useState(props.task.content)
  const [note, setNote] = useState(props.task.note)
  const [dueDate, setDueDate] = useState(props.task.dueDate)
  const [doneAt, setDoneAt] = useState(props.task.doneAt)
  const [projectId, setProjectId] = useState(props.task.projectId)
  const [goalId, setGoalId] = useState(props.task.goalId)
  const [list, setList] = useState(props.task.list)

  const api = new Api()
  
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])


  let projectsOptions = props.projects.map(x => ({value: x._id, label: x.content}))
  projectsOptions.unshift({value: null, label: 'none'})

  const projectColorCode = props.projects.filter(x => x._id === projectId).length
    ? props.projects.filter(x => x._id === projectId)[0].colorCode : null
  
  const goalColorCode = props.goals.filter(x => x._id === goalId).length
    ? props.goals.filter(x => x._id === goalId)[0].colorCode : null


  let goalsOptions = props.goals.map(x => ({value: x._id, label: x.content}))
  goalsOptions.unshift({value: null, label: 'none'})

  const onSave = async () => {
    await api.updateTask(
      props.task.id, 
      {content, dueDate, note, projectId, goalId, list, doneAt}
    )
    props.onDescribe({task: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteTask(props.task.id)
    props.onDescribe({task: null, project: null, goal: null})
  }



  return (
      <Modal
        isOpen={true}
        onRequestClose={() => {props.onDescribe({task: null, project: null, goal: null})}}
        style={styles}
        contentLabel="Example Modal"
      >
    <div style={styles.wrapper}>
      <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
        <h3 style={styles.title}>Description</h3>
        <div onClick={onDelete} style={styles.deleteButton}>
          <img 
            className='deleteTask' 
            alt='delete' 
            src='/trash.png'
            width='15'
            height='15'/>
        </div>
      </div>
      <div style={styles.titleTaskContainer}>
          <textarea 
            type='text' 
            name='content'
            value={content} 
            onChange={(event) => setContent(event.target.value)} 
            style={styles.titleTaskText}
          />
          <ListButton 
            item={props.task}
            scale={1.5}
            active={true}
            onListChange={setList}
          />
      </div>
      <div>
       <h4 style={styles.noteTitle}>
        Status
       </h4>
        <div style={styles.checkboxContainer}>
          <div>
            Someday
            <input
              type='checkbox'
              checked={dueDate ? false : true}
              onChange={() => {
                if (dueDate) 
                  setDueDate(null)
                else
                  setDueDate(new Date())
              }}
            />
            </div>
            {dueDate && (
            <div style={styles.checkboxContainer}>
            Due 
            <input 
              type='date' 
              value={new Date(dueDate).toJSON().slice(0, 10)} 
              onChange={(event) => {setDueDate(new Date(event.target.value))}}
            />
            </div>
            )}
          </div>
        </div>
        
        <div>
          <div style={styles.checkboxContainer}>
            Mark as done
          <input
            type='checkbox'
            checked={doneAt ? true : false}
            onChange={() => {
              if (doneAt) 
                setDoneAt(null)
              else
                setDoneAt(new Date())
            }}
          />
          {doneAt && (
            <div style={styles.checkboxContainer}>
              Done at 
              <input 
                type='date' 
                value={new Date(doneAt).toJSON().slice(0, 10)} 
                onChange={(event) => {setDoneAt(new Date(event.target.value))}}
              />
            </div>
          )}
          </div>
        </div>


       <div style={styles.linkContainer}>
        <div>
        Link to:
        </div>
        <div style={styles.dropdownContainer}>
          <ProjectShape colorCode={projectColorCode} />
          <Dropdown 
            options={projectsOptions}
            value={projectId}
            onChange={({value}) => {setProjectId(value)}}
            placeholder="Project"
          />
        </div>
        <div style={styles.dropdownContainer}>
          <GoalShape colorCode={goalColorCode} />
          <Dropdown options={goalsOptions} value={goalId} onChange={({value}) => {setGoalId(value)}} placeholder="Goal" />
        </div>
        
       </div>

         <h4 style={styles.noteTitle}>
          Note
         </h4>
      <div style={styles.noteContainer}>
        <textarea 
          type='text' 
          name='note'
          value={note ? note : ''} 
          onChange={(event) => setNote(event.target.value)} 
          style={styles.noteText}
        />
      </div>

      <div style={styles.footer}>
        <button style={styles.buttonCancel} onClick={() => props.onDescribe({
          task: null, project: null, goal: null
        })}>
          Cancel
        </button>
        <button style={styles.buttonSave} onClick={onSave}>
          Save
        </button>
      </div>
    </div>
    </Modal>
  )
}

const styles = {
  wrapper: {
    background: 'white',
    width: 300,
    height: '50%',
    margin: 30,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
  },
  title: {
    fontSize: 25,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  buttonBack: {
    height: 20,
    width: 20,
  },
  titleTaskContainer: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: '100%',
    padding: 3,
    margin: 10,
  },
  titleTaskText: {
    background: 'transparent',
    fontSize: 20,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 0,
    fontWeight: 'bold',
  },
  noteTitle: {
    marginLeft: 10,
    color: '#32A3BC',
    marginRight: 10,
  },
  noteText: {
    width: '90%',
    height: 100,
  },
  noteContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  checkboxContainer: {
    marginLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    marginLeft: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownContainer: {
    display: 'flex',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  footer: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deleteButton: {
    cursor: 'pointer',
    marginRight: 5
  },
  buttonCancel: {
    background: '#F51111',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonSave: {
    background: '#32A3BC',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    borderRadius: 20,
    transform: 'translate(-50%, -50%)'
  },
}

export default TaskDescription

