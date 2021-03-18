const fetch = require('node-fetch')
const { ObjectId } = require('mongodb')
const dbClient = require('../dbclient')

const slack_api_token = 'xoxb-31777162896-1848862255779-E4ZNr3psfdHJUeADqorqsPxJ'
const slack_token = 'SA4OE9yoCf4HC0ufqHQhYzpm'

const sendMessageToSlackResponseURL = async (responseUrl, JSONmessage) => {
  const postOptions = {
	method: 'POST',
	headers: {
	  'Content-type': 'application/json'
	},
	body: JSON.stringify(JSONmessage)
  }
  await fetch(responseUrl, postOptions)
    .catch(err => console.error(err))
}

const getListUsers = async (teamId) => {
  const url = `https://slack.com/api/users.list?team_id=${teamId}&pretty=1`
  return await fetch(url, {headers: {"Authorization": "Bearer " + slack_api_token}})
} 

exports.slackTask = async (req, res) => {
  const body = req.body
  const payload = JSON.parse(body.payload)

  if (payload.token != slack_token){
	  res.status(403).end("Access forbidden")
  } else {
    const integrations = await dbClient.getElems({
      table: 'integrations',
      query: {
        type: 'slack',
        values: { 
          teamId: payload.team.id,
          userId: payload.user.id
        }
      },
    })
    if (integrations.length > 0) {
      let person = payload.channel.name

      if (person === 'directmessage') {
        const resp = await getListUsers(payload.message.team) 
        const users = await resp.json()
        const result = users.members.filter(x => x.id === payload.message.user)
        if (result.length > 0) person = result[0].name 
      }


      const userId = integrations[0].userId
      const task = {
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        dueDate: new Date().toJSON(),
        list: 'Work',
        content: 'Slack: respond to ' + person,
        doneAt: null,
        goalId: null,
        projectId: null,
        note: 'https://calipsa.slack.com/app_redirect?channel=' + payload.channel.id
      }
      const taskId = await dbClient.writeElem({table: 'tasks', elem: task, userId})
      req.app.get("socketService").emiter('tasks', 'update', slack_token, req.decoded)
    }
       
	const response = {
	  "status": "ok",
    }
	res.status(200).json(response)
  }
}


exports.slackLogin = async (req, res) => {
  const body = req.body

  if (body.token != slack_token){
	  res.status(403).end("Access forbidden")
  } else {
    const responseUrl = body.response_url

	const message = {
		"text": "Don't forget about your success",
		  "attachments": [
			{
				  "text": "Login to your account",
				  "fallback": "Shame... buttons aren't supported in this land",
				  "callback_id": "login",
				  "color": "#3AA3E3",
				  "attachment_type": "default",
				  "actions": [
					  {
						  "name": "login",
						  "text": "login",
						  "type": "button",
                          "url": "https://app.lets-do-it.me/login?type=slack&teamId=" + body.team_id + "&userId=" + body.user_id,
						  "value": "yes"
					  },
				  ]
			  }
		  ]
		}
  		sendMessageToSlackResponseURL(responseUrl, message)
        res.status(200).end()
  }
}

