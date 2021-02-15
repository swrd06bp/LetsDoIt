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
import RNPickerSelect from 'react-native-picker-select'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import CheckBox from '@react-native-community/checkbox'
import moment from 'moment'

import ActionButton from '../../components/ActionButton'
import Api from '../../Api'

function EditHabitForm(props) {
	const [content, setContent] = useState(props.habit ? props.habit.content : '')
  const [maxStreak, setMaxStreak] = useState(props.habit && props.habit.maxStreak ? props.habit.maxStreak : 66)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [frequencyOption, setFrequencyOption] = useState(!props.habit ? 0 : (props.habit.frequency.type === 'day' ? 0 : (props.habit.frequency.type === 'week' ? 1 : 2)))
  const [chosenFrequency, setChosenFrequency] = useState(props.habit ? props.habit.frequency : {type: 'day', number:1})
  const [startTime, setStartTime] = useState(props.habit.startTime ? props.habit.startTime : '00:00')
  const [isNotification, setIsNotification] = useState(false)


  const allFrequencyOptions = [
    {label: 'every day', value: 0},
    {label: 'every week', value: 1},
    {label: 'every month', value: 2},
  ]


  const weeklyFrequencyOptions = [...Array(7).keys()].slice(1).map(x => {
    const s = 'Once per week'
    const ss = 'Twice per week'
    const sss = ' times per week'
    if (x === 1) return {label:  s, value: x}
    else if (x === 2) return {label: ss, value: x}
    else return {label: x + sss, value: x}
  })  

  const monthlyFrequencyOptions = [...Array(27).keys()].slice(1).map(x => {
    const s = 'Once per month'
    const ss = 'Twice per month'
    const sss = ' times per month'
    if (x === 1) return {label:  s, value: x}
    else if (x === 2) return {label: ss, value: x}
    else return {label: x + sss, value: x}
  })

  const onOptionChange = (value) => {
    if (value === 0) setChosenFrequency({type: 'day', number: 1})
    if (value === 1) setChosenFrequency({type: 'week', number: 1})
    if (value === 2) setChosenFrequency({type: 'month', number: 1})
    setFrequencyOption(value)
  }

  const onOptionWeeklyChange = (value) => {
    setChosenFrequency({type: 'week', number: value})
  }

  const onOptionMonthlyChange = (value) => {
    setChosenFrequency({type: 'month', number: value})
  }

  const onTimeChange = (event, selectedTime) => {
     setStartTime(moment(new Date(selectedTime)).format('HH:mm'))
  }

  const hour = new Date()
  hour.setHours(parseInt(startTime.split(':')[0]))
  hour.setMinutes(parseInt(startTime.split(':')[0]))


	return (
       <Modal
         style={styles.wrapper}
         isVisible={props.goalId ? true : false}
         hasBackdrop={true}
         onBackdropPress={props.onClose}
       >
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={hour}
            is24Hour={true}
            mode={'time'}
            minuteInterval={15}
            display="default"
            onPressCancel={() => setShowTimePicker(false)}
            onCloseModal={() => setShowTimePicker(false)}
            onChange={onTimeChange}
          />
        )}

         <View style={styles.container}>
         <View style={styles.titleContainer}>
           <Text style={styles.titleText}>{props.habit ? 'Edit this' : 'Create a'} habit</Text>
         </View>
         <View style={styles.nameContainer}>
           <Text>Name:</Text>
           <TextInput
            value={content} 
             placeholder={'I want to..'}
             onChangeText={setContent}
             style={styles.nameInputContainer}
            />
         </View>
         <View style={styles.frequencyContainer}>
           <Text>Frequency:</Text>
           {Platform.OS === 'ios' && (
              <RNPickerSelect 
                items={allFrequencyOptions}
                value={frequencyOption}
                style={styles}
                onValueChange={onOptionChange}
              />
            )}
            {Platform.OS !== 'ios' &&  (
              <DropDownPicker
                items={allFrequencyOptions}
                value={frequencyOption}
                defaultValue={frequencyOption}
                containerStyle={styles.linkAndroidContainer}
                onChangeItem={onOptionChange}
              />
            )}
           {Platform.OS === 'ios' && frequencyOption !== 0 && (
              <RNPickerSelect 
                items={frequencyOption === 1 ? weeklyFrequencyOptions : monthlyFrequencyOptions}
                value={chosenFrequency.number}
                style={styles}
                onValueChange={frequencyOption === 1 ? onOptionWeeklyChange : onOptionMonthlyChange}
              />
            )}
            {Platform.OS !== 'ios' && frequencyOption !== 0 && (
              <DropDownPicker
                items={frequencyOption === 1 ? weeklyFrequencyOptions : monthlyFrequencyOptions}
                value={chosenFrequency.number}
                defaultValue={chosenFrequency.number}
                containerStyle={styles.linkAndroidContainer}
                onChangeItem={frequencyOption === 1 ? onOptionWeeklyChange : onOptionMonthlyChange}
              />
            )}
         </View>
          <View style={styles.notificationContainer}>
            <Text>Notification:</Text>
            <CheckBox 
              boxType={'square'}
              style={styles.checkbox}
              value={isNotification}
              onValueChange={() => {
              setIsNotification(!isNotification)
            }}/>
            {isNotification && (<TouchableOpacity
              style={styles.startTimeContainer}
              onPress={() => {setShowTimePicker(true)}}
            >
              <Text>{startTime}</Text>
            </TouchableOpacity>)}

         </View>
          <View style={styles.maxStreakContainer}>
           <Text>Max streaks:</Text>
           <TextInput 
             value={maxStreak.toString()}
             style={styles.inputTextContainer}
             onChangeText={setMaxStreak}
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
