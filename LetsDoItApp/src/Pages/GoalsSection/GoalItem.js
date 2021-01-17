import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import EditHabitForm from './EditHabitForm'
import ProjectItem from './ProjectItem'
import HabitItem from './HabitItem'
import Api from '../../Api'




function GoalItem (props) {
  const [allHabits, setAllHabits] = useState([])
  const [addHabitGoalId, setAddHabitGoalId] = useState(null) 
  const api = new Api()

  useEffect(() => {
    getHabits()
  }, [props.completedHabits])

  const onAddHabit = async (habit) => {
    await api.insertHabit(habit) 
    await getHabits()
    setAddHabitGoalId(null)
  }


  const getHabits = async () => {
    const resp = await api.getHabitsGoal(props.item._id, props.completedHabits)
    const json = await resp.json()
    setAllHabits(json)
  }

  if (!props.completed && props.item.doneAt) return null

	return (
    <View style={styles.itemWrapper}>
      {addHabitGoalId && (
        <EditHabitForm 
          onAddHabit={onAddHabit}
          goalId={addHabitGoalId}
          onClose={() => setAddHabitGoalId(null)} 
        />
        )}
      <ProjectItem
        item={props.item}
        completed={props.completed}
        type={'goal'}
        onGoBack={props.onGoBack}
       /> 
      <View style={styles.itemsContainer}>
        <TouchableOpacity 
          onPress={() => setAddHabitGoalId(props.item._id)}
          style={styles.addHabitContainer}
        >
          <Text style={styles.addHabitText}>+</Text>
        </TouchableOpacity>
        <View style={[styles.habitWrapper, {borderColor: props.item.colorCode}]}>
        
          {allHabits.map((habit) => (
            <HabitItem key={habit._id} item={habit} onGoBack={getHabits} goal={props.item} />
          ))}
       
      </View>
    </View>
  </View>
	)
}

const styles = EStyleSheet.create({
  itemWrapper: {
    marginBottom: '20rem',
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
  itemsContainer: {
    flexDirection: 'row'
  },
  habitWrapper: {
    marginLeft: '10rem',
    borderLeftWidth: '5rem',
    flex: 1,
    marginRight: '20rem',

  },
  addHabitContainer: {
    backgroundColor: '#32A3BC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '30rem',
    height: '30rem',
    marginHorizontal: '10rem',
    marginVertical: '3rem',
    alignSelf: 'flex-end',
  },
  addHabitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18rem'
  },
  headerHabitText: {
    fontSize: '13rem',
  },
  footerHabitContainer: {
     flexDirection: 'row',
  },
 })

export default GoalItem