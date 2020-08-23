const express = require('express')
const router = express.Router()

const userController = require('./controllers/userController')
const happinessController = require('./controllers/happinessController')
const taskController = require('./controllers/taskController')
const projectController = require('./controllers/projectController')
const goalController = require('./controllers/goalController')
const habitController = require('./controllers/habitController')



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

// get user info
router.get('/user', userController.userGet)


// happiness
router.get('/happiness', happinessController.happinessGet)
router.post('/happiness', happinessController.happinessPost)


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
router.post('/goal', goalController.goalPost)
router.put('/goal/:goalId', goalController.goalPut)
router.delete('/goal/:goalId', goalController.goalDelete)


// habits
router.get('/goal/:goalId/habits', habitController.habitGoalGet)
router.post('/habit', habitController.habitPost)
router.delete('/habit/:habitId', habitController.habitDelete)


exports.router = router
