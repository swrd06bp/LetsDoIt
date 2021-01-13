import React, { useState } from 'react'
import { 
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import DatePicker from 'react-native-datepicker'
import CheckBox from '@react-native-community/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'
import RNPickerSelect from 'react-native-picker-select'
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
  const [list, setList] = useState(props.task.list)
  const [goalId, setGoalId] = useState(props.task.goalId ? props.task.goalId : 0)
  const [projectId, setProjectId] = useState(props.task.projectId ? props.task.projectId : 0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
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
      setShowTimePicker(false)
    }
  }

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) 
      setDueDate(selectedTime.toJSON())
    
    setShowTimePicker(false)
    setShowDatePicker(false)
  }

  
  const onDelete = async () => {
    const resp = await api.deleteTask(props.task._id)
    props.onDescribe(null)
    props.onUpdate()
  }

  let projectOptions = props.projects.map((x) => ({
   value: x._id, 
   label: x.content,
   itemKey: x._id,
   icon: () => (
     <View style={{
       backgroundColor: x.colorCode, 
       width: 15,
       height: 15,
       borderRadius: 20,
     }} />
    )
 }))
  if (Platform.OS !== 'ios')
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
  if (Platform.OS !== 'ios')
    goalOptions.unshift({ value: 0, label: 'Goal' })

  return (
    <Modal 
      style={styles.wrapper}
      onBackdropPress={() => props.onDescribe(null)}
      isVisible={props.isVisible}
      hasBackdrop={true}
    >
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={showDatePicker === 'dueDate' ? new Date(dueDate): new Date(doneAt)}
          is24Hour={true}
          mode={'date'}
          display="default"
          onPressCancel={() => setShowDatePicker(false)}
          onCloseModal={() => setShowDatePicker(false)}
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(dueDate)}
          is24Hour={true}
          mode={'time'}
          minuteInterval={15}
          display="default"
          onPressCancel={() => setShowTimePicker(false)}
          onCloseModal={() => setShowTimePicker(false)}
          onChange={onTimeChange}
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
              boxType={'square'}
              style={styles.checkbox}
              value={dueDate ? false : true}
              onValueChange={() => {
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
              boxType={'square'} 
              style={styles.checkbox}
              value={isNotification ? true : false}
              onValueChange={() => {
              if (isNotification) 
                setIsNotification(false)
              else
                setIsNotification(true)
            }}/>
          </View>
          {isNotification && (
            <View style={styles.dueContainer}>
            <Text>Time</Text>
            <TouchableOpacity
              onPress={() => {setShowTimePicker(true)}}
              style={styles.dueDate}
            >
              <Text>{new Date(dueDate).getHours() + ':' + new Date(dueDate).getMinutes()}</Text> 
            </TouchableOpacity>   
            </View>
          )}
        </View>)}
        <View style={styles.dueContainer}>
          <View style={styles.dueContainer}>
            <Text>Mark as done</Text>
            <CheckBox
              style={styles.checkbox}
              boxType={'square'} 
              value={doneAt ? true : false}
              onValueChange={() => {
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
              {Platform.OS !== 'ios' && (
                <DropDownPicker
                  items={projectOptions}
                  defaultValue={projectId}
                  containerStyle={styles.linkContainer}
                  style={styles.linkDropdown}
                  selectedLabelStyle={styles.activeLinkDropdown}
                  itemStyle={{
                    justifyContent: 'flex-start',
                    
                  }}

                  dropDownStyle={styles.linkDropdown}
                  onChangeItem={({value}) => setProjectId(value)}
                />
              )}
              {Platform.OS === 'ios' && (
               <View style={[styles.linkContainer, styles.linkIOSContainer]}>
                 <RNPickerSelect
                    items={projectOptions}
                    value={projectId}
                    Icon={projectOptions.filter(x => x.value === projectId).icon}
                    onValueChange={(value) => setProjectId(value)}
                 />
                 </View>
              )}
              {Platform.OS !== 'ios' && (
                <DropDownPicker
                  items={goalOptions}
                  defaultValue={goalId}
                  containerStyle={styles.linkContainer}
                  selectedLabelStyle={styles.activeLinkDropdown}
                  style={styles.linkDropdown}
                  itemStyle={{
                    justifyContent: 'flex-start'
                  }}
                  dropDownStyle={{backgroundColor: '#fafafa'}}
                  onChangeItem={({value}) => setGoalId(value)}
                />
              )}
              {Platform.OS === 'ios' && (
               <View style={[styles.linkContainer, styles.linkIOSContainer]}>
                 <RNPickerSelect
                    items={goalOptions}
                    value={projectId}
                    onValueChange={(value) => setGoalId(value)}
                 />
                 </View>
              )}
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

const styles = EStyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    width: '80%',
    borderRadius: '10rem',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trashContainer: {
    height: '30rem',
    width: '30rem',
    justifyContent: 'center',
    alignItems: 'center'
  },
  trashImage: {
    height: '20rem',
    width: '20rem',
  },
  descriptionText: {
    fontSize: '18rem',
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: '10rem',
  },
  titleContainer: {
    backgroundColor: 'lightgrey',
    height: '70rem',
    width: '90%',
    marginVertical: '10rem',
    alignSelf: 'center',
  },
  titleText: {
    marginHorizontal: 5,
    fontSize: '16rem',
    fontWeight: 'bold',
  },
  dueContainer: {
    marginHorizontal: '5rem',
    height: '40rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkDropdown: {
    backgroundColor: '#fafafa',
  },
  linkContainer: {
    marginLeft: '5rem',
    height: '40rem',
    width: '120rem',
  },
  linkIOSContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey',
    borderWidth: 1,
  },
  activeLinkDropdown: {
    height: '20rem'  },
  dueDate: {
    marginHorizontal: '5rem',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  noteTitle: {
    fontWeight: 'bold',
    marginHorizontal: '10rem',
  },
  noteText: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: '10rem',
    height: '85rem',
  },
  checkbox: { 
    height: '18rem', 
    width: '18rem',
    marginRight: '10rem', 
  }  

})

export default TaskDescription

