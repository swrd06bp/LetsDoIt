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
import CheckBox from '@react-native-community/checkbox'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import EditProjectForm from './EditProjectForm'
import Footer from '../../components/Footer'
import ProjectItem from './ProjectItem'
import GoalItem from './GoalItem'
import Api from '../../Api'





function GoalsSection (props) {
	  const [showCompletedProjects, setShowCompletedProjects] = useState(false)
    const [showCompletedGoals, setShowCompletedGoals] = useState(false)
    const [showCompletedHabits, setShowCompletedHabits] = useState(false)
    const [showNewProjectForm, setShowNewProjectForm] = useState(null)
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

    const onAddProject = async (type, newItem) => {
       if (type === 'goal')
        await api.insertGoal(newItem)
       else if (type === 'project')
        await api.insertProject(newItem)
      setShowNewProjectForm(null)
      getData()
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
            <View style={styles.headerOptionContainer}>
            <CheckBox 
              boxType={'square'}
              style={styles.checkbox}
              value={showCompletedProjects}
              onValueChange={() => {}}
              />
            <Text>Show completed projects</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => {
            setShowCompletedGoals(!showCompletedGoals)
          }} >
            <View style={styles.headerOptionContainer}>
              <CheckBox 
                boxType={'square'}
                style={styles.checkbox}
                value={showCompletedGoals}
                onValueChange={() => {}}
                />
              <Text>Show completed goals</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => {
            setShowCompletedHabits(!showCompletedHabits)
          }} >
            <View style={styles.headerOptionContainer}>
              <CheckBox 
                boxType={'square'}
                style={styles.checkbox}
                value={showCompletedHabits}
                onValueChange={() => {}}
                />
              <Text>Show completed habits</Text>
            </View>
            
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [showCompletedGoals, showCompletedProjects, showCompletedHabits])

	return (
	  <SafeAreaView style={styles.wrapper}>
      {showNewProjectForm && (
         <EditProjectForm
           isVisible={showNewProjectForm ? true : false}
           onClose={() => setShowNewProjectForm(null)}
           type={showNewProjectForm}
           onAddItem={onAddProject}
        />
      )}
	    <ScrollView style={styles.goalsWrapper}>
          <View style={styles.goalsSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Goals</Text>
                <TouchableOpacity 
                  style={styles.addButtonContainer} 
                  onPress={() => setShowNewProjectForm('goal')}
                  >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
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
                        onGoBack={getData}
                        type={'goal'}
                        completedHabits={showCompletedHabits}
                      />
                ))}
              
              </View>      

           </View>
           <View style={styles.projectsSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Projects</Text>
                <TouchableOpacity 
                  style={styles.addButtonContainer}
                  onPress={() => setShowNewProjectForm('project')}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
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
                    onGoBack={getData}
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
  addButtonContainer: {
    backgroundColor: '#32A3BC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '30rem',
    height: '30rem',
    marginHorizontal: '10rem',
    marginVertical: '3rem',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '24rem'
  }, 
  titleText: {
    fontSize: '24rem',
    fontWeight: 'bold',
    marginBottom: '10rem',
    color: '#32A3BC',
  },
  titleContainer: {
  	height: '45rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  headerOptionContainer: {
    flexDirection: 'row'
  },
  checkbox: { 
    height: '18rem', 
    width: '18rem',
    marginRight: '10rem', 
  },
 })

export default GoalsSection