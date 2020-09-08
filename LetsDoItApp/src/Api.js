import AsyncStorage from '@react-native-community/async-storage'

class Api {

  constructor() {
    this.host = 'https://mstaging.calipsa.io' 
    this.baseUrl = this.host + ':4001/api'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  async status() {
    const url = this.baseUrl + '/status'
    const resp = await this.get(url)
    if (resp.status !== 200) {
      this.logout()

      return false
    } else {
      return true
    }
  }
  
  async logout() {
    await AsyncStorage.removeItem('@token') 
  }

  async login(username, password) {
    const url = this.baseUrl + '/login'
    const body = {username, password}
    const resp = await this.post(url, body)
    if (resp.status === 200) {
      const body = await resp.json()
      await AsyncStorage.setItem('@token', body.token)
      return(true)
    } else {
      return(false)
    }
  }
  
  async getName() {
    const url = this.baseUrl + '/user'
    return await this.get(url)
  }


  async getHappiness (limit) {
    const url = this.baseUrl + `/happiness?limit=${limit}`
    return await this.get(url)
  }
  
  async postHappiness (score, note) {
    const url = this.baseUrl + '/happiness'
    const body = { score, note }
    return await this.post(url, body)
  }

  async getHabits({unfinished}) {
    const url = this.baseUrl + `/habits`
      + `?unfinished=${unfinished ? 'true' : 'false'}`
    return await this.get(url)
  }

  async getHabitsGoal (goalId) {
    const url = this.baseUrl + `/goal/${goalId}/habits`
    return await this.get(url)
  }
  
  async insertHabit(habit) {
    const url = this.baseUrl + '/habit'
    return await this.post(url, habit)
  }
  
  async deleteHabit(habitId) {
    const url = this.baseUrl + `/habit/${habitId}`
    return await this.delete(url)
  }
  
  async getRoutinesHabit ({habitId, isDone, since, limit}) {
    const url = this.baseUrl + `/habit/${habitId}/routines`
      + `?isDone=${isDone}&since=${since}&limit=${limit}`
    return await this.get(url)
  }
  
  async insertRoutine(routine) {
    const url = this.baseUrl + '/routine'
    return await this.post(url, routine)
  }


  async getTasks({from, until, unfinished, someday}) {
    let url = this.baseUrl 
      + `/tasks?unfinished=${unfinished ? 'true' : 'false'}`
      + `&someday=${someday? 'true' : 'false'}`
      + `&from=${from}` 
    if (until)
      url += `&until=${until}`
    return await this.get(url)
  }

  async getTasksProject(projectId) {
    let url = this.baseUrl + `/project/${projectId}/tasks`
    return await this.get(url)
  }
  
  async getTasksGoal(goalId) {
    let url = this.baseUrl + `/goal/${goalId}/tasks`
    return await this.get(url)
  }

  async insertTask(task) {
    const url = this.baseUrl + '/task'
    return await this.post(url, task)
  }

  async updateTask(taskId, task) {
    const url = this.baseUrl + `/task/${taskId}`
    return await this.put(url, task)
  }
  
  async deleteTask(taskId) {
    const url = this.baseUrl + `/task/${taskId}`
    return await this.delete(url)
  }

  async getGoals() {
    let url = this.baseUrl + `/goals`
    return await this.get(url)
  }

  async getGoal(goalId) {
    console.log('gol', goalId)
    const url = this.baseUrl + `/goal/${goalId}`
    return await this.get(url)
  }

  
  async insertGoal(goal) {
    const url = this.baseUrl + '/goal'
    return await this.post(url, goal)
  }

  async updateGoal(goalId, goal) {
    const url = this.baseUrl + `/goal/${goalId}`
    return await this.put(url, goal)
  }
  
  async deleteGoal(goalId) {
    const url = this.baseUrl + `/goal/${goalId}`
    return await this.delete(url)
  }
  
  async getProjects() {
    let url = this.baseUrl + `/projects`
    return await this.get(url)
  }

  
  async insertProject(project) {
    const url = this.baseUrl + '/project'
    return await this.post(url, project)
  }

  async updateProject(projectId, project) {
    const url = this.baseUrl + `/project/${projectId}`
    return await this.put(url, project)
  }
  
  async deleteProject(projectId) {
    const url = this.baseUrl + `/project/${projectId}`
    return await this.delete(url)
  }

  async createHeaders(headers) {
    let newHeaders = headers
    try {
      const token = await AsyncStorage.getItem('@token')
      if (token)
        newHeaders['x-access-token'] = token
    } catch (e) {
      console.log(e)
    }
    return newHeaders
  }

  async get(url) {
    const headers = await this.createHeaders(this.headers)
    return await fetch(url, {headers, cache: 'no-store'})
  }
  
  async post(url, body) {
    const headers = await this.createHeaders(this.headers)
    return await fetch(url, {headers, method: 'post', body: JSON.stringify(body)})
  }
  
  async put(url, body) {
    const headers = await this.createHeaders(this.headers)
    return await fetch(url, {headers, method: 'put', body: JSON.stringify(body)})
  }

  async delete(url, body) {
    const headers = await this.createHeaders(this.headers)
    return await fetch(url, {headers, method: 'delete'})
  }

}


export default Api
