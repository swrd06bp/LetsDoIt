function buildGetQuery (params) {

  const {from, until, unfinished, someday} = params
  let timeQuery = {
    'dueDate': {
      '$gte': new Date(from).toJSON(),
    },
  }
  if (until)
    timeQuery.dueDate['$lt'] = new Date(until).toJSON()

  let queryArr = [timeQuery]

  if (someday === 'true')
    queryArr.push({'dueDate': null})
  if (unfinished === 'true')
    queryArr.push({'doneAt' : null})

  const query =  {'$or': queryArr}

  return query

}




exports.buildGetQuery = buildGetQuery
