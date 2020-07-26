class Api {

  constructor() {
    this.host = window.location.href.split(':4002')[0]
    this.baseUrl = this.host + ':4001/api'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  
  async getTasks({from, until}) {
    let url = this.baseUrl + `/tasks?from=${from}` 
    if (until)
      url += `&until=${until}`
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
