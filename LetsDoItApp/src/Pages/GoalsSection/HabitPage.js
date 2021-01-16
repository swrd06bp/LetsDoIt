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
  const [allRoutines, setAllRoutines] = useState([])
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
          <MenuOption onSelect={onDeleteHabit} >
            <Text>Delete habit</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [])

   const onDeleteHabit = async () => {
     await api.deleteHabit(habit._id)
     onGoBack()
     navigation.goBack()
   }

   const onUpdateHabit = async (newHabit) => {
     await api.updateHabit(habit._id, newHabit)
     setHabit({_id: habit._id, ...newHabit})
     setShowEditForm(false)
     onGoBack()
   }

  const getAllRoutines = async () => {
  	const resp = await api.getRoutinesHabit({habitId: habit._id})
  	const json = await resp.json()
  	setAllRoutines(json)
  }

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
    frequency = `${habit.frequency.number} times a week`
  else if (habit.frequency.type === 'month') 
    frequency = `${habit.frequency.number} times a month`

	const commitsData = allRoutines.filter((x) => x.isDone).map( x => ({
	  date: x.createdAt.slice(0, 10),
	  count: 1,
	}))

	const getDayCounts = (data) => {
	  let dayCounts = []
	  for (let dayNumber of [1, 2, 3, 4, 5, 6, 0]) {
	    const filteredData = data.filter( x => (x.isDone && new Date(x.createdAt).getDay() === dayNumber))
	    const dayCount = filteredData.length
	    dayCounts.push(dayCount)
	  }
	  return dayCounts
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
       	   const filteredData = commitsData.filter(x => x.date === scoreLabel)
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
       	    const filteredData = commitsData.filter(x => x.date === scoreLabel)
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
       	    const filteredData = commitsData.filter(x => moment(new Date(x.date)).format('W') === scoreLabel)
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
      labels: getScoreData(allRoutines).scoreLabels,
      datasets: [
        {
          data: getScoreData(allRoutines).scoreCounts
        }
      ]
    }
    console.log(dataScore)


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
      	       <Text style={styles.overviewValueText}>{Math.round(100 * dataScore.datasets[0].data[dataScore.datasets[0].data.length - 1] / maxStreaks)}%</Text>
      	       <Text style={styles.overviewText}>Progress</Text>
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
})

export default HabitPage