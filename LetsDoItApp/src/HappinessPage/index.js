import React, { useState, useEffect } from 'react'
import {
  SafeAreaView, 
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import moment from 'moment'

import Api from '../Api'
import { scoreToColor } from '../utils'
import Footer from '../components/Footer'

function MonthChart (props) {
  const [editId, setEditId] = useState(null)

  const filteredData = props.allData.filter(x => (
    moment(new Date(x.dueDate)).format('MMMM') === props.month)
  )

  let monthData = []


  for (let i = 1; i <= moment(new Date(`${props.index}/1/${props.year}`)).daysInMonth(); i++) {
    const index = filteredData.map(x => parseInt(moment(new Date(x.dueDate)).format('D'))).indexOf(i)
    if (index === -1)
      monthData.push({
        _id: new Date(props.year, props.index - 1, i).toJSON(),
        score: -1  
      })
    else
      monthData.push(filteredData[index])
  }

  

	return (
		<View style={styles.monthWrapper}>
           <Text style={styles.monthText}>{props.month}</Text>
           {monthData.map(x => {
        if (x.score === -1)
          return (
              <View 
                key={x._id}
                role='img text'
                title={'No entry data'}
                style={[
                  styles.dayContainer,
                  {backgroundColor: 'lightgrey'}
                ]}
            >
            </View>
          )
        else
          return (
              <View 
                key={x._id}
                role='img text'
                title={moment(new Date(x.dueDate)).format('dddd Do MMMM') + '\nHappiness score: ' + x.score}
                style={[
                  styles.dayContainer,
                  {backgroundColor: scoreToColor(x.score)},
                ]}
            >
            </View>
            )           	
           })}
		</View>
	)
}

function YearChart (props) {
	const allMonths = moment.months()

	return (
       <SafeAreaView>
          <View style={styles.yearHeaderContainer}>
             <TouchableOpacity
               style={styles.yearButtonContainer}
               onPress={() => {props.setYear(props.year - 1)}}
             >
               <Text style={styles.yearButtonText}>&lt;</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={styles.yearButtonContainer}
               onPress={() => {props.setYear(props.year + 1)}}
             >
               <Text style={styles.yearButtonText}>&gt;</Text>
             </TouchableOpacity>
             <Text style={styles.titleText}>{props.year}</Text>
          </View>
          {allMonths.map((month, index) => (
            <MonthChart 
              key={month}
              year={props.year.toString()}
              index={index + 1}
              allData={props.allData}
              month={month}
            />
          ))}
       </SafeAreaView>
	)
}

function HappinessPage (props) {
  const [allData, setAllData] = useState([])
  const [year, setYear] = useState(parseInt(moment(new Date()).format('YYYY')))

  useEffect(() => {
     getHappiness()
  }, [year])

  const getHappiness = async () => {
    const api = new Api()
    const resp = await api.getHappiness({currentYear: year, limit: 365})
    const json = await resp.json()
    setAllData(json)
  }
	
	return (
       <View style={styles.wrapper}>
         <View style={styles.happinessWrapper}>
         	<YearChart
              year={year}
              setYear={setYear}
              allData={allData} 
            />
         </View>
         <View style={styles.navigation}>
           <Footer
             current={'happiness'}
             navigation={props.navigation}
           />
         </View>
       </View>
	)
}

const styles = EStyleSheet.create({
  wrapper: {
    height: '100%'
  },
  happinessWrapper: {
    height: '92%'
  },
  navigation:{
    height: '8%',
  },
  yearHeaderContainer: {
  	flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20rem',
  },
  yearButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#32A3BC',
    borderColor: 'white',
    paddingLeft: '10rem',
    paddingRight: '10rem',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
  },
  yearButtonText: {
    fontSize: '18rem',
    color: 'white',  
    fontWeight: 'bold',	
  },
  titleText: {
    fontSize: '24rem',
    fontWeight: 'bold',
    marginHorizontal: '10rem',
  },
   monthWrapper: {
   	 flexDirection: 'row',
   	 margin: '5rem',
   },
   monthText: {
   	fontSize: '15rem',
   	width: '80rem',
   	textAlign: 'center'
   },
   dayContainer: {
   	  borderColor: 'black',
      borderWidth: 0.3,
      height: '30rem',
      width: '10rem',

   },
 })

export default HappinessPage
