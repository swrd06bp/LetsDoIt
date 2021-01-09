import React, { useState, useEffect } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import Modal from 'react-native-modal'
import { 
  View, 
  TextInput, 
  Vibration,
  Text, 
  TouchableOpacity,
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

const styles = EStyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: '37rem',
    borderRadius: '40rem',
    marginHorizontal: '5rem',
    justifyContent: 'space-between'
  },
  goalShape: {
    width: '17rem',
    height: '17rem',
    marginLeft: '17rem',
  },
  titleContainer: {
    marginLeft: '5rem',
    fontSize: '13rem',
  },
  frontContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
  },
  buttonText: {
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: '12rem',
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '5rem',
    padding: '2rem',
    backgroundColor: '#009933',
    borderRadius: '20rem',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  failureWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10,
    width: '250rem',
    backgroundColor: 'white',
  },
  failureTitleText: {
    fontSize: '18rem',
    fontWeight: 'bold',
    color: '#32A3BC',
    margin: '10rem',
  },
  failureDate: {
    marginHorizontal: '5rem',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  failureNoteTitle: {
    fontWeight: 'bold',
    marginHorizontal: '10rem',
  },
  failureNoteText: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: '10rem',
    height: '100rem',
  },
  failurePostponeContainer: {
    flexDirection: 'row',
    marginHorizontal: '10rem',
    marginVertical: '15rem',
  },
})


export default RoutineTask

