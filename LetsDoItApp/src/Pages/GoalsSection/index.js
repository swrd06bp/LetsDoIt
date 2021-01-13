import React, { useState, useEffect, useLayoutEffect } from 'react'
import { 
  SafeAreaView,
  View,
  ScrollView, 
  Text, 
  Image,
  TouchableOpacity, 
  ActivityIndicator, 
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useNavigation } from '@react-navigation/native'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import Footer from '../../components/Footer'
import ProjectItem from './ProjectItem'
import GoalItem from './GoalItem'
import Api from '../../Api'





function GoalsSection (props) {
	  const [showCompletedProjects, setShowCompletedProjects] = useState(false)
    const [showCompletedGoals, setShowCompletedGoals] = useState(false)
    const [showCompletedHabits, setShowCompletedHabits] = useState(false)
    const [allProjects, setAllProjects] = useState([])
    const [allGoals, setAllGoals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigation = useNavigation()
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

   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => {
            setShowCompletedProjects(!showCompletedProjects)
          }} >
            <Text>{showCompletedProjects ? 'Show pending projects' : 'Show completed projects'}</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
            setShowCompletedGoals(!showCompletedGoals)
          }} >
            <Text>{showCompletedGoals ? 'Show pending goals' : 'Show completed goals'}</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
            setShowCompletedHabits(!showCompletedHabits)
          }} >
            <Text>{showCompletedHabits ? 'Show only remaining habits' : 'Show all habits'}</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [showCompletedGoals, showCompletedProjects, showCompletedHabits])

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
                        completedHabits={showCompletedHabits}
                      />
                ))}
              
              </View>      

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
  optionImage: {
    height: '25rem',
    width: '25rem',
    marginRight: '10rem',
  },
 })

export default GoalsSection