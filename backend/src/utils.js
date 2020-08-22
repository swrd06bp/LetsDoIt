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




exports.buildGetTasksQuery = buildGetTasksQuery
exports.buildGetProjectsQuery = buildGetProjectsQuery
exports.getRandomColor = getRandomColor
