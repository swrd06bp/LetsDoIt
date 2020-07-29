import React, { useState } from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { DraxView } from 'react-native-drax'

const getListStyle = (isDraggingOver, scale, isPast) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    height: scale === 1 ? null : 300,
    overflow: scale === 1 ? null : 'auto',
    opacity: isPast ? 0.4 : 1,
})

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',
    borderRadius: 10,


    // styles we need to apply on draggables
    ...draggableStyle
})

const Item = (props) => {
  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {isDone: !props.item.isDone})
    props.onUpdate()
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()

  }
  return(
    <View 
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
    >
      <View style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}> 
        <CheckBox 
          value={props.item.isDone}
          onValueChange={onCheckboxChange}
        />
        <View style={{flexGrow: 1, }} onClick={() => props.onDescribe(props.task ? null : props.item)}>
        <Text style={{fontSize:13, textDecorationLine: props.item.isDone ? 'line-through': null, color: props.item.isDone ? 'grey': 'black'}}>{props.item.content}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity 
          style={{backgroundColor: props.item.list === 'Personal' ? 'blue' : 'brown', borderRadius: 60}}
          onPress={onListChange}
        >
          <View style={{margin: 2}}>
            <Text style={{fontSize: 9, fontWeight: 'bold',  color: 'white'}}>{props.item.list}</Text>
          </View>
        </TouchableOpacity>
      
      </View>
    </View>
  )  
}


function TaskList (props) {
  const [received, setReceived] = React.useState([])

  return (
    <View>
            <FlatList
              data={props.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DraxView
                  renderContent={({ viewState }) => {
                    const receivingDrag = viewState && viewState.receivingDrag
                    const payload = receivingDrag && receivingDrag.payload
                    return (
					  <Item item={item} onUpdate={props.onUpdate} />
                    )
                  }}
                  dragPayload={'R'}
                  longPressDelay={1000}
                  onReceiveDragEnter={()=> {console.log('ol')}}
                  onReceiveDragDrop={(event) => {
                    setReceived([
                      ...received,
                      event.dragged.payload || '?',
                    ])
                  }}
                 />
              )}
            />     
    </View>
  )
}

export default TaskList
