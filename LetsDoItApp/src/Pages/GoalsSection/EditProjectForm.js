import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  TextInput, 
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'
import EStyleSheet from 'react-native-extended-stylesheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import ActionButton from '../../components/ActionButton'
import Api from '../../Api'

function EditHabitForm(props) {
  const nextYear = new Date()
  nextYear.setDate(new Date().getDate() + 365)
	const [content, setContent] = useState('')
  const [list, setList] = useState('Work')
  const [dueDate, setDueDate] = useState(nextYear
  const [showDatePicker, setShowDatePicker] = useState(false)


  


	return (
       <Modal
         style={styles.wrapper}
         isVisible={props.goalId ? true : false}
         hasBackdrop={true}
         onBackdropPress={props.onClose}
       >
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dueDate}
            mode={'date'}
            display="default"
            onPressCancel={() => setShowDatePicker(false)}
            onCloseModal={() => setShowDatePicker(false)}
            onChange={setDueDate}
          />
        )}

         <View style={styles.container}>
         <View style={styles.titleContainer}>
           <Text style={styles.titleText}>{props.habit ? 'Edit this' : 'Create a'} Goal</Text>
         </View>
         <View style={styles.nameContainer}>
           <Text>Name:</Text>
           <TextInput
            value={content} 
             placeholder={'I am going to acheive..'}
             onChangeText={setContent}
             style={styles.nameInputContainer}
            />
         </View>
       
         <ActionButton text={'Save'} onSubmit={() => {
          if (content) {
            const habit = { 
              content, 
              frequency: chosenFrequency, 
              goalId: props.goalId, 
              doneAt: null,
              acheived: null,
              startTime,
              maxStreak,
              isNotification,
            }
            props.onAddHabit(habit)
         }
         }} />
         </View>
       </Modal>
	)
}

const styles = EStyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  container: {
    marginHorizontal: '17rem',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  titleText: {
    fontSize: '18rem',
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: '10rem',
  },
  nameContainer: {
    alignSelf: 'center',
    width: '100%',
    marginVertical: '2rem',
  },
  nameInputContainer: {
    borderColor: 'grey',
    borderWidth: 0.5,
    height: '40rem'
  },
  frequencyContainer: {
    flexDirection: 'row',
    height: '40rem',
    alignItems: 'center',
    marginVertical: '2rem',
  },
  notificationContainer: {
    flexDirection: 'row',
    height: '40rem',
    alignItems: 'center',
    marginVertical: '2rem',
  },
  startTimeContainer: {
    borderWidth: 0.5,
    borderColor: 'grey',
    marginVertical: '2rem',
    height: '40rem',
    justifyContent: 'center',
    paddingHorizontal: '3rem',
  },
  checkbox: { 
    height: '18rem', 
    width: '18rem',
    marginRight: '10rem', 
  },
  maxStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '40rem',
  },
  inputTextContainer: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    height: '40rem',
    alignItems: 'center',
    paddingHorizontal: '3rem',
  }, 
  linkAndroidContainer: {
    marginLeft: '5rem',
    height: '40rem',
    width: '110rem',
  }, 

  inputIOS: {
    marginLeft: '5rem',
    height: '40rem',
    width: '110rem',
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingLeft: '5rem'
    }

 })

export default EditHabitForm