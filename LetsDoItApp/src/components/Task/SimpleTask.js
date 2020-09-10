import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  SectionList,
  Vibration,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { DraxView } from 'react-native-drax'
import CheckBox from '@react-native-community/checkbox'

import ListButton from '../ListButton'
import Api from '../../Api.js'


function Task (props) {
  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {doneAt: !props.item.doneAt ? new Date() : null})
    Vibration.vibrate(100)
    props.onUpdate()
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()
  }

  return(
    <View 
      style={[
        styles.wrapper, 
        {backgroundColor: props.isSelected ? 'lightgreen' :'white'},
        {elevation: props.item.doneAt ? 0 : 20}
      ]}
    >
      <View style={styles.firstPart}> 
        <CheckBox 
          value={props.item.doneAt ? true : false}
          onValueChange={onCheckboxChange}
        />
        <View style={{flexGrow: 1, }} onClick={() => props.onDescribe(props.task ? null : props.item)}>
        <Text style={{fontSize:14, textDecorationLine: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}}>{props.item.content}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ListButton list={props.item.list} onListChange={onListChange} />
      
      </View>
    </View>
  )  
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 37,
    borderRadius: 40,
    marginHorizontal: 5,
  },
  firstPart: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    left: 10,
  }, 

})

export default Task
