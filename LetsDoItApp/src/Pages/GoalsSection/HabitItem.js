import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
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
          onGoBack: props.onGoBack,
        })}}
        style={styles.habitWrapper}
      >
        <View style={styles.habitFirstPart}>
          <Text style={styles.habitContentText}>{props.item.content}</Text>
        </View>
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
   },
   habitFirstPart: {
     width: '50%',
   },
   habitContentText: {
   	 marginLeft: '10rem',
   },
 })

export default HabitItem