import React, { useState } from 'react'

import Api from '../../Api'

function TaskDescription (props) {
  const [content, setContent] = useState(props.task.content)
  const [note, setNote] = useState(props.task.note)
  const [dueDate, setDueDate] = useState(props.task.dueDate)


  const onSave = async () => {
    const api = new Api()
    await api.updateTask(props.task.id, {content, dueDate, note})
    props.onDescribe(null)
  }



  return (
    <div style={{display: 'flex', flexDirection: 'column', width: 250}}>
      <button onClick={() => props.onDescribe(null)} style={{display: 'flex', justifyContent: 'flex-end'}}> 
        x
      </button>
      <div>
          <input 
            type='text' 
            name='content'
            value={content} 
            onChange={(event) => setContent(event.target.value)} 
            style={{borderWidth: 0}}
          />
      </div>
      <div>
        <div>
        <input type='checkbox' checked={dueDate ? false : true} onChange={() => {
          if (dueDate) 
            setDueDate(null)
          else
            setDueDate(new Date())
        }}/>
        Someday
        </div>
        {dueDate && (
        <div>
        Due 
        <input type='date' value={new Date(dueDate).toJSON().slice(0, 10)} onChange={(event) => {setDueDate(new Date(event.target.value))}} />
        </div>
        )}
      </div>

      <div>
         <h4>
         </h4>
          <textarea 
            type='text' 
            name='note'
            value={note} 
            onChange={(event) => setNote(event.target.value)} 
            style={{height: 100}}
          />
      </div>

      <button onClick={onSave}>
        save
      </button>
    </div>
  )
}


export default TaskDescription

