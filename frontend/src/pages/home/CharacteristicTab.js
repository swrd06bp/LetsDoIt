import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { DragDropContext } from 'react-beautiful-dnd'

import TitleElem from '../../components/CommonDescription/TitleElem'
import AddTask from '../../components/AddTask'
import TaskList from '../../components/TaskList'
import ListButton from '../../components/ListButton'
import GoalShape from '../../components/Goal/GoalShape'
import Api from '../../app/Api'
import { getDimScreen, getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function CharacteristicsTab (props) {
  const [isSaving, setIsSaving] = useState(false)
  const [content, setContent] = useState(props.elem.content)
  const [note, setNote] = useState(props.elem.note)
  const [dueDate, setDueDate] = useState(props.elem.dueDate)
  const [doneAt, setDoneAt] = useState(props.elem.doneAt)
  const [list, setList] = useState(props.elem.list)
  
  let timer = null

  useEffect(() => {
    savingAction()
  }, [content, list, note, dueDate, doneAt])

  const savingAction = async () => {
    setIsSaving(true)
    clearTimeout(timer)
    // if (mixpanel.config.token)
    //   mixpanel.track('Task Description - save')
    timer = setTimeout(() => {
        props.onSave({content, note, dueDate, list, doneAt})
         .then(() => setIsSaving(false))
    }, 1000)
  }
  

  return (
    <div style={styles().wrapper}>
      <TitleElem
        item={props.elem}
        content={content}
        setContent={setContent}
        setList={setList}
      />

     <div style={{display: 'flex', flexDirection: 'row', height: '60%'}}>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
       <div style={styles().noteTitle}>
        Status
       </div>
        <div style={styles().checkboxContainer}>
          Someday
          <div>
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
            <div style={styles().checkboxContainer}>
          Due 
          <input 
            type='date' 
            value={new Date(dueDate).toJSON().slice(0, 10)} 
            onChange={(event) => {
              setDueDate(new Date(event.target.value))
            }}
          />
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
                  setDoneAt(new Date(event.target.value))
                }}
              />
            </div>
          )}
          </div>
        </div>


      <div>
        <div style={styles().noteTitle}>
          Note
        </div>
        <div style={styles().noteContainer}>
          <textarea 
            type='text' 
            name='note'
            value={note ? note : ''} 
            onChange={(event) => {
              setNote(event.target.value)
            }} 
            style={styles().noteText}
          />
       </div>
      </div>

    </div>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <DragDropContext onDragEnd={() => {}}>
        <div style={styles().taskListTitle}>
          <div style={styles().noteTitle}>Tasks</div>
          <div style={styles().noteTitle}>{props.tasks.filter(x => x.doneAt).length}/{props.tasks.length}</div>
        </div>
        <div style={styles().taskList}>
        {!props.isGoal && (
        <TaskList
          droppableId={"props.tasks"}
          items={props.tasks}
          project={props.elem}
          onUpdate={props.getTasks}
          onDescribe={props.onDescribe}
          scale={1}
          projectTask={true}
        />
        )}
        {props.isGoal && (
        <TaskList
          droppableId={"props.tasks"}
          items={props.tasks}
          goal={props.elem}
          onUpdate={props.getTasks}
          onDescribe={props.onDescribe}
          scale={1}
          projectTask={true}
        />
        )}
        
        </div>
        </DragDropContext>
        {!props.isGoal && (
        <AddTask
          projectId={props.elem._id} 
          onCreate={(task) => props.setTasks(sortProjectTasks([task, ...props.tasks]))}
          list={props.elem.list}
        />
        )}
        {props.isGoal && (
        <AddTask
          goalId={props.elem._id} 
          onCreate={(task) => props.setTasks(sortProjectTasks([task, ...props.tasks]))}
          list={props.elem.list}
        />
        )}
      </div>
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
  
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '90%',
  },
  title: {
    fontSize: 25 * getDimRatioText().X,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  checkbox: {
    borderStyle: 'solid',
    borderColor: 'grey',
    borderWidth: 1,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonBack: {
    height: 20 * getDimRatio().X,
    width: 20 * getDimRatio().X,
  },
  taskListTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskList: {
    overflow: 'scroll',
    height: '100%',
  },
  noteTitle: {
    marginLeft: 10* getDimRatio().X,
    marginRight: 10 * getDimRatio().X,
    fontSize: 23 * getDimRatioText().X,
    color: '#32A3BC',
  },
  noteText: {
    fontSize: 16 * getDimRatioText().X,
    width: '90%',
    height: 120 * getDimRatio().Y,
  },
  noteContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  checkboxContainer: {
    marginLeft: 10,
    fontSize: 18 * getDimRatioText().X,
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
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonCancel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#F51111',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatioText().X,
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonSave: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#32A3BC',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatioText().X,
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  imgToDo: {
    height: 25,
    width: 25,
  },
  containerToDo: {
    marginLeft: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  savingText: {
    fontStyle: 'italic',
    fontSize: 14 * getDimRatioText().X,
  },
  savedText: {
    fontSize: 14 * getDimRatioText().X,
    marginLeft: 5,
  },
})

export default CharacteristicsTab
