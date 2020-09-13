import React, { useState, useEffect } from 'react'
import { DraxProvider, DraxView } from 'react-native-drax'
import { 
  StyleSheet,
  Vibration,
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'

import Api from '../Api'

function ListGroceries(props) {
  const [allLists, setAllLists] = useState([])
  const [showDeletion, setShowDeletion] = useState(false)
  const [draggedProject, setDraggedProject] = useState(null)
  const api = new Api()

  useEffect(() => {
    getProjects()
  }, [])
  
  const getProjects = async () => {
    const resp = await api.getProjects()
    const projects = await resp.json()
    setAllLists(projects)
  }

  const deriveData = () => {
    let data = []
    let subData = []
    let list
    for (let i = 0; i <= allLists.length; i++) {
      if (i < allLists.length)
        list = {...allLists[i], type: 'item'}
      else
        list = {type: 'new', content: 'Create list'}
      subData.push({key: list._id, content: list.content, type: list.type})
      if ((i % 2 === 0 || i === allLists.length ) && i > 0)  {
        data.push({key: i, rowElems: subData})
        subData = []
      }
    }
    return data
  }

  const data = deriveData()

  return (
    <DraxProvider>
      <FlatList
        data={data}
        style={{height: draggedProject ? '88%' : '100%'}}
        renderItem={({item}) => (
          <View key={item.key.toString()} style={styles.rowItems}>
            {item.rowElems.map((elem) => {
              const source = elem.type === 'new' ?
                require('../../static/create.png') :
                require('../../static/groceries.png')

              return (
                <DraxView
                  noHover={elem.type === 'new'}
                  longPressDelay={1000}
                  animateSnapback={false}
                  onDragStart={(event)=> {
                    if (elem.type !== 'new') {
                      setDraggedProject({id: item._id})
                      Vibration.vibrate(200)
                    }
                  }}
                  onDragEnd={() => setDraggedProject(null)}
                  renderContent={({ viewState }) => (
                    <TouchableOpacity
                      onPress={() => {}}
                      style={styles.itemContainer}
                    >
                      <Image 
                        source={source} 
                        style={styles.itemImage}
                      />
                      <Text>{elem.content}</Text>
                    </TouchableOpacity>
                  )}
                />
              )})} 
          </View>
        )}
        keyExtractor={item => item.key.toString()}
      />
      {draggedProject && (
        <View style={[styles.removeTaskContainer, {backgroundColor: showDeletion ? 'lightblue': 'white'}]}>
          <DraxView
            noHover={true}
            onReceiveDragEnter={() => setShowDeletion(true)}
            onReceiveDragExit={() => setShowDeletion(false)}
            renderContent={({ viewState }) => {
              return (
                <View style={{alignItems: 'center'}}>
                  <Image 
                    source={require('../../static/trash.png')}
                    style={styles.trashImage}
                  /> 
                </View>
              )
            }}
            onReceiveDragDrop={(event) => {
              api.deleteProject(draggedProject.key)
                .then(() => {
                  Vibration.vibrate(400)
                  getProjects()
                  setDraggedProject(null)
                  setShowDeletion(false)
                  
                })
              
            }}
            onDragEnd={() => setDraggedProject(null)}
          />
        </View>
      )}
    </DraxProvider>
       
  )
}

const styles = StyleSheet.create({
  rowItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    height: 70,
    width: 70,
  },
  trashImage: {
    height: 52,
    width: 50
  },
  removeTaskContainer: {
    height: '12%',
    justifyContent: 'center',
  },
})

export default ListGroceries
