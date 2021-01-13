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
  }, [])

  const onAddHabit = async (habit) => {
    await api.insertHabit(habit) 
    await getHabits()
    setAddHabitGoalId(null)
  }

  const getHabits = async () => {
    const resp = await api.getHabitsGoal(props.item._id)
    const json = await resp.json()
    setAllHabits(json)
  }

  if (props.completed && !props.item.doneAt) return null

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
      <ProjectItem item={props.item} completed={props.completed} type={'goal'} /> 
      <View>
      <View style={[styles.habitWrapper, {borderColor: props.item.colorCode}]}>
        <View style={styles.footerHabitContainer}>        
        <TouchableOpacity 
          onPress={() => setAddHabitGoalId(props.item._id)}
          style={styles.addHabitContainer}
        >
          <Text style={styles.addHabitText}>Show completed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setAddHabitGoalId(props.item._id)}
          style={styles.addHabitContainer}
        >
          <Text style={styles.addHabitText}>+ Add a habit</Text>
        </TouchableOpacity>
        </View>

        {allHabits.map((habit) => (
          <HabitItem key={habit._id} item={habit} onGoBack={getHabits} />
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
  headerHabitsContainer: {
    flexDirection: 'row',
  },
  firstHeaderHabit: {
    width: '50%',
    marginLeft: '8rem',
  },
  habitWrapper: {
    marginLeft: '35rem',
    borderLeftWidth: '5rem',
  },
  addHabitContainer: {
    marginLeft: '55rem',
    marginVertical: '10rem',
  },
  addHabitText: {
    fontSize: '13rem',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  headerHabitText: {
    fontSize: '13rem',
  },
  footerHabitContainer: {
     flexDirection: 'row',
  },
 })

export default GoalItem