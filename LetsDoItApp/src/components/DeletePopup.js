import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'
import EStyleSheet from 'react-native-extended-stylesheet'


function DeletePopup (props) {
	
  return (
    <Modal
      style={styles.wrapper}
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.onClose}
    >
     <View>
       <View>
       <Text style={styles.titleText}>Are you sure you want to delete this?</Text>
       </View>
       <View style={styles.buttonWrapper}>
         <TouchableOpacity style={styles.discardButton} onPress={props.onClose}>
           <Text style={styles.buttonText}>Discard</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.deleteButton} onPress={props.onDelete}>
           <Text style={styles.buttonText}>Delete</Text>
         </TouchableOpacity>
       </View>
     </View>
    </Modal>
  )
}


const styles = EStyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
    width: '70%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  titleText: {
  	fontSize: '28rem',
  	textAlign: 'center',
  	marginVertical: '20rem'
  },
  buttonWrapper: {
  	marginVertical: '25rem',
  	flexDirection: 'row',
  	justifyContent: 'space-around',
  },
  discardButton: {
  	backgroundColor: 'lightblue',
  	borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    margin: '5rem',
    fontSize: '18rem',
  },
  deleteButton: {
  	backgroundColor: 'red',
  	borderRadius: 20,
  },

 })

 export default DeletePopup