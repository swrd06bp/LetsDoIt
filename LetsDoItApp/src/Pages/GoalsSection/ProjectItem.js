import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useNavigation } from '@react-navigation/native'



function ProjectItem (props) {
  const navigation = useNavigation()
  

  if (!props.completed && props.item.doneAt) return null


  let date = 'Someday'
  if (props.item.doneAt)
    date = props.item.doneAt.slice(0, 10)
  else if (props.item.dueDate)
    date = props.item.dueDate.slice(0, 10)
	
  return (
    <View style={styles.backgroundWrapper}>
      <TouchableOpacity
        style={styles.itemWrapper}
        onPress={() => {navigation.navigate('ProjectPage', {
          type: props.type,
          item: props.item,
          onGoBack: props.onGoBack,
        })}}
        >
         <View style={styles.firstPartItem}>
       	   <View style={[
       	   	{backgroundColor: props.item.colorCode},
       	   	props.type === 'project' && styles.projectShape,
       	    props.type === 'goal' && styles.goalShape
       	  ]} />
           <Text style={styles.contentText}>{props.item.content}</Text>
        </View>

        <View style={styles.secondPartItem}>
           <View style={[styles.dueDateContainer, props.item.doneAt && {backgroundColor: 'lightgreen'}]}>
             <Text style={styles.dueDateText}>
               {date}
             </Text>
           </View>
           {props.item.doneAt && (
              <Image source={require('../../../static/check.png')} style={styles.imageIncon} />
           )}
        </View>
    </TouchableOpacity>
    </View>
	)
}


const styles = EStyleSheet.create({
  backgroundWrapper: {
    backgroundColor: '#E5E5E5',
  },
  titleText: {
    fontSize: '20rem',
    fontWeight: 'bold',
    marginBottom: '10rem',
    color: '#32A3BC',
  },
  titleContainer: {
  	height: '45rem',
  },
  elemsContainer: {
  	height: '100%',
  },
  activityContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
  	height: '60%',
    backgroundColor: '#E5E5E5'
  },
  completedContainer: {
  	height: '20%',
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  completedText: {
    fontSize: '12rem',
    textDecorationLine: 'underline',
  },
  itemWrapper: {
  	marginTop: '3rem',
  	height: '50rem',
    backgroundColor: 'white',
  	borderRadius: 20,
  	alignItems: 'center',
  	flexDirection: 'row',
  	
  },
  firstPartItem: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	width: '72%',
  },
  secondPartItem: {
  	alignItems: 'center',
  	width: '28%',
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  projectShape: {
  	marginHorizontal: '5rem',
  	height : '15rem',
  	width: '15rem',
  	borderRadius: 100,
  },
  goalShape: {
  	marginHorizontal: '5rem',
  	height : '15rem',
  	width: '15rem',
  },
  contentText: {
    fontSize: '14rem',
  },
  dueDateContainer: {
    backgroundColor: 'lightgrey',
    borderRadius: 40,
    padding: '1rem',
  },
  dueDateText: {
  	fontSize: '12rem',
  },
  imageIncon: {
    height: '25rem',
    width: '25rem',
  },
 })

export default ProjectItem