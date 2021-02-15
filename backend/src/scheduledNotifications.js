const dbClient = require('./dbclient')
const FCM = require('fcm-node')
const { 
  generateRoutineTask,
  todayDate,
  lastWeekDate,
  lastMonthDate,
} = require('./utils')

const serverKey = 'AAAAtF0WU80:APA91bEC4Msn4uIaKflNdwRIRLIpxvSYtaq_4yHiTacnSsob-fQpbM1YpxEO8ol1LvrB1rbl9pbuV8KnHL2N5sL0yijozhyN2AFa1p3Eu4Av4HPllgmuA8zxd6eQCIi0S8gHHcfNGhIt'; //put your server key here


async function getFcmTokens (userId) {
  const fcmTokens = await dbClient.getElems({
    table: 'notifications',
    query: {},
    userId,
  })
  return fcmTokens
}

async function sendSingleNotification (fcmToken, title, body) {
  const fcm = new FCM(serverKey);
  const message = {
    to: fcmToken, 
    notification: { title, body },
    data: { 
      my_key: 'my value',
      my_another_key: 'my another value'
    }
  };
  
  fcm.send(message, function(err, response){
      if (err) {
          console.log("Something has gone wrong!");
      } else {
          console.log("Successfully sent with response: ", response);
      }
  });

}

async function getNotifTasks () {
  let previousTime = new Date()
  previousTime.setMinutes(previousTime.getMinutes() - 5)
  let nextTime = new Date() 
  nextTime.setHours(new Date().getMinutes() + 10)
  const allTasks = await dbClient.getElems({
    table: 'tasks',
    query: { 
      isNotification: { '$eq': true },
      doneAt: null,
      dueDate: {
        '$gte': previousTime.toJSON(),
        '$lt': nextTime.toJSON(), 
      },
    },
  })
  return allTasks
}

async function getNotifRoutines () {
  const allHabits = await dbClient.getElems({
    table: 'habits',
    query: { 
      isNotification: { '$eq': true },
      acheived: null,
    },
  })
    
  let allRoutineTasks = []
  for (let habit of allHabits) {
    // get the doneRoutines
    const since = habit.frequency.type === 'day' ? todayDate().toJSON() 
      : (habit.frequency.type === 'week' ? lastWeekDate().toJSON() : lastMonthDate().toJSON())
    
    const doneRoutines = await dbClient.getElems({
      table: 'routines',
      query: { 
        habitId: habit._id,
        isDone: { '$eq': true },
        dueDate: {'$gte': new Date(since).toJSON()},
      },
      maxNum: parseInt(habit.frequency.number),
    })

    // get the unDoneRoutines
    const unDoneRoutines = await dbClient.getElems({
      table: 'routines',
      query: { 
        habitId: habit._id,
        isDone: { '$eq': false },
        dueDate: {'$gte': new Date(since).toJSON()},
      },
      maxNum: 1,
    })

    
    const routineTask = generateRoutineTask({habit, doneRoutines, unDoneRoutines})
    if (routineTask)
      allRoutineTasks.push(routineTask)
  }
  return allRoutineTasks
}

async function sendNotificationsUser   (userId, title, body) {
  const notifications = await getFcmTokens(userId)

  for (notif of notifications)
    sendSingleNotification(notif.fcmToken, title, body)
}


async function sendTasksNotifications () {
  const allTasks = await getNotifTasks()
  for (let task of allTasks)
    sendNotificationsUser(task.userId, 'You need to finish that task today', task.content)
}

async function sendRoutinesNotifications () {
  const allTasks = await getNotifRoutines()
  for (let task of allTasks)
    sendNotificationsUser(task.userId, task.content, 'Make sure you keep up the good habits')
}

exports.sendTasksNotifications = sendTasksNotifications
exports.sendRoutinesNotifications = sendRoutinesNotifications
