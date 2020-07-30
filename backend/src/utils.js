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
    queryArr.push({'$and': [{'dueDate': null}, {'doneAt': null}]})
  if (unfinished === 'true')
    queryArr.push({'$and': [{'doneAt' : null}, {'dueDate': {$ne:null}}]})

  const query =  {'$or': queryArr}

  return query

}




exports.buildGetQuery = buildGetQuery
