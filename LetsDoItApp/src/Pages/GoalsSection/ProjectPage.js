import React, { useState, useEffect, useLayoutEffect } from 'react'
import { 
  View, 
  SafeAreaView,
  Keyboard,
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
import AddTask from '../../components/AddElem/AddTask'
import DeletePopup from '../../components/DeletePopup'
import TaskDescription from '../../components/TaskDescription'
import AddButton from '../../components/AddButton'
import { sortProjectTasks } from '../../utils'
import ProjectTask from '../../components/Task/ProjectTask'
import ListButton from '../../components/ListButton'
import Api from '../../Api'



function ProjectPage (props) {
	const route = useRoute()
	const navigation = useNavigation()
	const api = new Api()
    const { onGoBack, type, item: { _id, content, dueDate, list, note, doneAt } } = route.params  
    const [currentDueDate, setCurrentDueDate] = useState(dueDate) 
    const [currentList, setCurrentList] = useState(list)
    const [currentContent, setCurrentContent] = useState(content)
    const [currentDoneAt, setCurrentDoneAt] = useState(doneAt)
    const [noteText, setNoteText] = useState(note)
    const [allTasks, setAllTasks] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allGoals, setAllGoals] = useState([])
    const [describeTask, setDescribeTask] = useState(null)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showDeleteForm, setShowDeleteForm] = useState(false)
    const [isAddingTask, setIsAddingTask] = useState(false)

    useEffect(() => {
      Keyboard.addListener('keyboardDidHide', () => setIsAddingTask(false))
    	getAllTasks()
      getData()
      return () => Keyboard.removeListener('keyboardDidHide', () => setIsAddingTask(false))
    }, [])


    const getData = async () => {
      const respGoals = await api.getGoals()
      const resultGoals = await respGoals.json()
      const respProjects = await api.getProjects()
      const resultProjects = await respProjects.json()
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

    const onComplete = async () => {
      let newDoneAt = null
      if (!currentDoneAt) {
        newDoneAt = new Date().toJSON()
      }
      if (type === 'goal')
        await api.updateGoal(_id, {doneAt: newDoneAt})
      else if(type === 'project')
        await api.updateProject(_id, {doneAt: newDoneAt})
      setCurrentDoneAt(newDoneAt)
      onGoBack()      
    }


    const onDeleteItem = async () => {
      if (type === 'goal')
        await api.deleteGoal(_id)
      else if(type === 'project')
        await api.deleteProject(_id)
      await onGoBack() 
      setShowDeleteForm(false)
      navigation.goBack()

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
          <MenuOption onSelect={onComplete} >
            <View style={styles.headerOptionContainer}>
            <CheckBox 
              boxType={'square'}
              style={styles.checkbox}
              value={currentDoneAt ? true : false}
              onValueChange={() => {}}
              />
              <Text>Mark as done</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => setShowDeleteForm(true)} >
            <Text>Delete {type}</Text>
          </MenuOption>
        </MenuOptions>
        </Menu>
        </View>
      )
    })
  }, [currentDoneAt])

   const doneTasks = allTasks.filter(x => x.doneAt)


	return (
      <SafeAreaView style={styles.wrapper}>
      {showDeleteForm && (
         <DeletePopup
           isVisible={showDeleteForm}
           onClose={() => setShowDeleteForm(false)}
           onDelete={onDeleteItem}
        />
      )}
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
        {!isAddingTask && (
          <View>
        <View style={styles.headerWrapper}>
      	  <Text style={styles.titleText}>{currentContent}</Text>
          <ListButton list={currentList} onListChange={() => {setCurrentList(currentList === 'Personal' ? 'Work' : 'Personal')}} />
	      <View style={styles.subTitleWrapper}>
	      	<View style={styles.subTitleContainer}>
	      	  <Text style={styles.subTitleValueText}>{currentDueDate ? currentDueDate.slice(0 ,10) : 'Someday'}</Text>
	      	  <Text style={styles.subTitleText}>{currentDoneAt ? 'Done at' : 'Due Date'}</Text>
	      	 </View>
	      	 <View style={styles.subTitleContainer}>
             {currentDoneAt && (<Image source={require('../../../static/check.png')} style={styles.imageIcon} />)}
	           {!currentDoneAt && (<Text style={styles.subTitleValueText}>{currentDueDate ? Math.floor((new Date(currentDueDate).getTime() - new Date().getTime()) / (1000*60*60*24)) : '-'}</Text>)}
	      	   <Text style={styles.subTitleText}>{currentDoneAt ? 'Status' : 'Days Left'}</Text>
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
             <TouchableOpacity style={styles.addTaskContainer} onPress={() => setIsAddingTask(true)}>
               <Text style={styles.addTaskText}>Add a new task</Text>
             </TouchableOpacity>
      	 	   {allTasks.map((item) => (
  				    <ProjectTask
                key={item._id}
                describeTask={describeTask}
                onDescribe={setDescribeTask}
                onUpdate={getAllTasks} 
                item={item}
  				    />
      	 	   ))}
  
      	 	 </ScrollView>
      	 	 
      	 </View>
         </View>
         )}
         {isAddingTask && (
           <AddTask 
              goalId={type === 'goal' ? _id : null}
              projectId={type === 'project' ? _id : null}
              onCreate={(task, chosenDateOption) => {
                setAllTasks(sortProjectTasks([task, ...allTasks]))
              }}
              onUpdate={getAllTasks}
            />
         )}
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
  },
  headerOptionContainer: {
    flexDirection: 'row'
  },
  checkbox: { 
    height: '18rem', 
    width: '18rem',
    marginRight: '10rem', 
  },
  imageIcon: {
    height: '30rem',
    width: '30rem',
  },
  addTaskContainer: {
    height: '35rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskText: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  }
})

export default ProjectPage