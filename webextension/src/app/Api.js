class Api {

  constructor() {
    this.host = "https://api.lets-do-it.me"
    this.baseUrl = this.host + ':4001/v1'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-access-token': localStorage.getItem('user')
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
  
  logout() {
    localStorage.removeItem('user')
  }

  async login(username, password) {
    const url = this.baseUrl + '/login'
    const body = {username, password}
    const resp = await this.post(url, body)
    if (resp.status === 200) {
      const body = await resp.json()
      localStorage.setItem('user', body.token)
      return(true)
    } else {
      return(false)
    }
  }

  async changePassword({username, oldPassword, newPassword}) {
    const url = this.baseUrl + '/newpassword' 
    const body = {username, oldPassword, newPassword}
    const resp = await this.put(url, body)
    if (resp.status  === 200) {
      return(true)
    } else {
      return(false)
    }
  }
  
  async signup(name, username, password, captchaToken) {
    const url = this.baseUrl + '/signup'
    const body = {name, username, password, captchaToken}
    return await this.post(url, body)
  }

  async getName() {
    const url = this.baseUrl + '/user'
    return await this.get(url)
  }

  async setName(name) {
    const url = this.baseUrl + '/user'
    const body = {name}
    return await this.put(url, body)
  }

  async getCustomization() {
    const url = this.baseUrl + '/user'
    return await this.get(url)
  }

  async setCustomization(customization) {
    const url = this.baseUrl + '/user'
    const body = {customization}
    return await this.put(url, body)
  }


  async getHappiness ({currentYear, limit}) {
    const url = this.baseUrl + `/happiness?year=${currentYear}&limit=${limit}`
    return await this.get(url)
  }
  
  async postHappiness ({dueDate, score, note}) {
    const url = this.baseUrl + '/happiness'
    const body = { dueDate, score, note }
    return await this.post(url, body)
  }
  
  async putHappiness (happinessId, {dueDate, score, note}) {
    const url = this.baseUrl + `/happiness/${happinessId}`
    const body = { dueDate, score, note }
    return await this.put(url, body)
  }

  async getFocus ({type, number, limit}) {
    const url = this.baseUrl + `/focus?type=${type}&number=${number}&limit=${limit}`
    return await this.get(url)
  }
  
  async postFocus (focus) {
    const url = this.baseUrl + '/focus'
    const body = { ...focus }
    return await this.post(url, body)
  }
  
  async putFocus (focusId, focus) {
    const url = this.baseUrl + `/focus/${focusId}`
    const body = { ...focus }
    return await this.put(url, body)
  }

  async getHabits({unfinished}) {
    const url = this.baseUrl + `/habits`
      + `?unfinished=${unfinished ? 'true' : 'false'}`
    return await this.get(url)
  }

  async getHabitsGoal (goalId, all) {
    let url = this.baseUrl + `/goal/${goalId}/habits`
    if (all)
      url += `?all=true`
    return await this.get(url)
  }
  
  async insertHabit(habit) {
    const url = this.baseUrl + '/habit'
    return await this.post(url, habit)
  }
  
  async updateHabit(habitId, habit) {
    const url = this.baseUrl + `/habit/${habitId}`
    return await this.put(url, habit)
  }
  
  async deleteHabit(habitId) {
    const url = this.baseUrl + `/habit/${habitId}`
    return await this.delete(url)
  }
  
  async getRoutinesHabit ({habitId, isDone, since, limit}) {
    let url = this.baseUrl + `/habit/${habitId}/routines`
    if (isDone === true || isDone === false)
      url += `?isDone=${isDone}`
    if (since)
      url += `&since=${since}`
    if (limit)
      url += `&limit=${limit}`
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

  async get(url) {
    const headers = this.headers
    return await fetch(url, {headers, cache: 'no-store'})
  }
  
  async post(url, body) {
    const headers = this.headers
    return await fetch(url, {headers, method: 'post', body: JSON.stringify(body)})
  }
  
  async put(url, body) {
    const headers = this.headers
    return await fetch(url, {headers, method: 'put', body: JSON.stringify(body)})
  }

  async delete(url, body) {
    const headers = this.headers
    return await fetch(url, {headers, method: 'delete'})
  }

}


export default Api
