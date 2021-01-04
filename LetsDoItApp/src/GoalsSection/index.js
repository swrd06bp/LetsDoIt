import React, { useState, useEffect } from 'react'
import { 
  SafeAreaView,
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator, 
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import Footer from '../components/Footer'
import Api from '../Api'


function Item (props) {

    if (props.completed && !props.item.doneAt) return null

    if (!props.completed && props.item.doneAt) return null

	return (
       <View style={styles.itemWrapper}>
         <View style={styles.firstPartItem}>
       	   <View style={[
       	   	{backgroundColor: props.item.colorCode},
       	   	props.type === 'project' && styles.projectShape,
       	    props.type === 'goal' && styles.goalShape
       	  ]} />
           <Text style={styles.contentText}>{props.item.content}</Text>
        </View>

        <View style={styles.sectonPartItem}>
           <View style={styles.dueDateContainer}>
             <Text style={styles.dueDateText}>
               {props.completed ? (props.item.doneAt ? props.item.doneAt.slice(0, 10) : 'Someday')
               	 : (props.item.dueDate ? props.item.dueDate.slice(0, 10) : 'Someday')}
             </Text>
           </View>
        </View>
      </View>
	)
}


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
	    <View style={styles.goalsWrapper}>
           <View style={styles.goalsSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Goals</Text>
              </View>
              <View style={styles.elemsContainer}>
              <View style={styles.flatListContainer}>
                {isLoading && (
                   <View style={styles.activityContainer}>
                      <ActivityIndicator size='large' color='black' />
                   </View>
                )}
                {!isLoading && (
                  <FlatList
                    style={{flex: 1}}
                    data={allGoals}
                    renderItem={({item}) => (
                      <Item 
                        key={item._id} 
                        item={item}
                        completed={showCompletedGoals} 
                        type={'goal'}
                      />
                    )}
                    keyExtractor={item => item._id}
                  />
                )}
              </View>
              <TouchableOpacity 
              	onPress={() => setShowCompletedGoals(!showCompletedGoals)}

              	style={styles.completedContainer}
              >
                  <Text style={styles.completedText}>{showCompletedGoals ? 'Show pending' : 'Show completed'}</Text>
              </TouchableOpacity>
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
              	{!isLoading && (
                  <FlatList
                  	data={allProjects}
                  	renderItem={({item}) => (
                    		<Item 
                      	key={item._id} 
                      	item={item}
                      	completed={showCompletedProjects} 
                      	type={'project'}
                      	/>
                    	)}
                    	keyExtractor={item => item._id}
                  />
                )}
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

	    </View>
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
  goalsSection: {
  	height: '40%'
  },
  projectsSection: {
  	height: '60%'
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
  	height: '40rem',
  	borderWidth: 0.5,
  	borderRadius: 20,
  	alignItems: 'center',
  	flexDirection: 'row',
  	
  },
  firstPartItem: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	width: '72%',
  },
  sectonPartItem: {
  	alignItems: 'center',
  	width: '28%',
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
 })

export default GoalsSection