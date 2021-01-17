import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useNavigation } from '@react-navigation/native'

import Api from '../../Api'


function HabitItem (props) {
  const navigation = useNavigation()

  return (
     <TouchableOpacity
        onPress={() => {navigation.navigate('HabitPage', {
          habit: props.item,
          goal: props.goal,
          onGoBack: props.onGoBack,
        })}}
        style={styles.habitWrapper}
      >
        <Text style={styles.habitContentText}>{props.item.content}</Text>
        {(props.item.acheived) && (<Image source={require('../../../static/check.png')} style={styles.imageIcons}/>)}
        {props.goal.doneAt && props.item.acheived === null && (<Image source={require('../../../static/check.png')} style={styles.imageIcons}/>)}
        {props.item.acheived === false && (<Image source={require('../../../static/uncheck.png')} style={styles.imageIcons}/>)}
     </TouchableOpacity>
  )
}


const styles = EStyleSheet.create({
   habitWrapper: {
   	backgroundColor: 'white',
   	flexDirection: 'row',
   	borderRadius: 10,
   	marginVertical: '2rem',
   	height: '40rem',
    alignItems: 'center',
    backgroundColor: '#d8d0d2',
    justifyContent: 'space-between',
   },

   habitContentText: {
   	 marginLeft: '10rem',
   },
   imageIcons: {
     marginRight: '10rem',
     height: '20rem',
     width: '20rem',
   },
 })

export default HabitItem