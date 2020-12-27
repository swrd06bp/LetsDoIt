import React, { useState, useEffect } from 'react'
import { 
  View,
  Text,
  SectionList,
  Vibration,
  Image,
  TouchableOpacity,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { DraxView } from 'react-native-drax'
import CheckBox from '@react-native-community/checkbox'

import ListButton from '../ListButton'
import Api from '../../Api.js'


function Task (props) {
  const [isOver, setIsOver] = useState(false)

  const onCheckboxChange = async () => {
    const api = new Api()
    Vibration.vibrate(100)
    await api.updateTask(props.item.id, {doneAt: !props.item.doneAt ? new Date() : null})
    props.onDoneChange(props.item.id)
  }

  const onListChange = async () => {
    const api = new Api()
    await api.updateTask(props.item.id, {list: props.item.list === 'Personal' ? 'Work' : 'Personal'})
    props.onUpdate()
  }

  const  projectColorCode = props.projects.filter(x => x._id === props.item.projectId).length
    ? props.projects.filter(x => x._id === props.item.projectId)[0].colorCode : null
  
  const  goalColorCode = props.goals.filter(x => x._id === props.item.goalId).length
    ? props.goals.filter(x => x._id === props.item.goalId)[0].colorCode : null

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
        <Text style={{textDecorationLine: props.item.doneAt ? 'line-through': null, color: props.item.doneAt ? 'grey': 'black'}}>{props.item.content}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ListButton list={props.item.list} onListChange={onListChange} />
          <View style={{...styles.text, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2}}>
            <View style={{
              backgroundColor: projectColorCode, 
              ...styles.shape,
              borderRadius: 20,
            }} />
            <View style={{
              backgroundColor: goalColorCode, 
              ...styles.shape,
            }} />
          </View>
        </View>
      </View>
    </View>
  )  
}

const styles = EStyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '37rem',
    borderRadius: '40rem',
    marginHorizontal: '5rem',
  },
  firstPart: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    left: '10rem',
  }, 
  text: {
    fontSize: '14rem', 
  },
  shape: {
    width: '15rem',
    height: '15rem',
  },



})

export default Task
