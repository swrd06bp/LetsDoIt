import React, { useEffect, useState } from 'react'
import { 
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet
} from 'react-native'
import ActionButton from '../components/ActionButton'

import Api from '../Api'

function DayFocus (props) {
  const [photo, setPhoto] = useState(null)
  const [content, setContent] = useState('')
  const [focusId, setFocusId] = useState(null)
  const api = new Api()
  const date = new Date()
  const number = new Date().getFullYear()*1000 
    + (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) 
      - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000

  useEffect(() => {
    const getPhoto = async () => {
      try {
        const resp = await api.getRandomPhoto()
        const json = await resp.json()
        setPhoto(json) 
      } catch (e) {
        console.log(e)
      }
    }

    const getFocus = async () => {
      const resp = await api.getFocus({type: 'day', number, limit: 1})
      const json = await resp.json()
      if (json.length) {
        setContent(json[0].content)
        setFocusId(json[0]._id)
      }
    }

    getPhoto() 
    getFocus()
  }, [])

  const onSubmit = async () => {
    const focus = {
      type: 'day',
      number,
      content,
    } 
    if(focusId)  await api.putFocus(focusId, focus)
    else await api.postFocus(focus)
    props.navigation.goBack()
  }


  return (
    <View>
    {photo && (
      <ImageBackground 
        source={{uri:photo[0].urls.small}}
        style={styles.coverImage} 
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>What is your main focus for today?</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            placeholder='I am going to acheive..'
            value={content}
            onChangeText={(text) => setContent(text)}            
            style={styles.inputText}
          />
        </View>
      </ImageBackground>
    )}
    {!photo && ( 
      <View style={styles.coverImage}>
        <View style={styles.header}>
          <Text style={styles.headerText}>What is your main focus for today?</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            placeholder='I am going to acheive..'
            value={content}
            onChangeText={(text) => setContent(text)}            
            style={styles.inputText}
          />
        </View>
      </View>
    )}
    <View style={styles.footer}>
      <ActionButton text={'Save'} onSubmit={onSubmit} />
    </View>
    
    </View>

  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 26,
  },
  inputText: {
    fontWeight: 'bold',
    fontSize: 18,
  }
})

export default DayFocus
