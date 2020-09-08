import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'
import { View, TextInput, Text, TouchableOpacity, StyleSheet  } from 'react-native'
import Api from '../../Api'

function FailureScreen (props) {
  const [note, setNote] = useState(null)
  const [postponeUntil, setPostponeUntil] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const api = new Api()

  const onFailure = async () => {
    await api.insertRoutine({habitId: props.item.id, note, postponeUntil, isDone: false}) 
    await props.onUpdate()
    props.onClose()
  }
  return (
      <Modal
        isVisible={props.showModal}
        onBackdropPress={() => props.onClose()}
        style={styles}
      >
      <View style={styles.failureWrapper}>
        <View>
          <Text>Note</Text>
          <TextInput 
            multiline={true}
            value={note ? note : ''} 
            onChangeText={(text) => setNote(text)} 
            style={styles.noteText}
          />
        
        </View>
        <View>
        <Text>Postpone until:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>{postponeUntil ? postponeUntil : 'tomorrow'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              is24Hour={true}
              mode={'date'}
              display="default"
              onChange={(date) => {
                setPostponeUntil(new Date(date))
                setShowDatePicker(false)
              }}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onClick={() => onFailure()}><Text>Done</Text></TouchableOpacity>
      </View>
    </Modal>
  )
}


function RoutineTask (props) {
  const [showModal, setShowModal] = useState(false)
  const [colorCode, setColorCode] = useState('white')
  const api = new Api()


  useEffect(() => {
    const getColorCode = async () => {
      const resp = await api.getGoal(props.item.goalId)
      console.log(resp, props.item)
      //const goal = await resp.json()
      ////setColorCode(goal.colorCode)
      //alert(goal.colorCode)
    }
    getColorCode()
  }, [])

  const onAcheive = async () => {
    await api.insertRoutine({
      habitId: props.item.id,
      note: null,
      postponeUntil: null,
      isDone: true
    }) 
    props.onUpdate()
  }


  return (
    <View
      style={styles.wrapper}
    >
      <FailureScreen 
        item={props.item}
        showModal={showModal}  
        onClose={() => setShowModal(false)}
        onUpdate={props.onUpdate}
      />
      <View style={styles.frontContainer}>
        <View style={[{backgroundColor: colorCode}, styles.goalShape]} />
        <Text style={styles.titleContainer}>{props.item.content}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onAcheive}>
          <Text style={styles.buttonText}>done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>not today</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 37,
    borderRadius: 40,
    marginHorizontal: 5,
  },
  goalShape: {
    width: 17,
    height: 17,
    marginLeft: 17,
  },
  titleContainer: {
    marginLeft: 5,
    fontSize: 14,
  },
  frontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    width: 75,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
  },
  failureWrapper: {
    height: 300,
    width: 200,
    
  },
})


export default RoutineTask

