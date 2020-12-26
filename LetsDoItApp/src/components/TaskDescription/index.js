import React, { useState } from 'react'
import { 
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import DatePicker from 'react-native-datepicker'
import CheckBox from '@react-native-community/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'
import DropDownPicker from 'react-native-dropdown-picker'

import Api from '../../Api'
import ActionButton from '../ActionButton'
import ListButton from '../ListButton'

function TaskDescription (props) {
  const [content, setContent] = useState(props.task.content)
  const [note, setNote] = useState(props.task.note)
  const [dueDate, setDueDate] = useState(props.task.dueDate)
  const [doneAt, setDoneAt] = useState(props.task.doneAt)
  const [isNotification, setIsNotification] = useState(props.task.isNotification)
  const [hourNotif, setHourNotif] = useState(new Date(props.task.dueDate).getHours())
  const [list, setList] = useState(props.task.list)
  const [goalId, setGoalId] = useState(props.task.goalId ? props.task.goalId : 0)
  const [projectId, setProjectId] = useState(props.task.projectId ? props.task.projectId : 0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const api = new Api()

 
  const onSave = async () => {
    await api.updateTask(props.task._id, {
      content,
       dueDate, 
       note, 
       list, 
       doneAt,
       isNotification,
       goalId: goalId === 0 ? null : goalId,
       projectId: projectId === 0 ? null : projectId,
     })
    props.onDescribe(null)
    props.onUpdate()
  }

  const onDateChange = async (event, selectedDate) => {
    if (selectedDate) {
      if (showDatePicker === 'dueDate') 
        setDueDate(selectedDate)
      if (showDatePicker === 'doneAt') 
        setDoneAt(selectedDate)
      setShowDatePicker(false)
    }
  }
  
  const onDelete = async () => {
    const resp = await api.deleteTask(props.task._id)
    props.onDescribe(null)
    props.onUpdate()
  }

  let projectOptions = props.projects.map((x) => ({
   value: x._id, 
   label: x.content,
   icon: () => (
     <View style={{
       backgroundColor: x.colorCode, 
       width: 15,
       height: 15,
       borderRadius: 20,
     }} />
    )
 }))
  projectOptions.unshift({ value: 0, label: 'Project' })

  let goalOptions = props.goals.map((x) => ({
   value: x._id, 
   label: x.content,
   icon: () => (
     <View style={{
       backgroundColor: x.colorCode, 
       width: 15,
       height: 15,
     }} />
    )
 }))
  goalOptions.unshift({ value: 0, label: 'Goal' })

  return (
    <Modal 
      style={styles.wrapper}
      onBackdropPress={() => props.onDescribe(null)}
      isVisible={props.isVisible}
    >
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={showDatePicker === 'dueDate' ? new Date(dueDate): new Date(doneAt)}
          is24Hour={true}
          mode={'date'}
          display="default"
          onChange={onDateChange}
        />
      )}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{flex: 1}}
      >
        <View style={styles.header}>
          <Text style={styles.descriptionText}>Description</Text>
          <TouchableOpacity
            onPress={onDelete}
            style={styles.trashContainer}
          >
            <Image 
              source={require('../../../static/trash.png')}
              style={styles.trashImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <TextInput 
            style={styles.titleText}
            value={content} 
            onChangeText={(text) => setContent(text)} 
          />
          <ListButton list={list} onListChange={() => {
            const newList = list === 'Personal' ? 'Work' : 'Personal'
            setList(newList)
          }} />
        </View>
      <View>
        <View style={styles.dueContainer}>
          <View style={styles.dueContainer}>
            <Text>Someday</Text>
            <CheckBox 
              value={dueDate ? false : true}
              onChange={() => {
              if (dueDate) 
                setDueDate(null)
              else
                setDueDate(new Date())
            }}/>
          </View>
          {dueDate && (
            <View style={styles.dueContainer}>
            <Text>Due</Text>
            <TouchableOpacity
              onPress={() => {setShowDatePicker('dueDate')}}
              style={styles.dueDate}
            >
              <Text>{new Date(dueDate).toJSON().slice(0, 10)}</Text> 
            </TouchableOpacity>
            </View>
          )}
        </View>
        {dueDate && ( <View style={styles.dueContainer}>
          <View style={styles.dueContainer}>
            <Text>Notification</Text>
            <CheckBox 
              value={isNotification}
              onChange={() => {
              if (isNotification) 
                setIsNotification(false)
              else
                setIsNotification(true)
            }}/>
          </View>
          {isNotification && (
            <View style={styles.dueContainer}>
            <Text>Hour</Text>
            <TextInput
              style={styles.dueDate}
              value={hourNotif.toString()}
              onChangeText={(text) => {
                if (text && parseInt(text) >= 0 && parseInt(text) < 24) {

                  setHourNotif(text.replace(/[^0-9]/g, ''))
                  const newDueDate = new Date(dueDate)
                  newDueDate.setHours(parseInt(text))
                  setDueDate(newDueDate)
                }
              }}
            />
             
            
            </View>
          )}
        </View>)}
        <View style={styles.dueContainer}>
          <View style={styles.dueContainer}>
            <Text>Mark as done</Text>
            <CheckBox 
              value={doneAt ? true : false}
              onChange={() => {
              if (doneAt) 
                setDoneAt(null)
              else
                setDoneAt(new Date())
            }}/>
          </View>
          {doneAt && (
            <View style={styles.dueContainer}>
            <Text>Done at</Text>
            <TouchableOpacity
              onPress={() => {setShowDatePicker('doneAt')}}
              style={styles.dueDate}
            >
              <Text>{new Date(doneAt).toJSON().slice(0, 10)}</Text> 
            </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.dueContainer}>
           <View style={styles.dueContainer}>
              <Text>Link with:</Text>
              <DropDownPicker
                items={projectOptions}
                defaultValue={projectId}
                containerStyle={styles.linkContainer}
                style={styles.linkDropdown}
                itemStyle={{
                  justifyContent: 'flex-start'
                }}
                dropDownStyle={styles.linkDropdown}
                onChangeItem={({value}) => setProjectId(value)}
              />
              <DropDownPicker
                items={goalOptions}
                defaultValue={goalId}
                containerStyle={styles.linkContainer}
                style={styles.linkDropdown}
                itemStyle={{
                  justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={({value}) => setGoalId(value)}
              />
           </View>
        </View>
      </View>

      <View>
         <Text style={styles.noteTitle}>Note</Text>
          <TextInput 
            multiline={true}
            numberOfLines = {4}
            value={note ? note : ''} 
            onChangeText={(text) => setNote(text)} 
            style={styles.noteText}
          />
      </View>

      <ActionButton onSubmit={onSave} text={'Save'} />
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    height: 460,
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trashContainer: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  trashImage: {
    height: 20,
    width: 20,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: 10,
  },
  titleContainer: {
    backgroundColor: 'lightgrey',
    height: 70,
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  titleText: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dueContainer: {
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkDropdown: {
    backgroundColor: '#fafafa',
  },
  linkContainer: {
    marginLeft: 5,
    height: 40,
    width: 100,
  },
  dueDate: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  noteTitle: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  noteText: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  

})

export default TaskDescription

