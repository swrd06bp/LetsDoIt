import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import Modal from 'react-modal'
import { useMixpanel } from 'react-mixpanel-browser'
import { TimePicker } from 'antd'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import TitleElem from '../../components/CommonDescription/TitleElem'
import GoalShape from '../../components/Goal/GoalShape'
import ProjectShape from '../../components/Project/ProjectShape'
import DeleteButton from '../../components/DeleteButton'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'

import moment from 'moment'
import Api from '../../app/Api'



function TaskDescription (props) {
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState(props.describeElem.task.content)
  const [note, setNote] = useState(props.describeElem.task.note)
  const [dueDate, setDueDate] = useState(props.describeElem.task.dueDate)
  const [isNotification, setIsNotification] = useState(props.describeElem.task.isNotification)
  const [doneAt, setDoneAt] = useState(props.describeElem.task.doneAt)
  const [projectId, setProjectId] = useState(props.describeElem.task.projectId)
  const [goalId, setGoalId] = useState(props.describeElem.task.goalId)
  const [list, setList] = useState(props.describeElem.task.list)
  const [isNoteActive, setIsNoteActive] = useState(props.describeElem.task.isNoteActive)
  const [isNew, setIsNew] = useState(props.describeElem.task.isNew)
  
  const api = new Api()
  const mixpanel = useMixpanel()
  let timer = null
  
  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  useEffect(() => {
    onSave()
  }, [list, content, note, dueDate, isNotification, doneAt, projectId, goalId])


  let projectsOptions = props.projects.map(x => ({value: x._id, label: x.content}))
  projectsOptions.unshift({value: null, label: 'none'})
  

  const project = props.projects.filter(x => x._id === projectId).length
    ? props.projects.filter(x => x._id === projectId)[0] : null
  
  const goal = props.goals.filter(x => x._id === goalId).length
    ? props.goals.filter(x => x._id === goalId)[0] : null


  let goalsOptions = props.goals.map(x => ({value: x._id, label: x.content}))
  goalsOptions.unshift({value: null, label: 'none'})

  const onSave = async () => {
    setIsSaving(true)
    clearTimeout(timer)
    // if (mixpanel.config.token)
    //   mixpanel.track('Task Description - save')
    timer = setTimeout(() => {
      if (isNew && content !== 'New task')
        setIsNew(false)

      api.updateTask(
        props.describeElem.task.id, 
        {content, dueDate, projectId, goalId, note, list, doneAt, isNotification}
      )
        .then(() => setIsSaving(false))
    }, 1000)
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
        style={styles()}
        contentLabel="Example Modal"
      >
    <div style={styles().wrapper}>
      {isNoteActive && (
        <div>
        <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <img 
              src='./left-arrow.png'
              style={styles().backImage}
              width='25' 
              height='25' 
              onClick={() => {
                props.onDescribe({
                  task: null,
                  project: props.describeElem.project,
                  goal: props.describeElem.goal
                })
              }}
            />
            <h3 style={styles().title}>Note</h3>
          </div>
          <DeleteButton width='15' height='15' onDelete={onDelete} />
        </div>
        <div style={styles().borderWrapper}>
          <textarea 
            type='text' 
            name='titleNote'
            value={content} 
            style={styles().titleTextNote}
            onChange={(event) => setContent(event.target.value)}
            placeholder='Task'
            onClick={(event) => {
              if (isNew)
                event.target.select()
            }}
          />
         <textarea 
            type='text' 
            name='noteNote'
            value={note ? note : ''} 
            style={styles().noteTextNote}
            onChange={(event) => setNote(event.target.value)}
            placeholder='Add some notes'
          />
        </div>
        <div style={styles().footer}>
          {isSaving && (
            <div style={styles().savingText}>Saving...</div>
          )}
          {!isSaving && (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <img src={'./tick.png'} height='7' width='7' />
              <div style={styles().savedText}>Saved</div>
            </div>
          )}          
        </div>
        </div>
      )}
      {!isNoteActive && (
        <div>
        <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <img 
              src='./left-arrow.png'
              style={styles().backImage}
              width='25' 
              height='25' 
              onClick={() => props.onDescribe({
                  task: null,
                  project: props.describeElem.project,
                  goal: props.describeElem.goal
                })
              }
            />
            <h3 style={styles().title}>Description</h3>
          </div>
          <DeleteButton width='15' height='15' onDelete={onDelete} />
        </div>
        <TitleElem
          item={props.describeElem.task}
          content={content}
          setContent={setContent}
          setList={setList}
        />
        <div>
         <h4 style={styles().noteTitle}>
          Status
         </h4>
          <div style={styles().checkboxContainer}>
            <div>
              Someday
              <input
                type='checkbox'
                checked={dueDate ? false : true}
                onChange={() => {
                  // if (mixpanel.config.token)
                  //   mixpanel.track('Task Description - Chexbox dueDate', {dueDate})
                  if (dueDate) 
                    setDueDate(null)
                  else
                    setDueDate(new Date())
                }}
              />
              </div>
              {dueDate && (
              <div style={styles().checkboxContainer}>
              Due 
              <input 
                type='date' 
                value={new Date(dueDate).toJSON().slice(0, 10)} 
                onChange={(event) => {
                  // if (mixpanel.config.token)
                  //   mixpanel.track('Task Description - TextInput dueDate', {dueDate})
                  setDueDate(new Date(event.target.value))
                }}
              />
              </div>
              )}
            </div>

          {dueDate && (
            <div style={styles().checkboxContainer}>
            <div>
              Notifications
              <input
                type='checkbox'
                checked={isNotification}
                onChange={() => {
                  // if (mixpanel.config.token)
                  //   mixpanel.track('Task Description - Checkbox notifications', {isNotification})
                  if (isNotification) 
                    setIsNotification(false)
                  else
                    setIsNotification(true)
                }}
              />
              </div>
              {isNotification && (
              <div style={styles().checkboxContainer}>
              hour 
              <div>
              <TimePicker
                minuteStep={15}
                format={'hh:mm'}
                onChange={(value) => {
                  let newDueDate = new Date(dueDate)
                  newDueDate.setHours(value.format('hh'))
                  newDueDate.setMinutes(value.format('mm'))
                  setDueDate(newDueDate)
                }}
                value={moment(dueDate)}
              />
              </div>
              </div>
              )}
            </div>
          )}
          </div>
          
          <div>
            <div style={styles().checkboxContainer}>
              Mark as done
            <input
              type='checkbox'
              checked={doneAt ? true : false}
              onChange={() => {
                  // if (mixpanel.config.token)
                  //   mixpanel.track('Task Description - Checkbox doneAt', {doneAt})
                if (doneAt) 
                  setDoneAt(null)
                else
                  setDoneAt(new Date())
              }}
            />
            {doneAt && (
              <div style={styles().checkboxContainer}>
                Done at 
                <input 
                  type='date' 
                  value={new Date(doneAt).toJSON().slice(0, 10)} 
                  onChange={(event) => {
                    // if (mixpanel.config.token)
                    //   mixpanel.track('Task Description - TextInput doneAt', {doneAt})
                    setDoneAt(new Date(event.target.value))
                  }}
                />
              </div>
            )}
            </div>
          </div>


         <div style={styles().linkContainer}>
          <div>
          Link to:
          </div>
          <div 
            style={styles().dropdownContainer}
            title={projectsOptions.filter(x => x.value === projectId)[0].label}
          >
            <ProjectShape project={project} />
            <Select 
              styles={styles().dropdownSelect}
              options={projectsOptions}
              selectValue={projectId}
              onChange={({value}) => {
                // if (mixpanel.config.token)
                //   mixpanel.track('Task Description - Change projectId', {projectId})
                setProjectId(value)
              }}
              placeholder="Project"
            />
          </div>
          <div
            style={styles().dropdownContainer}
            title={goalsOptions.filter(x => x.value === goalId)[0].label}
          >
            <GoalShape goal={goal} />
            <Select 
              options={goalsOptions}
              selectValue={goalId}
              styles={styles().dropdownSelect}
              onChange={({value}) => {
                // if (mixpanel.config.token)
                //   mixpanel.track('Task Description - Change goalId', {goalId})
                setGoalId(value)
              }} 
              placeholder="Goal" />
          </div>
          
         </div>

           <h4 style={styles().noteTitle}>
            Note
           </h4>
        <div style={styles.noteContainer}>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            style={styles().noteText}
            onClick={() => {
              setIsNoteActive(true)
              
            }}
          />
        </div>

        <div style={styles().footer}>
          {isSaving && (
            <div style={styles().savingText}>Saving</div>
          )}
          {!isSaving && (
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <img src={'./tick.png'} height='7' width='7' />
              <div style={styles().savedText}>Saved</div>
            </div>
          )}          
        </div>
    
        </div>
      )}
    </div>
    </Modal>
  )
}

const styles = () => ({
  wrapper: {
    background: 'white',
    width: 450 * getDimRatio().X,
    height: '50%',
    margin: 30 * getDimRatio().X,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
  },
  title: {
    fontSize: 25 * getDimRatioText().X,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  buttonBack: {
    height: 20 * getDimRatio().X,
    width: 20 * getDimRatio().Y,
  },
  noteTitle: {
    marginLeft: 10,
    color: '#32A3BC',
    marginRight: 10,
  },
  noteText: {
    width: '90%',
    height: 100 * getDimRatio().Y,
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
  dropdownSelect: {
    control: (styles) => ({...styles, width: 140 * getDimRatio().X})
  },
  footer: {
    height: 60 * getDimRatio().Y,
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
    fontSize: 18 * getDimRatio().X,
    height: 40 * getDimRatio().Y,
    width: 70 * getDimRatio().X,
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
    fontSize: 18 * getDimRatio().X,
    height: 40 * getDimRatio().Y,
    width: 70 * getDimRatio().X,
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
  borderWrapper: {
    borderRadius: 5,
    borderSize: 1,

  },
  noteTextNote: {
    width: '90%',
    height: 600 * getDimRatio().Y,
    fontSize: 20 * getDimRatioText().X,
    border: 'none',
    outline: 'none',
    overflow: 'auto',
    resize: null,
    fontFamily: 'Verdana, sans-serif',
  },
  titleTextNote: {
    width: '90%',
    fontStyle: 'bold',
    fontSize: 26 * getDimRatioText().X,
    border: 'none',
    outline: 'none',
    overflow: 'auto',
    resize: null,
    fontFamily: 'Verdana, sans-serif',
  },
  savingText: {
    fontStyle: 'italic',
    fontSize: 14 * getDimRatioText().X,
  },
  savedText: {
    fontSize: 14 * getDimRatioText().X,
  },
  backImage: {
    cursor: 'pointer',
  },
})

export default TaskDescription

