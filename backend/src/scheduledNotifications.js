const dbClient = require('./dbclient')
const FCM = require('fcm-node')

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
  let tomorrowDate = new Date() 
  tomorrowDate.setHours(new Date().getHours() + 1)
  const allTasks = await dbClient.getElems({
    table: 'tasks',
    query: { 
      isNotification: { '$eq': true },
      dueDate: {
        '$gte': new Date().toJSON(),
        '$lt': tomorrowDate.toJSON(), 
      },
    },
  })
  return allTasks
}

async function sendNotificationsUser   (userId, title, body) {
  const notifications = await getFcmTokens(userId)

  for (notif of notifications)
    sendSingleNotification(notif.fcmToken, title, body)
}


async function sendAllNotifications () {
  const allTasks = await getNotifTasks()
  for (let task of allTasks)
    sendNotificationsUser(task.userId, 'You need to finish that task today', task.content)
}

exports.sendAllNotifications = sendAllNotifications
