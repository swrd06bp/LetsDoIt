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
import ListButton from '../../components/ListButton'
import Api from '../../Api'

function EditHabitForm(props) {
  const nextYear = new Date()
  nextYear.setDate(new Date().getDate() + 365)
	const [content, setContent] = useState(props.item ? props.item.content : '')
  const [list, setList] = useState(props.item ? props.item.list : 'Work')
  const [dueDate, setDueDate] = useState(props.item ? props.item.dueDate : nextYear)
  const [showDatePicker, setShowDatePicker] = useState(false)


  


	return (
       <Modal
         style={styles.wrapper}
         isVisible={props.isVisible}
         hasBackdrop={true}
         onBackdropPress={props.onClose}
       >
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(dueDate)}
            mode={'date'}
            display="default"
            onPressCancel={() => setShowDatePicker(false)}
            onCloseModal={() => setShowDatePicker(false)}
            onChange={(event, value) => {
              if (value)
                setDueDate(new Date(value).toJSON())
            }}
          />
        )}

         <View style={styles.container}>
         <View style={styles.titleContainer}>
           <Text style={styles.titleText}>{props.item ? 'Edit this' : 'Create a'} {props.type}</Text>
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
         <View style={styles.infoContainer}>
           
            <View style={styles.dueContainer}>
              <Text>Due</Text>
              <TouchableOpacity
                onPress={() => {setShowDatePicker('dueDate')}}
                style={styles.dueDate}
              >
              <Text>{new Date(dueDate).toJSON().slice(0, 10)}</Text> 
            </TouchableOpacity>
            </View>

           <View>
             <ListButton list={list} onListChange={() => {
              const newList = list === 'Personal' ? 'Work' : 'Personal'
              setList(newList)
            }} />
          </View>
         </View>
         <ActionButton text={'Save'} onSubmit={() => {
          if (content) {
            const newItem = { 
              content, 
              list,
              dueDate,
            }
            props.onAddItem(props.type, newItem)
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
  infoContainer: {
    marginVertical: '15rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueContainer: {
    marginHorizontal: '5rem',
    height: '40rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    marginHorizontal: '5rem',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },

 })

export default EditHabitForm