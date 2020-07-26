const todayDate = () => new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
const tomorrowDate = () => {
    let date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
    date.setDate(date.getDate() + 1)
    return date
} 
const dayAfterDate = () => {
    let date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())
    date.setDate(date.getDate() + 2)
    return date
} 

const decomposeTasks = allTasks => {
    const todayTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) > todayDate() && new Date(x.dueDate) < tomorrowDate()
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })
    const tomorrowTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) > tomorrowDate() && new Date(x.dueDate) < dayAfterDate()
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })
    const upcomingTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) > dayAfterDate()
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })
    const somedayTasks = allTasks.filter( x => {
      return !x.dueDate
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })

  return { todayTasks, tomorrowTasks, upcomingTasks, somedayTasks }
}

export {
  todayDate,
  tomorrowDate,
  dayAfterDate,
  decomposeTasks,
}
