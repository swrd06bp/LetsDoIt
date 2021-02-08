import React, { useState, useEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Line } from '@reactchartjs/react-chart.js'
import moment from 'moment'

import HabitsTab from './HabitsTab'
import EditHabitForm from '../../components/Goal/EditHabitForm'
import CharacteristicsTab from './CharacteristicTab'
import DeleteButton from '../../components/DeleteButton'
import Api from '../../app/Api'
import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import { sortProjectTasks} from '../../app/utils'


function HabitDescription (props) {
  const [habitScore, setHabitScore] = useState(0)
  const [allRoutines, setAllRoutines] = useState([])
  const [commitsData, setCommitsData] = useState([])
  const [habit, setHabit] = useState(props.describeElem.habit)
  const [showEditForm, setShowEditForm] = useState(false)
  const api = new Api()

  

  useEffect(() => {
    getHabitRoutines()
  }, [])

  let startCalendarDay = new Date()
  startCalendarDay.setDate(new Date().getDate() - 150)
  
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


  const getHabitRoutines = async () => {
    const resp = await api.getRoutinesHabit({habitId: props.describeElem.habit._id}) 
    const json = await resp.json()
    const newCommitsData = json.filter((x) => x.isDone).map( x => ({
      date: x.createdAt.slice(0, 10),
      count: 1,
    }))
    const scoreCounts = getScoreData(newCommitsData).scoreCounts
    setAllRoutines(json)
    setCommitsData(newCommitsData)
    setHabitScore(scoreCounts[scoreCounts.length - 1])
  }

  const onSave = async ({content, dueDate, note, list, doneAt}) => {
    await api.updateGoal(
      props.goal._id,
      {content, dueDate, note, goalId: props.goalId, list, doneAt}
    )
    props.onDescribe({task: null, project: null, goal: null, habit: null})
  }

  const onDelete = async () => {
    await api.deleteHabit(habit._id)
    props.onDescribe({task: null, project: null, goal: null, habit: null})
  }

  const onUpdateHabit = async (newHabit) => {
    await api.updateHabit(habit._id, newHabit)
    setHabit({_id: habit._id, ...newHabit})
    setShowEditForm(false)
  }
  

  const deriveScore = (score) => {
    return Math.min(100, Math.floor(100 * score / maxStreaks))
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
       	   if (i % 6 == 0) {
       	     scoreCounts.push(deriveScore(score))
       	     scoreLabels.push(moment(date).format('DD MMM'))
       	   }
       	  }
       }
       else if (habit.frequency.type === 'week') {
       	 for (let i = maxStreaks; i >= 0; i --) {
       	  	let date = new Date()
       	    date.setDate(date.getDate() - 7 * i)
       	    const scoreLabel = moment(date).format('W')
       	    const filteredData = data.filter(x => moment(x.date).format('W') === scoreLabel)
       	   if (filteredData.length >= habit.frequency.number) {
             score += 3
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
       	      scoreCounts.push(deriveScore(score))
       	      scoreLabels.push(moment(date).format('DD MMM'))
       	    }

          }
       }
       else if (habit.frequency.type === 'month') {
       	 for (let i = maxStreaks; i >= 0; i --) {
       	  	let date = new Date()
       	    date.setMonth(date.getMonth() - i)
       	    const scoreLabel = moment(date).format('MM YYYY')
       	    const filteredData = data.filter(x => moment(new Date(x.date)).format('MM YYYY') === scoreLabel)
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
       	    scoreCounts.push(deriveScore(score))
       	    scoreLabels.push(moment(date).format('MMMM'))
       	   
          }
       }
       return { scoreLabels, scoreCounts }
	}
  
  const scoreOptions = {
    scales: {
      yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      }],
    },
    legend: {
      display: false
    },
  }
  
  let graphScoreData = {
    labels: getScoreData(commitsData).scoreLabels, 
    datasets: [
      {
        label: 'score',
        data: getScoreData(commitsData).scoreCounts,
      }
    ]
  }

  return (
    <div style={styles().wrapper}>
      {showEditForm && (
        <EditHabitForm 
          goalId={habit.goalId}
          habit={habit}
          onAddHabit={onUpdateHabit} 
          onClose={() => setShowEditForm(false)} 
        />
      )}
      <div style={styles().titleContainer}>
        <div
          onClick={() => props.onDescribe({task: null, project: null, goal: null, habit: null})}
          style={styles().containerToDo}
        >
          <img style={styles().imgToDo} src={'./left-arrow.png'} alt='' />
          <div style={styles().title}>Description</div>
        </div>
        <div style={styles().imagesContainer}>
          <img src='/edit.png' 
            style={{cursor: 'pointer'}} 
            width='15' 
            height='15'
            alt='Edit the habit'
            title='Edit the habit'
            onClick={() => setShowEditForm(true)}
          />
          <DeleteButton confirm={true} width='15' height='15' onDelete={onDelete} />
        </div>
      </div>

      <div style={styles().container}>
        <div style={styles().headerContainer}>
          <div style={styles().titleText}>{habit.content}</div>
      	  <div style={styles().subTitleWrapper}>
      	    <div style={styles().subTitleContainer}>
      	      <div style={styles().subTitleValueText}>{frequency}</div>
      	      <div style={styles().subTitleText}>Frequency</div>
      	    </div>
      	    <div style={styles().subTitleContainer}>
              <div style={styles().subTitleValueText}>{habit.isNotification ? habit.startTime : 'Off'}</div>
      	      <div style={styles().subTitleText}>Notification</div>
            </div>
          </div>      	
        </div> 

      	<div>
      	  <div style={styles().titleSectionText}>Overview</div>
      	  <div style={styles().overviewWrapper}>
      	    <div style={styles().overviewContainer}>
      	       {!props.describeElem.goal.doneAt && habit.acheived === null && (<div style={styles().overviewValueText}>{habitScore}%</div>)}
               {props.describeElem.goal.doneAt && habit.acheived === null && (<img src={'/check.png'} style={styles().imageIcon} alt='' />)}
               {props.describeElem.goal.doneAt && habit.acheived === true && (<img alt='' src={'/check.png'} style={styles().imageIcon} alt='' />)}
               {habit.acheived === false && (<img src={'/uncheck.png'} alt='' style={styles().imageIcon} />)}
               {!props.describeElem.goal.doneAt && habit.acheived === null && (<div style={styles().overviewText}>Progress</div>)}
               {props.describeElem.goal.doneAt && habit.acheived === null && (<div style={styles().overviewText}>Status</div>)}
               {props.describeElem.goal.doneAt && habit.acheived === true && (<div style={styles().overviewText}>Status</div>)}
               {habit.acheived === false && (<div style={styles.overviewText}>Status</div>)}
      	     </div>
      	     <div style={styles().overviewContainer}>
      	       <div style={styles().overviewValueText}>{commitsData.length}</div>
      	       <div style={styles().overviewText}>Total</div>
      	     </div>
      	  </div>
          {commitsData.length > 0 && ( 
          <div>
            <div style={styles().titleSectionText}>Score</div>
              <div>
                <Line
                  data={graphScoreData}
                  options={scoreOptions}
                  legend={null}
                  height={100}
                />
              </div>
            <div style={styles().titleSectionText}>Calendar</div>
            <div style={styles().calendarHeatmap}>
              <CalendarHeatmap
                showMonthLabels
                showWeekdayLabels
                endDate={new Date().toJSON().slice(0, 10)}
                startDate={startCalendarDay.toJSON().slice(0, 10)}
                values={commitsData}
              />
            </div>
            </div>
          )}
      	</div>



      </div>
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: 900 * getDimRatio().X,
    height: 650* getDimRatio().Y,
    margin: 30,
    background: 'white',
    borderRadius: 20,
    boxShadow: '2px 4px grey',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 25 * getDimRatio().X,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  buttonBack: {
    height: 20 * getDimRatio().X,
    width: 20 * getDimRatio().X,
  },
  imgToDo: {
    height: 25,
    width: 25,
  },
  containerToDo: {
    cursor: 'pointer',
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
  },
  imagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  headerContainer: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    marginBottom: 10 * getDimRatio().X,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30 * getDimRatioText().X,
    marginBottom: 15 * getDimRatio().X,
    textAlign: 'center',
  },
  titleSectionText: {
    fontSize: 18 * getDimRatioText().X,
    fontWeight: 'bold',
    marginBottom: 10 * getDimRatio().X,
    color: '#32A3BC',
    marginTop: 20,
    marginLeft: 35 * getDimRatio().X,
  },
  subTitleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  marginBottom: 10,
  },
  subTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitleValueText: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 18 * getDimRatioText().X,
  },
  subTitleText: {
    fontSize: 13 * getDimRatioText().X
  },
  overviewWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'	  
  },
  overviewValueText: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 20 * getDimRatioText().X,	
  },
  overviewText: {
    fontSize: 12 * getDimRatioText().X
  },
  calendarHeatmap: {
    height: 200,
    width: 600,
  }
})

export default HabitDescription



