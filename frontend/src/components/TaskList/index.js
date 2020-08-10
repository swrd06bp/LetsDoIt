import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import ProjectShape from '../ProjectShape'
import GoalShape from '../GoalShape'
import ListButton from '../ListButton'
import SimpleTask from './SimpleTask'
import ProjectTask from './ProjectTask'
import Api from '../../Api'
import { todayDate } from '../../utils'

const grid = 2

const getListStyle = (isDraggingOver, scale, isPast) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    height: scale === 1 ? null : 400,
    overflow: scale === 1 ? null : 'auto',
    opacity: isPast ? 0.4 : 1,
})

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',
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
                style={getListStyle(snapshot.isDraggingOver, props.scale)}>
                {props.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => {
                          const isSelected = snapshot.isDragging || (props.task && props.task.id === item.id)
                          const isPast = item.dueDate && todayDate() >= new Date(item.dueDate)
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                  isSelected,
                                  provided.draggableProps.style,
                                  isPast,
                              )}
                            >
                              {!props.projectTask && (
                                <SimpleTask 
                                  item={item}
                                  onDescribe={props.onDescribe}
                                  scale={props.scale}
                                  task={props.task}
                                  onUpdate={props.onUpdate}
                                  goals={props.goals}
                                  projects={props.projects}
                                />
                              )}  
                              {props.projectTask && (
                                <ProjectTask 
                                  item={item}
                                  onDescribe={props.onDescribe}
                                  scale={props.scale}
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
