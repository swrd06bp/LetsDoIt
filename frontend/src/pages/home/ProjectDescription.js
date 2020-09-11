import React, { useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { DragDropContext } from 'react-beautiful-dnd'

import TitleElem from '../../components/CommonDescription/TitleElem'
import AddTask from '../../components/AddTask'
import TaskList from '../../components/TaskList'
import ListButton from '../../components/ListButton'
import DeleteButton from '../../components/DeleteButton'
import GoalShape from '../../components/GoalShape'
import Api from '../../app/Api'
import { getDimScreen, getDimRatio } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function ProjectDescription (props) {
  const [content, setContent] = useState(props.project.content)
  const [note, setNote] = useState(props.project.note)
  const [dueDate, setDueDate] = useState(props.project.dueDate)
  const [doneAt, setDoneAt] = useState(props.project.doneAt)
  const [goalId, setGoalId] = useState(props.project.goalId)
  const [list, setList] = useState(props.project.list)
  const [tasks, setTasks] = useState([])
  const api = new Api()

  useEffect(() => {
    getProjectTasks()
  }, [])

  const getProjectTasks = async () => {
    const resp = await api.getTasksProject(props.project._id) 
    const results = await resp.json()
    const sortedTasks = sortProjectTasks(results).map( x => {
      const task = x
      task.id = task._id
      return task
    })
    setTasks(sortedTasks)
  }

  const goalColorCode = props.goals.filter(x => x._id === goalId).length
    ? props.goals.filter(x => x._id === goalId)[0].colorCode : null


  let goalsOptions = props.goals.map(x => ({value: x._id, label: x.content}))
  goalsOptions.unshift({value: null, label: 'none'})

  const onSave = async () => {
    await api.updateProject(
      props.project._id,
      {content, dueDate, note, goalId, list, doneAt}
    )
    props.onDescribe({project: null, project: null, goal: null})
  }

  const onDelete = async () => {
    await api.deleteProject(props.project._id)
    props.onDescribe({project: null, project: null, goal: null})
  }
  return (
    <div style={styles().wrapper}>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={styles().title}>Description</h3>
        <DeleteButton confirm={true} width='15' height='15' onDelete={onDelete} />
      </div>

      <TitleElem
        item={props.project}
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
            onChange={(event) => {setDueDate(new Date(event.target.value))}}
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
                onChange={(event) => {setDoneAt(new Date(event.target.value))}}
              />
            </div>
          )}
          </div>
        </div>

       <div style={styles().linkContainer}>
        <div>
        Link to:
        </div>
        <GoalShape colorCode={goalColorCode} />
        <Dropdown options={goalsOptions} value={goalId} onChange={({value}) => {setGoalId(value)}} placeholder="Goal" />
        
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
            onChange={(event) => setNote(event.target.value)} 
            style={styles().noteText}
          />
       </div>
      </div>

    </div>
      <div style={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <DragDropContext onDragEnd={() => {}}>
        <div style={styles().taskListTitle}>
          <div style={styles().noteTitle}>Tasks</div>
          <div style={styles().noteTitle}>{tasks.filter(x => x.doneAt).length}/{tasks.length}</div>
        </div>
        <div style={styles().taskList}>
        <TaskList
          droppableId={"tasks"}
          items={tasks}
          onUpdate={getProjectTasks}
          onDescribe={() => {}}
          scale={1}
          projectTask={true}
        />
        </div>
        </DragDropContext>
        <AddTask projectId={props.project._id} onUpdate={getProjectTasks} list={props.project.list}/>
      </div>
    </div>

      <div style={styles().footer}>
        <div 
          style={styles().buttonCancel} 
          onClick={() => props.onDescribe({
            task: null, project: null, goal: null
          })}
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
          style={styles().buttonSave}
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
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 700 * getDimRatio().X,
    height: 550* getDimRatio().Y,
    margin: 30,
    background: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    boxShadow: '2px 4px grey',
  },
  title: {
    fontSize: 25 * getDimRatio().X,
    marginLeft: 10,
    fontWeight: 'normal',
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
    fontSize: 20 * getDimRatio().X,
    color: '#32A3BC',
  },
  noteText: {
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
    fontSize: 13 * getDimRatio().X,
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
    fontSize: 15 * getDimRatio().X,
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
    fontSize: 15 * getDimRatio().X,
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
})

export default ProjectDescription
