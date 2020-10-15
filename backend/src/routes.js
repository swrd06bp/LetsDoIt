const express = require('express')
const router = express.Router()

const userController = require('./controllers/userController')
const happinessController = require('./controllers/happinessController')
const focusController = require('./controllers/focusController')
const taskController = require('./controllers/taskController')
const projectController = require('./controllers/projectController')
const goalController = require('./controllers/goalController')
const habitController = require('./controllers/habitController')
const routineController = require('./controllers/routineController')
const photoController = require('./controllers/photoController')



// users login
router.post('/login', userController.userLogin) 
router.post('/signup', userController.userSignup) 

// auth
router.use(require('./tokenChecker'))

// check status
router.get('/status', (req, res) => {
  res.status(200)
  res.json({'status':'ok'})
  res.end()
})

// get random photo
router.get('/photo', photoController.photoGet)

// get user info
router.get('/user', userController.userGet)
router.put('/user', userController.userPut)
router.put('/newpassword', userController.userChangePassword)

// happiness
router.get('/happiness', happinessController.happinessGet)
router.post('/happiness', happinessController.happinessPost)

// focus
router.get('/focus', focusController.focusGet)
router.post('/focus', focusController.focusPost)
router.put('/focus/:focusId', focusController.focusPut)


// tasks
router.get('/tasks', taskController.taskGet)
router.post('/task', taskController.taskPost)
router.put('/task/:taskId', taskController.taskPut)
router.delete('/task/:taskId', taskController.taskDelete)
router.get('/goal/:goalId/tasks', taskController.taskGoalGet)
router.get('/project/:projectId/tasks', taskController.taskProjectGet)


// projects
router.get('/projects', projectController.projectGet)
router.post('/project', projectController.projectPost)
router.put('/project/:projectId', projectController.projectPut)
router.delete('/project/:projectId', projectController.projectDelete)


// goals
router.get('/goals', goalController.goalGet)
router.get('/goal/:goalId', goalController.goalGet)
router.post('/goal', goalController.goalPost)
router.put('/goal/:goalId', goalController.goalPut)
router.delete('/goal/:goalId', goalController.goalDelete)


// habits
router.get('/habits', habitController.habitGet)
router.get('/goal/:goalId/habits', habitController.habitGoalGet)
router.post('/habit', habitController.habitPost)
router.put('/habit/:habitId', habitController.habitPut)
router.delete('/habit/:habitId', habitController.habitDelete)

// routines
router.get('/habit/:habitId/routines', routineController.routineHabitGet)
router.post('/routine', routineController.routinePost)

exports.router = router
