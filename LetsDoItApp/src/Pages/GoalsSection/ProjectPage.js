import React, { useState, useEffect, useLayoutEffect } from 'react'
import { 
  View, 
  SafeAreaView,
  Text, 
  TextInput,
  TouchableOpacity, 
  Image,
  ScrollView,
} from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { useRoute, useNavigation } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'

import EditProjectForm from './EditProjectForm'
import TaskDescription from '../../components/TaskDescription'
import { sortProjectTasks } from '../../utils'
import ProjectTask from '../../components/Task/ProjectTask'
import ListButton from '../../components/ListButton'
import Api from '../../Api'





function ProjectPage (props) {
	const route = useRoute()
	const navigation = useNavigation()
	const api = new Api()
    const { onGoBack, type, item: { _id, content, dueDate, list, note } } = route.params  
    const [currentDueDate, setCurrentDueDate] = useState(dueDate) 
    const [currentList, setCurrentList] = useState(list)
    const [currentContent, setCurrentContent] = useState(content)
    const [showEditForm, setShowEditForm] = useState(false)
    const [noteText, setNoteText] = useState(note)
    const [allTasks, setAllTasks] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allGoals, setAllGoals] = useState([])
    const [describeTask, setDescribeTask] = useState(null)

    useEffect(() => {
    	getAllTasks()
      getData()
    }, [])

    const getData = async () => {
      const respGoals = await api.getGoals()
      const resultGoals = await respGoals.json()
      const respProjects = await api.getProjects()
      const resultProjects = await respProjects.json()
      const [showEditProjectForm, setShowEditProjectForm] = useState(null)
      setAllGoals(resultGoals)
      setAllProjects(resultProjects)
    }


    const getAllTasks = async () => {
    	let resp
    	if (type === 'goal')
    		resp = await api.getTasksGoal(_id)
    	else if (type === 'project')
    		resp = await api.getTasksProject(_id)
    	const json = await resp.json()
      const sortedTasks = sortProjectTasks(json)
    	setAllTasks(sortedTasks)
    }

    const onEditItem = async (type, editItem) => {
      if (type === 'goal')
        await api.updateGoal(_id, editItem)
      else if(type === 'project')
        await api.updateProject(_id, editItem)
      setCurrentList(editItem.list)
      setCurrentDueDate(editItem.dueDate)
      setCurrentContent(editItem.content)
      setShowEditForm(false)
      onGoBack()
    }



    const onDeleteItem = async () => {

    }

   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerNavigation}>
        <TouchableOpacity style={styles.headerTouch} onPress={() => setShowEditForm(true)}>
          <Image source={require('../../../static/edit.png')} style={styles.optionImage} />
        </TouchableOpacity>
        <Menu>
        <MenuTrigger>
          <Image source={require('../../../static/options.png')} style={styles.optionImage} />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={onDeleteItem} >
            <Text>Delete {type}</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [])

   const doneTasks = allTasks.filter(x => x.doneAt)


	return (
      <SafeAreaView style={styles.wrapper}>
      {showEditForm && (
         <EditProjectForm
           isVisible={showEditForm}
           onClose={() => setShowEditForm(null)}
           type={type}
           onAddItem={onEditItem}
           item={{content: currentContent, dueDate: currentDueDate, list: currentList}}
        />
      )}
        {describeTask && ( <TaskDescription 
          task={describeTask.task}
          projects={allProjects}
          goals={allGoals}
          isVisible={describeTask ? true : false} 
          onDescribe={setDescribeTask}
          onUpdate={getAllTasks}
        />)}
        <View style={styles.headerWrapper}>
      	  <Text style={styles.titleText}>{currentContent}</Text>
          <ListButton list={currentList} onListChange={() => {setCurrentList(currentList === 'Personal' ? 'Work' : 'Personal')}} />
	      <View style={styles.subTitleWrapper}>
	      	<View style={styles.subTitleContainer}>
	      	  <Text style={styles.subTitleValueText}>{currentDueDate ? currentDueDate.slice(0 ,10) : 'Someday'}</Text>
	      	  <Text style={styles.subTitleText}>Due Date</Text>
	      	 </View>
	      	 <View style={styles.subTitleContainer}>
	           <Text style={styles.subTitleValueText}>{currentDueDate ? Math.floor((new Date(currentDueDate).getTime() - new Date().getTime()) / (1000*60*60*24)) : '-'}</Text>
	      	   <Text style={styles.subTitleText}>Days Left</Text>
	         </View>
	       </View>  
      	 </View>
      	<View>
      	  <Text style={styles.titleSectionText}>Note</Text>
      	  <TextInput
            multiline={true}
            numberOfLines = {4}
            value={noteText ? noteText : ''} 
            onChangeText={(text) => setNoteText(text)} 
            style={styles.noteText}
      	  />
          <View style={styles.listTaskTitleContainer}>
      	    <Text style={styles.titleSectionText}>Tasks</Text>
            {allTasks.length === 0 && (<Text style={styles.titleSectionText}>0</Text>)}
            {allTasks.length > 0 && (<Text style={styles.titleSectionText}>{doneTasks.length} / {allTasks.length}</Text>)}
      	 	 </View>
      	 	 <ScrollView style={styles.listTasksContainer}>
      	 	   {allTasks.map((item) => (
  				    <ProjectTask
                describeTask={describeTask}
                onDescribe={setDescribeTask}
                onUpdate={getAllTasks} 
                item={item}
  				    />
      	 	   ))}
  
      	 	 </ScrollView>
      	 	 
      	 </View>
      </SafeAreaView>
	)
}

const styles = EStyleSheet.create({
  headerNavigation: {
    flexDirection: 'row',
  },
  headerTouch: {
    marginRight: '10rem',
  },
   optionImage: {
    height: '25rem',
    width: '25rem',
    marginRight: '10rem',
  },
  wrapper: {
	 backgroundColor: 'white',
	 height: '100%',
  },
  headerWrapper: {
    backgroundColor: 'lightgrey',
    marginBottom: '10rem',
  },
  titleText: {
	fontWeight: 'bold',
	fontSize: '25rem',
	marginBottom: '15rem',
	alignSelf: 'center',
  },
	subTitleWrapper: {
	  flexDirection: 'row',
	  justifyContent: 'space-around',
	  alignItems: 'center',
	  marginVertical: '10rem',
	},
	subTitleContainer: {
	  justifyContent: 'center',
	  alignItems: 'center'
	},
	subTitleValueText: {
	  fontWeight: 'bold',
	  color: 'green',
	  fontSize: '18rem',
	},
	subTitleText: {
	  fontSize: '13rem'
	},
	titleSectionText: {
      fontSize: '18rem',
      fontWeight: 'bold',
      marginBottom: '10rem',
      color: '#32A3BC',
      marginTop: '20rem',
      marginHorizontal: '15rem',
	},
  listTaskTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteText: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    marginHorizontal: '10rem',
    height: '85rem',
  },
  listTasksContainer: {
  	height: '160rem',
  	borderColor: 'lightgrey',
  	marginHorizontal: '10rem', 
  	borderWidth: 1,
  }
})

export default ProjectPage