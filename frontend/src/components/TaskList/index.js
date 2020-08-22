import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import SimpleTask from './SimpleTask'
import ProjectTask from './ProjectTask'
import { getDimRatio } from '../../DynamicSizing'

const grid = 2

const getListStyle = (isDraggingOver, scale, isPast) => ({
    background: isDraggingOver ? 'lightblue' : isPast ? 'repeating-linear-gradient(#BDBDBD, #A4A4A4)' : 'lightgrey',
    padding: grid,
    height: scale === 1 ? null : 400 * getDimRatio().Y,
    overflow: scale === 1 ? null : 'auto',
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
                style={getListStyle(
                  snapshot.isDraggingOver, 
                  props.scale,
                  props.isPast
                )}>
                {props.items.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
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
