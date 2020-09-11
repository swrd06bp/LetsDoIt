import React, { useState } from 'react'

function ListButton (props) {
  const [list, setList] = useState(props.item.list)

  const onListChange = async () => {
    if (props.active) {
      const newList = list === 'Work' ? 'Personal' : 'Work'
      setList(newList)
      props.onListChange(newList)
    }
  }

  return (
    <div 
      name="list"
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
