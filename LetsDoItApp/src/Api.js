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
  
  async getTasks({from, until, unfinished, someday}) {
    let url = this.baseUrl 
      + `/tasks?unfinished=${unfinished ? 'true' : 'false'}`
      + `&someday=${someday? 'true' : 'false'}`
      + `&from=${from}` 
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
