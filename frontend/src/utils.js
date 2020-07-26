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

const weekDayDate = (date, day) => {
  const d = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate())
  const currentDay = d.getDay()
  const diff = d.getDate() - currentDay + (currentDay == 0 ? -6 + day :1 + day)

  return new Date(d.setDate(diff));
}


const decomposeTasksToday = allTasks => {
    const todayTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) >= todayDate() && new Date(x.dueDate) < tomorrowDate()
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })
    const tomorrowTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) >= tomorrowDate() && new Date(x.dueDate) < dayAfterDate()
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

const decomposeTasksWeek = (allTasks, date) => {
  let weekDaysTasks = []
  for (let i = 0; i < 7; i++) { 
    const dayTasks = allTasks.filter( x => {
      return x.dueDate && new Date(x.dueDate) >= weekDayDate(date, i) && new Date(x.dueDate) < weekDayDate(date, i+1)
    }).map(x => {
      let task = x
      task.id = task._id
      return task
    })
    weekDaysTasks.push(dayTasks)
  }

  return weekDaysTasks
}

export {
  todayDate,
  tomorrowDate,
  weekDayDate,
  decomposeTasksToday,
  decomposeTasksWeek,
}
