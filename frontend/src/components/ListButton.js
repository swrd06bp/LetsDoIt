import React, { useState } from 'react'

function ListButton (props) {
  const [list, setList] = useState(props.item.list)

  const onListChange = async () => {
    if (props.active) {
      const newList = list === 'Work' ? 'Personal' : 'Work'
      setList(newList)
      props.onListChange(newList)
    }
    //const api = new Api()
    //if (!props.type || props.type === 'task')
      //await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    //if (props.type === 'project')
      //await api.updateProject(props.item._id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    //props.onUpdate()
  }

  return (
    <div 
      style={{fontSize: 9*props.scale, background: list === 'Personal' ? 'blue' : 'brown', cursor: 'pointer', fontWeight: 'bold',  color: 'white',  borderRadius: 60, width:45*props.scale, alignItems: 'center', justifyContent: 'center' }}
      onClick={onListChange}
    >
      <div style={{margin: 2, textAlign: 'center'}}>
        {list}
      </div>
    </div>
  
  )
}


export default ListButton
