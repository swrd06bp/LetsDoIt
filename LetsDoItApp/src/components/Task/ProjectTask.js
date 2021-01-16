import React from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity,
  Vibration,
  TouchableHighlight,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import CheckBox from '@react-native-community/checkbox'

import Api from '../../Api'




function ProjectTask (props) {
  const onCheckboxChange = async () => {
    const api = new Api()
    Vibration.vibrate(100)
    await api.updateTask(props.item.id, {doneAt: !props.item.doneAt ? new Date() : null})
    props.onUpdate()
  }

  return (
    <TouchableOpacity key={props.item._id} style={styles.wrapper} onPress={() => props.onDescribe({task: props.item})}>
      <View style={styles.firstPart}>
        <View style={styles.dueDateContainer}>
          <Text style={styles.dueDateText}>{props.item.doneAt ? props.item.doneAt.slice(0, 10) : (props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday')}</Text>
        </View>
      </View>
      <TouchableHighlight>
        <CheckBox
          activeOpacity={1} 
          style={styles.checkbox}
          boxType={'square'}
          value={props.item.doneAt ? true : false}
          onValueChange={onCheckboxChange}
        />
        </TouchableHighlight>
      <View>
        <Text>{props.item.content}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = EStyleSheet.create({
  wrapper: {
    height: '35rem',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 0.7,
    borderRadius: 10,
    margin: '1rem',
  },
  firstPart: {
  	justifyContent: 'center',
  	width: '25%'
  },
  dueDateContainer: {
  	backgroundColor: 'lightgrey',
  	borderRadius: 10,
  	padding: '3rem',
  	width: '90rem',
  },
  dueDateText: {
  	fontSize: '13rem',
  	textAlign: 'center',
  },
  checkbox: { 
    height: '18rem', 
    width: '18rem',
    marginRight: '10rem', 
  }
})


export default ProjectTask