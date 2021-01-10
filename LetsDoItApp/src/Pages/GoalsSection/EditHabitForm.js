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
  const [maxStreak, setMaxStreak] = useState(66)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [frequencyOption, setFrequencyOption] = useState(0)
  const [chosenFrequency, setChosenFrequency] = useState({type: 'day', number:1})
  const [startTime, setStartTime] = useState('00:00')
  const [isNotification, setIsNotification] = useState(false)


  const allFrequencyOptions = [
    {label: 'every day', value: 0},
    {label: 'every week', value: 1},
    {label: 'every month', value: 2},
  ]


  const weeklyFrequencyOptions = [...Array(7).keys()].slice(1).map(x => {
    const s = ' time per week'
    const ss= ' times per week'
    if (x === 1) return {label: x + s, value: x}
    else return {label: x + ss, value: x}
  })  

  const monthlyFrequencyOptions = [...Array(27).keys()].slice(1).map(x => {
    const s = ' time per month'
    const ss= ' times per month'
    if (x === 1) return {label: x + s, value: x}
    else return {label: x + ss, value: x}
  })

  const onOptionChange = (value) => {
    setFrequencyOption(value)
    if (value === 0) setChosenFrequency({type: 'day', number: 1})
    if (value === 1) setChosenFrequency({type: 'week', number: 1})
    if (value === 2) setChosenFrequency({type: 'month', number: 1})
  }

  const onOptionWeeklyChange = ({value}) => {
    setChosenFrequency({type: 'week', number: value})
  }

  const onOptionMonthlyChange = ({value}) => {
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
           <Text style={styles.titleText}>Create a habit</Text>
         </View>
         <View style={styles.nameContainer}>
           <Text>Name:</Text>
           <TextInput 
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
                onValueChange={onOptionChange}
              />
            )}
            {Platform.OS !== 'ios' &&  (
              <DropDownPicker
                items={allFrequencyOptions}
                value={frequencyOption}
                containerStyle={styles.linkAndroidContainer}
                onChangeItem={onOptionChange}
              />
            )}
           {Platform.OS === 'ios' && frequencyOption !== 0 && (
              <RNPickerSelect 
                items={frequencyOption === 1 ? weeklyFrequencyOptions : monthlyFrequencyOptions}
                value={chosenFrequency.number}
                onValueChange={frequencyOption === 1 ? onOptionWeeklyChange : onOptionMonthlyChange}
              />
            )}
            {Platform.OS !== 'ios' && frequencyOption !== 0 && (
              <DropDownPicker
                items={frequencyOption === 1 ? weeklyFrequencyOptions : monthlyFrequencyOptions}
                value={chosenFrequency.number}
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
    marginLeft: '17rem',
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
  },
  notificationContainer: {
    flexDirection: 'row',
    height: '40rem',
    alignItems: 'center',
  },
  startTimeContainer: {
    borderWidth: 0.5,
    borderColor: 'grey',

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
    borderColor: 'grey',
    borderWidth: 0.5,
    height: '40rem',
    width: '40rem',
  }, 
  linkAndroidContainer: {
    marginLeft: '5rem',
    height: '40rem',
    width: '120rem',
  }, 
 })

export default EditHabitForm