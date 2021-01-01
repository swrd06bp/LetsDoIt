import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

function Footer (props) {
   
    const tasksImage = props.current === 'tasks' ? require('../../static/tasks_active.png')
    	: require('../../static/tasks.png')

    const goalsImage = props.current === 'goals' ? require('../../static/goal_active.png')
    	: require('../../static/goal.png')

    const happinessImage = props.current === 'hapinness' ? require('../../static/happiness_active.png')
    	: require('../../static/happiness.png')

	return (
	  <View style={styles.wrapper}>
	    <TouchableOpacity style={styles.navContainer} onPress={() => {}}>
	      <Image source={tasksImage} style={styles.image} />
	      <Text style={[props.current === 'tasks' && {color: 'blue'}]}>Tasks</Text>
	    </TouchableOpacity>
	    <TouchableOpacity style={styles.navContainer} onPress={() => {}}>
	      <Image source={goalsImage} style={styles.image} />
	      <Text style={[props.current === 'goals' && {color: 'blue'}]}>Goals</Text>
	    </TouchableOpacity>
	    <TouchableOpacity style={styles.navContainer} onPress={() => {}}>
	      <Image source={happinessImage} style={styles.image} />
	      <Text style={[props.current === 'happiness' && {color: 'blue'}]}>Happiness</Text>
	    </TouchableOpacity>
	  </View>
	)
}

const styles = EStyleSheet.create({
  wrapper: {
  	height: '100%',
  	flex: 1,
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent: 'space-around',
  },
  image: {
  	height: '30rem',
  	width: '30rem',
  },
  navContainer: {
  	flex: 1,
  	height: '100%',
  	borderWidth: 1,
  	borderColor: 'black',
  	alignItems:'center',
  	justifyContent: 'center',


  },
})


export default Footer