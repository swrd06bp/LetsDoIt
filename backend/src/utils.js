const todayDate = () => new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())

const lastWeekDate = () => {
    let date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
    date.setDate(date.getDate() - 7)
    return date
}

const lastMonthDate = () => {
    let date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
    date.setMonth(date.getMonth() - 1)
    return date
}


function buildGetTasksQuery (params) {

  const {from, until, unfinished, someday} = params
  let dueDateQueryTemp = {
    'dueDate': {
      '$gte': new Date(from).toJSON(),
    },
  }
  if (until)
    dueDateQueryTemp.dueDate['$lt'] = new Date(until).toJSON()

  const dueDateQuery = {'$and': [dueDateQueryTemp, {'doneAt': null}]}
  
  let doneAtQuery = {
    'doneAt': {
      '$gte': new Date(from).toJSON(),
    },
  }
  if (until)
    doneAtQuery.doneAt['$lt'] = new Date(until).toJSON()
  const timeQuery = {'$or': [dueDateQuery, doneAtQuery]}

  let queryArr = [timeQuery]



  if (someday === 'true')
    queryArr.push({'$and': [{'dueDate': null}, {'doneAt': null}]})


  if (unfinished === 'true')
    queryArr.push({'$and': [{'doneAt' : null}, {'dueDate': {$ne:null}}]})

  const query =  {'$or': queryArr}

  return query
}


function buildGetProjectsQuery (params) {
  const { unfinished } = params

  let query = {}

  if (!unfinished === 'true')
    query['doneAt'] = {$ne:null}
  return query
}


function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
    return color
}

const generateRoutineTask = ({habit, doneRoutines, unDoneRoutines}) => {
  const routineTask = {
    id: habit._id,
    type: 'routine',
    content: habit.content,
    goalId: habit.goalId,
    userId: habit.userId,
  }
  console.log('sldfksdlf', doneRoutines, unDoneRoutines)

  const [startHour, startMinute] = habit.startTime.split(':')

  let nextTime = new Date()
  nextTime.setMinutes(nextTime.getMinutes() + 15)

  if ( (parseInt(startHour) >= nextTime.getHours() && parseInt(startMinute) > nextTime.getMinutes()) || (parseInt(startHour) <= new Date().getHours() && parseInt(startMinute) < new Date().getMinutes()))
    return null
  else if (doneRoutines.length === 0 && unDoneRoutines.length === 0)
    return routineTask
  else if (doneRoutines.length === 0 && new Date(unDoneRoutines[0].postponeUntil) < tomorrowDate())
    return routineTask
  else if (doneRoutines.length === 0 && new Date(unDoneRoutines[0].postponeUntil) >= tomorrowDate())
    return null
  else if (
    (
      (doneRoutines.length && doneRoutines.length < habit.frequency.number
      && new Date(doneRoutines[0].createAt) >= todayDate())
    ) && (
      !(unDoneRoutines 
        && new Date(unDoneRoutines[0].postponeUntil) >= tomorrowDate())
    )
  )
    return routineTask
  else
    return null
}



exports.buildGetTasksQuery = buildGetTasksQuery
exports.buildGetProjectsQuery = buildGetProjectsQuery
exports.getRandomColor = getRandomColor
exports.generateRoutineTask = generateRoutineTask
exports.todayDate = todayDate
exports.lastWeekDate = lastWeekDate
exports.lastMonthDate = lastMonthDate
