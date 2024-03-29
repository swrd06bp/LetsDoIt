import React, { useState, useEffect, useLayoutEffect } from 'react'
import { 
  SafeAreaView,
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useRoute, useNavigation } from '@react-navigation/native'
import {
  LineChart,
  BarChart,
  ContributionGraph,
} from "react-native-chart-kit"
import moment from 'moment'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import EditHabitForm from './EditHabitForm'
import Api from '../../Api'


function HabitPage (props) {
  const route = useRoute()
  const [habitScore, setHabitScore] = useState(0)
  const [allRoutines, setAllRoutines] = useState([])
  const [commitsData, setCommitsData] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [habit, setHabit] = useState(route.params.habit)
  const onGoBack = route.params.onGoBack
  const api = new Api()
  const navigation = useNavigation()
  const screenSize = Dimensions.get("window").width
  

  useEffect(() => {
  	getAllRoutines()
  }, [])


   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerNavigation}>
        <TouchableOpacity style={styles.headerTouch} onPress={() => setShowEditForm(true)}>
          <Image source={require('../../../static/edit.png')} style={styles.optionImage} />
        </TouchableOpacity>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={onCompleteHabit} >
            <Text>{habit.doneAt ? 'Start working about on the idea' : (!habit.isDone && habitScore === 100 ? 'Mark the habit as done' : 'Give up on the habit')}</Text>
          </MenuOption>
          <MenuOption onSelect={onDeleteHabit} >
            <Text>Delete habit</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [habit.isDone, habitScore])



  let maxStreaks
  if (habit.maxStreaks)
  	maxStreaks = habit.maxStreaks
  else if (habit.frequency.type === 'day')
  	maxStreaks = 66
  else if (habit.frequency.type === 'week')
  	maxStreaks = 24
  else if (habit.frequency.type === 'month')
  	maxStreaks = 12

  let frequency
  if (habit.frequency.type === 'day') 
    frequency = 'Every day'
  else if (habit.frequency.type === 'week')
    if (habit.frequency.number === 1)
       frequency = `Once a week`
    else if (habit.frequency.number === 2)
       frequency = `Twice a week`
    else
      frequency = `${habit.frequency.number} times a week`
  else if (habit.frequency.type === 'month') 
    if (habit.frequency.number === 1)
       frequency = `Once a month`
    else if (habit.frequency.number === 2)
       frequency = `Twice a month`
    else
      frequency = `${habit.frequency.number} times a month`




  const getAllRoutines = async () => {
    const resp = await api.getRoutinesHabit({habitId: habit._id})
    const json = await resp.json()
    const newCommitsData = json.filter((x) => x.isDone).map( x => ({
      date: x.createdAt.slice(0, 10),
      count: 1,
    }))
    setAllRoutines(json)
    setCommitsData(newCommitsData)
    setHabitScore(getHabitScore(newCommitsData))
  }

  const getHabitScore = (routines) => {
    const newScoreCounts = getScoreData(routines).scoreCounts
    let newHabitScore = 0
    if (newScoreCounts.length > 0)
      newHabitScore = Math.round(100 * newScoreCounts[newScoreCounts.length - 1] / maxStreaks)
    return newHabitScore
  }

	const getDayCounts = (data) => {
	  let dayCounts = []
	  for (let dayNumber of [1, 2, 3, 4, 5, 6, 0]) {
	    const filteredData = data.filter( x => (x.isDone && new Date(x.createdAt).getDay() === dayNumber))
	    const dayCount = filteredData.length
	    dayCounts.push(dayCount)
	  }
	  return dayCounts
	}

   const onDeleteHabit = async () => {
     await api.deleteHabit(habit._id)
     onGoBack()
     navigation.goBack()
   }

   const onCompleteHabit = async () => {
    if (habit.doneAt) {
      let newHabit = habit
      newHabit['acheived'] = null
      newHabit['doneAt'] = null
      await api.updateHabit(habit._id, {acheived: null, doneAt: null})
      setHabit(newHabit)
    }
    else if (!habit.doneAt) {
      const acheived = habitScore === 100
      const doneAt = new Date().toJSON()
      let newHabit = habit
      newHabit['acheived'] = acheived
      newHabit['doneAt'] = doneAt
      await api.updateHabit(habit._id, {acheived, doneAt})
      setHabit(newHabit)
    }
    onGoBack()
    navigation.goBack()
   }

   const onUpdateHabit = async (newHabit) => {
     await api.updateHabit(habit._id, newHabit)
     setHabit({_id: habit._id, ...newHabit})
     setShowEditForm(false)
     onGoBack()
   }

  const getHoursCounts = (data) => {
	  let hourCounts = []
	  let hourLabels = []
	  for (let hour = 0; hour < 24; hour++) {
	    const filteredData = data.filter( x => (x.isDone && new Date(x.createdAt).getHours() === hour))
	    const hourCount = filteredData.length
	    if (hourCount) {
	      hourCounts.push(hourCount)
	      hourLabels.push(hour)
	    }
	  }
	  return {hourCounts, hourLabels}
	}

	const getScoreData = (data) => {
	   let scoreLabels = []
	   let scoreCounts = []
	   let score = 0
	   let penalty = 0
	   let cumulativeStreak = 0
       if (habit.frequency.type === 'day') {
       	 for (let i = maxStreaks; i >= 0; i --) {
       	   let date = new Date()
       	   date.setDate(date.getDate() - i)
       	   const scoreLabel = date.toJSON().slice(0, 10)
       	   const filteredData = data.filter(x => x.date === scoreLabel)
       
           if (filteredData.length >= habit.frequency.number) {
             score += 1
             cumulativeStreak += 1
          }
       	   else {
       	   	 if (score <= 0)
       	   	 	score = 0
       	   	 else if (penalty > 10) {
       	   	 	score = 0
       	   	    penalty = 0
       	   	 }
       	   	 else if (cumulativeStreak > 5)
       	   		 penalty += 1
       	   	  else {
       	   	 	 score -= 1
       	   	 	 penalty += 1
       	   	  }
       	   	 cumulativeStreak = 0
       	   }
           if (score > 100)
             score = 100
       	   if (i % 6 == 0) {
       	     scoreCounts.push(score)
       	     scoreLabels.push(moment(date).format('DD MMM'))
       	   }
       	  }
       }
       else if (habit.frequency.type === 'week') {
       	 for (let i = maxStreaks; i >= 0; i --) {
       	  	let date = new Date()
       	    date.setDate(date.getDate() - 7 * i)
       	    const scoreLabel = moment(date).format('W')
       	    const filteredData = data.filter(x => x.date === scoreLabel)
       	   if (filteredData.length >= habit.frequency.number) {
             score += 1
             cumulativeStreak += 1
          }
       	   else {
       	   	 if (score <= 0)
       	   	 	score = 0
       	   	 else if (penalty > 10) {
       	   	 	score = 0
       	   	    penalty = 0
       	   	 }
       	   	 else if (cumulativeStreak > 1)
       	   		 penalty += 1
       	   	 else {
       	   	 	 score -= 1
       	   	 	 penalty += 1
       	   	 }
       	   	 cumulativeStreak = 0
       	   }
           if (score > 100)
             score = 100
       	   if (i % 2 === 0) {
       	      scoreCounts.push(score)
       	      scoreLabels.push(moment(date).format('DD MMM'))
       	    }

          }
       }
       else if (habit.frequency.type === 'month') {
       	 for (let i = maxStreaks; i >= 0; i --) {
       	  	let date = new Date()
       	    date.setMonth(date.getMonth() - i)
       	    const scoreLabel = date.toJSON().slice(0, 10)
       	    const filteredData = data.filter(x => moment(new Date(x.date)).format('W') === scoreLabel)
       	   if (filteredData.length >= habit.frequency.number) {
             score += 1
             cumulativeStreak += 1
          }
       	   else {
       	   	 if (score <= 0)
       	   	 	score = 0
       	   	 else if (penalty > 10) {
       	   	 	score = 0
       	   	    penalty = 0
       	   	 }
       	   	 else if (cumulativeStreak > 0)
       	   		 penalty += 1
       	   	  else {
       	   	 	 score -= 1
       	   	 	 penalty += 1
       	   	  }
       	   	 cumulativeStreak = 0
       	   }
       	   if (score > 100)
             score = 100
       	    scoreCounts.push(score)
       	    scoreLabels.push(moment(date).format('DD MMM'))
       	   
          }
       }
       return { scoreLabels, scoreCounts }
	}



	const dataDayFrequency = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: getDayCounts(allRoutines)
        }
      ]
    }

 	const dataHourFrequency = {
      labels: getHoursCounts(allRoutines).hourLabels,
      datasets: [
        {
          data: getHoursCounts(allRoutines).hourCounts
        }
      ]
    }

    const dataScore = {
      labels: getScoreData(commitsData).scoreLabels,
      datasets: [
        {
          data: getScoreData(commitsData).scoreCounts
        }
      ]
    }

    
  


  const chartConfig = {
	backgroundGradientFrom: "lightgrey",
	backgroundGradientFromOpacity: 0,
	backgroundGradientTo: "white",
	backgroundGradientToOpacity: 0.5,
	color: (opacity) => {
	  if (opacity)
	    return `black`
      else 
		return `lightgrey`
	},
	strokeWidth: 2, // optional, default 3
	barPercentage: 0.5,
	useShadowColorFromDataset: false // optional
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      {showEditForm && (
        <EditHabitForm 
          goalId={habit.goalId} 
          habit={habit} 
          onClose={() => setShowEditForm(false)}
          onAddHabit={onUpdateHabit} 
        />
      )}
      <ScrollView>
        <View style={styles.headerWrapper}>
      	  <Text style={styles.titleText}>{habit.content}</Text>
      	  <View style={styles.subTitleWrapper}>
      	    <View style={styles.subTitleContainer}>
      	      <Text style={styles.subTitleValueText}>{frequency}</Text>
      	      <Text style={styles.subTitleText}>Frequency</Text>
      	    </View>
      	    <View style={styles.subTitleContainer}>
              <Text style={styles.subTitleValueText}>{habit.isNotification ? habit.startTime : 'Off'}</Text>
      	      <Text style={styles.subTitleText}>Notification</Text>
            </View>
          </View>      	
      	</View>
      	<View>
      	  <Text style={styles.titleSectionText}>Overview</Text>
      	  <View style={styles.overviewWrapper}>
      	    <View style={styles.overviewContainer}>
      	       {!route.params.goal.doneAt && habit.acheived === null && (<Text style={styles.overviewValueText}>{habitScore}%</Text>)}
               {route.params.goal.doneAt && habit.acheived === null && (<Image source={require('../../../static/check.png')} style={styles.imageIcon} />)}
               {route.params.goal.doneAt && habit.acheived === true && (<Image source={require('../../../static/check.png')} style={styles.imageIcon} />)}
               {habit.acheived === false && (<Image source={require('../../../static/uncheck.png')} style={styles.imageIcon} />)}
               {!route.params.goal.doneAt && habit.acheived === null && (<Text style={styles.overviewText}>Progress</Text>)}
      	       {route.params.goal.doneAt && habit.acheived === null && (<Text style={styles.overviewText}>Status</Text>)}
               {route.params.goal.doneAt && habit.acheived === true && (<Text style={styles.overviewText}>Status</Text>)}
               {habit.acheived === false && (<Text style={styles.overviewText}>Status</Text>)}
      	     </View>
      	     <View style={styles.overviewContainer}>
      	       <Text style={styles.overviewValueText}>{commitsData.length}</Text>
      	       <Text style={styles.overviewText}>Total</Text>
      	     </View>
      	  </View>
      	</View>
      	{allRoutines.length > 0 && (
      	<View>
      	  <Text style={styles.titleSectionText}>Score</Text>
      	  <LineChart
			  data={dataScore}
			  width={screenSize}
			  height={256}
			  withInnerLines={false}
			  verticalLabelRotation={30}
			  chartConfig={chartConfig}
			 
			/>
      	  <Text style={styles.titleSectionText}>Calendar</Text>
	      <ContributionGraph
	  		values={commitsData}
	        endDate={allRoutines[0].createdAt}
	        numDays={105}
	        width={screenSize}
	        height={220}
	        chartConfig={chartConfig}
	      />
	      <Text style={styles.titleSectionText}>Day frequency</Text>
	      <BarChart
	        fromZero={true}
		    data={dataDayFrequency}
		    width={screenSize}
		    height={220}
		    chartConfig={chartConfig}
		    withInnerLines={false}
		    showValuesOnTopOfBars={true}
		
		  />
		  <Text style={styles.titleSectionText}>Time frequency</Text>
	      <BarChart
	        fromZero={true}
		    data={dataHourFrequency}
		    width={screenSize}
		    height={220}
		    chartConfig={chartConfig}
		    withInnerLines={false}
		    showValuesOnTopOfBars={true}
	
		  />
		</View>


        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = EStyleSheet.create({
	headerNavigation: {
    flexDirection: 'row',
  },
  headerTouch: {
    marginRight: '10rem',
  },
  wrapper: {
	  backgroundColor: 'white',
	  height: '100%',
	},
	headerWrapper: {
      backgroundColor: 'lightgrey',
      marginBottom: '10rem',
	},
	titleText: {
	  fontWeight: 'bold',
	  fontSize: '25rem',
	  marginBottom: '15rem',
	  alignSelf: 'center',
	},
	titleSectionText: {
      fontSize: '18rem',
      fontWeight: 'bold',
      marginBottom: '10rem',
      color: '#32A3BC',
      marginTop: '20rem',
      marginLeft: '15rem',
	},
	subTitleWrapper: {
	  flexDirection: 'row',
	  justifyContent: 'space-around',
	  alignItems: 'center',
    marginBottom: '10rem',
	},
	subTitleContainer: {
	  justifyContent: 'center',
	  alignItems: 'center'
	},
	subTitleValueText: {
	  fontWeight: 'bold',
	  color: 'green',
	  fontSize: '18rem',
	},
	subTitleText: {
	  fontSize: '13rem'
	},
	overviewWrapper: {
	  flexDirection: 'row',
	  justifyContent: 'space-around',
	  alignItems: 'center',
	},
	overviewContainer: {
	  justifyContent: 'center',
	  alignItems: 'center'	  
	},
	overviewValueText: {
	  fontWeight: 'bold',
	  color: 'green',
	  fontSize: '20rem',	
	},
	overviewText: {
	  fontSize: '12rem'
	},
  optionImage: {
    height: '25rem',
    width: '25rem',
    marginRight: '10rem',
  },
  imageIcon: {
    height: '25rem',
    width: '25rem',
  },
})

export default HabitPage
