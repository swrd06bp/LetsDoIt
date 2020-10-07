import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'
import { 
  View, 
  TextInput, 
  Vibration,
  Text, 
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import ActionButton from '../ActionButton'
import Api from '../../Api'

function FailureScreen (props) {
  const [note, setNote] = useState(null)
  const [postponeUntil, setPostponeUntil] = useState(new Date(new Date().setDate(new Date().getDate() + 1)))  
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
      >
      <View style={styles.failureWrapper}>
        <View>
          <Text style={styles.failureTitleText}>Not today?</Text>
        
        </View>
        <View style={styles.failurePostponeContainer}>
        <Text>Postpone until:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.failureDate}>{postponeUntil.toJSON().slice(0, 10)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={postponeUntil}
              is24Hour={true}
              mode={'date'}
              display="default"
              onChange={(event, date) => {
                console.log(date)
                if (date)
                  setPostponeUntil(date)
                setShowDatePicker(false)
              }}
            />
          )}
        </View>
        <View>
          <Text style={styles.failureNoteTitle}>Note</Text>
          <TextInput 
            multiline={true}
            value={note ? note : ''} 
            onChangeText={(text) => setNote(text)} 
            style={styles.failureNoteText}
          />
        </View>
        <ActionButton onSubmit={onFailure} text={'Done'} />
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
      const goal = await resp.json()
      if (goal.length)
        setColorCode(goal[0].colorCode)
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
    Vibration.vibrate(100)
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
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Not today</Text>
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
    width: '60%',
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
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    height: 300,
    width: 250,
    backgroundColor: 'white',
  },
  failureTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: 10,
  },
  failureDate: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  failureNoteTitle: {
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  failureNoteText: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: 10,
    height: 100,
  },
  failurePostponeContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 15,
  },
})


export default RoutineTask

