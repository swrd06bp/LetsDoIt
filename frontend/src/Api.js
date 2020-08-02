class Api {

  constructor() {
    this.host = window.location.href.split(':4002')[0]
    this.baseUrl = this.host + ':4001/api'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
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
