import React, { useState, useEffect } from 'react'
import { 
  SafeAreaView,
  View,
  ScrollView, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import Footer from '../../components/Footer'
import ProjectItem from './ProjectItem'
import GoalItem from './GoalItem'
import Api from '../../Api'





function GoalsSection (props) {
	const [showCompletedProjects, setShowCompletedProjects] = useState(false)
    const [showCompletedGoals, setShowCompletedGoals] = useState(false)
    const [allProjects, setAllProjects] = useState([])
    const [allGoals, setAllGoals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const api = new Api()

    useEffect(() => {
    	getData()
    }, [])

    const getData = async () => {
    	const respGoals = await api.getGoals()
    	const resultGoals = await respGoals.json()
   		const respProjects = await api.getProjects()
    	const resultProjects = await respProjects.json()
    	setAllGoals(resultGoals)
    	setAllProjects(resultProjects)
      setIsLoading(false)
  	}
   
   

	return (
	  <SafeAreaView style={styles.wrapper}>
	    <ScrollView style={styles.goalsWrapper}>
          <View style={styles.goalsSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Goals</Text>
              </View>
           
              <View style={styles.flatListContainer}>
                {isLoading && (
                   <View style={styles.activityContainer}>
                      <ActivityIndicator size='large' color='black' />
                   </View>
                )}
                {!isLoading && allGoals.map((item) => (
                      <GoalItem 
                        key={item._id} 
                        item={item}
                        completed={showCompletedGoals} 
                        type={'goal'}
                      />
                ))}
              
              </View>
              <TouchableOpacity 
              	onPress={() => setShowCompletedGoals(!showCompletedGoals)}

              	style={styles.completedContainer}
              >
                  <Text style={styles.completedText}>{showCompletedGoals ? 'Show pending' : 'Show completed'}</Text>
              </TouchableOpacity>
                           

           </View>
           <View style={styles.projectsSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Projects</Text>
              </View>
              <View style={styles.elemsContainer}>
              <View style={styles.flatListContainer}>
                {isLoading && (
                   <View style={styles.activityContainer}>
                      <ActivityIndicator size='large' color='black' />
                   </View>
                )}
              	{!isLoading && allProjects.map((item) => (
                	<ProjectItem 
                  	key={item._id} 
                  	item={item}
                  	completed={showCompletedProjects} 
                  	type={'project'}
                  	/>
                  ))}
                </View>
                <TouchableOpacity 
                  style={styles.completedContainer}
                  onPress={() => {
                    const newCompleted = !showCompletedProjects
                    setShowCompletedProjects(newCompleted)
                  }}
                >
                  <Text style={styles.completedText}>{showCompletedProjects ? 'Show pending' : 'Show completed'}</Text>
                </TouchableOpacity>
              </View>
      
           </View>

	    </ScrollView>
		<View style={styles.navigation}>
			<Footer current={'goals'} navigation={props.navigation}/>
		</View>
	  </SafeAreaView>
	)
}

const styles = EStyleSheet.create({
  wrapper: {
    height: '100%'
  },
  goalsWrapper: {
    height: '92%'
  },
  navigation:{
    height: '8%',
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
  activityContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
  	height: '50rem',
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  completedText: {
    fontSize: '12rem',
    textDecorationLine: 'underline',
  },
 })

export default GoalsSection