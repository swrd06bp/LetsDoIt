import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Modal from 'react-modal'
import { useMixpanel } from 'react-mixpanel-browser'

import TitleElem from '../../components/CommonDescription/TitleElem'
import GoalShape from '../../components/Goal/GoalShape'
import ProjectShape from '../../components/Project/ProjectShape'
import DeleteButton from '../../components/DeleteButton'

import Api from '../../app/Api'



function TaskDescription (props) {
  const [content, setContent] = useState(props.describeElem.task.content)
  const [note, setNote] = useState(props.describeElem.task.note)
  const [dueDate, setDueDate] = useState(props.describeElem.task.dueDate)
  const [doneAt, setDoneAt] = useState(props.describeElem.task.doneAt)
  const [projectId, setProjectId] = useState(props.describeElem.task.projectId)
  const [goalId, setGoalId] = useState(props.describeElem.task.goalId)
  const [list, setList] = useState(props.describeElem.task.list)
  const mixpanel = useMixpanel()
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
    if (mixpanel.config.token)
      mixpanel.track('Task Description - save')
    await api.updateTask(
      props.describeElem.task.id, 
      {content, dueDate, note, projectId, goalId, list, doneAt}
    )
    props.onDescribe({task: null, project: props.describeElem.project, goal: props.describeElem.goal})
  }

  const onDelete = async () => {
    if (mixpanel.config.token)
      mixpanel.track('Task Description - delete')
    await api.deleteTask(props.describeElem.task.id)
    props.onDescribe({task: null, project: props.describeElem.project, goal: props.describeElem.goal})
  }



  return (
      <Modal
        isOpen={true}
        onRequestClose={() => {
          props.onDescribe({
            task: null, 
            project: props.describeElem.project, 
            goal: props.describeElem.goal
          })
          if (mixpanel.config.token)
            mixpanel.track('Task Description - close click outside')
        }}
        style={styles}
        contentLabel="Example Modal"
      >
    <div style={styles.wrapper}>
      <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
        <h3 style={styles.title}>Description</h3>
        <DeleteButton width='15' height='15' onDelete={onDelete} />
      </div>
      <TitleElem
        item={props.describeElem.task}
        content={content}
        setContent={setContent}
        setList={setList}
      />
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
                if (mixpanel.config.token)
                  mixpanel.track('Task Description - Chexbox dueDate', {dueDate})
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
              onChange={(event) => {
                if (mixpanel.config.token)
                  mixpanel.track('Task Description - TextInput dueDate', {dueDate})
                setDueDate(new Date(event.target.value))
              }}
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
                if (mixpanel.config.token)
                  mixpanel.track('Task Description - Checkbox doneAt', {doneAt})
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
                onChange={(event) => {
                  if (mixpanel.config.token)
                    mixpanel.track('Task Description - TextInput doneAt', {doneAt})
                  setDoneAt(new Date(event.target.value))
                }}
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
            onChange={({value}) => {
              if (mixpanel.config.token)
                mixpanel.track('Task Description - Change projectId', {projectId})
              setProjectId(value)
            }}
            placeholder="Project"
          />
        </div>
        <div style={styles.dropdownContainer}>
          <GoalShape colorCode={goalColorCode} />
          <Dropdown 
            options={goalsOptions}
            value={goalId}
            onChange={({value}) => {
              if (mixpanel.config.token)
                mixpanel.track('Task Description - Change goalId', {goalId})
              setGoalId(value)
            }} 
            placeholder="Goal" />
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
          onChange={(event) => { 
            if (mixpanel.config.token)
              mixpanel.track('Task Description - Change note', {note})
            setNote(event.target.value)
          }} 
          style={styles.noteText}
        />
      </div>

      <div style={styles.footer}>
        <div
          style={styles.buttonCancel}
          onClick={() => {
            props.onDescribe({
              task: null,
              project: props.describeElem.project,
              goal: props.describeElem.goal
            })
            if (mixpanel.config.token)
              mixpanel.track('Task Description - Cancel')
          }}
          onMouseOver={(event) => {
            event.target.style.background = '#F5A9A9'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#F51111'
          }}
        >
          Cancel
        </div>
        <div
          style={styles.buttonSave} 
          onClick={onSave}
          onMouseOver={(event) => {
            event.target.style.background = '#58FAD0'
          }}
          onMouseLeave={(event) => {
            event.target.style.background = '#32A3BC'
          }}
        >
          Save
        </div>
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
  buttonCancel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F51111',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
    cursor: 'pointer',
  },
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#32A3BC',
    height: 30,
    width: 60,
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
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

