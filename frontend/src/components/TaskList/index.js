import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import Goal from '../../components/Goal'
import Project from '../../components/Project'
import SimpleTask from './SimpleTask'
import ProjectTask from './ProjectTask'
import RoutineTask from './RoutineTask'
import HappinessTask from './HappinessTask'
import { getDimRatio } from '../../app/DynamicSizing'

const grid = 2

const getListStyle = (isDraggingOver, type, isPast) => ({
    background: isDraggingOver ? 'lightblue' : isPast ? 'repeating-linear-gradient(#BDBDBD, #A4A4A4)' : 'lightgrey',
    padding: grid,
    height: type === 'day' ? null : 400 * getDimRatio().Y,
    overflow: type === 'day' ? null : 'auto',
})

const getItemStyle = (isDragging, draggableStyle, isPast) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : isPast ? '#F2F2F2' : 'white',
    borderRadius: 10,


    // styles we need to apply on draggables
    ...draggableStyle
})




function TaskList (props) {

  return (
    <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                style={props.hide ? {} : getListStyle(
                  snapshot.isDraggingOver, 
                  props.type,
                  props.isPast
                )}>
                {props.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        isDragDisabled={props.projectTask || item.type === 'routine' || item.type === 'happiness'}
                        index={index}>
                        {(provided, snapshot) => {
                          const isSelected = snapshot.isDragging || (props.task && props.task.id === item.id)
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{...getItemStyle(
                                  isSelected,
                                  provided.draggableProps.style,
                                  props.isPast
                              ), boxShadow: !item.doneAt ? '1px 2px grey' : null}}
                            >
                              {!props.projectTask && item.type === 'task' && (
                                <SimpleTask 
                                  item={item}
                                  onDescribe={props.onDescribe}
                                  type={props.type}
                                  task={props.task}
                                  onUpdate={props.onUpdate}
                                  onDelete={props.onDelete}
                                  onDoneChange={props.onDoneChange}
                                  goals={props.goals}
                                  projects={props.projects}
                                  isSelected={isSelected}
                                />
                              )}  
                              {!props.projectTask && item.type === 'routine' && (
                                <RoutineTask 
                                  item={item}
                                  onDescribe={() => {}}
                                  type={props.type}
                                  task={props.task}
                                  onUpdate={props.onUpdate}
                                  goals={props.goals}
                                />
                              )}  
                              {!props.projectTask && item.type === 'happiness' && (
                                <HappinessTask 
                                  onDescribe={() => {}}
                                  onUpdate={props.onUpdate}
                                />
                              )}  
                              {!props.projectTask && item.type === 'project' && (
                                <Project 
                                  item={item}
                                  onDescribe={() => {}}
                                  project={props.project}
                                  type={props.type}
                                  onUpdate={props.onUpdate}
                                />
                              )}  
                              {!props.projectTask && item.type === 'goal' && (
                                <Goal 
                                  item={item}
                                  onDescribe={() => {}}
                                  goal={props.project}
                                  type={props.type}
                                  onUpdate={props.onUpdate}
                                />
                              )}  
                              {props.projectTask && (
                                <ProjectTask 
                                  item={item}
                                  onDescribe={props.onDescribe}
                                  type={props.type}
                                  project={props.project}
                                  goal={props.goal}
                                  task={props.task}
                                  onUpdate={props.onUpdate}
                                />

                              )}
                            </div>
                          )
                        }}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
  )

}

export default TaskList
