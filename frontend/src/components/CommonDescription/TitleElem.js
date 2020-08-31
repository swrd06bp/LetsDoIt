import React from 'react'

import ListButton from '../../components/ListButton'


export default function TitleElem (props) {

  return (
    <div style={styles().titleTaskContainer}>
        <textarea 
          type='text' 
          name='content'
          value={props.content} 
          onChange={(event) => props.setContent(event.target.value)} 
          style={styles().titleTaskText}
        />
        <ListButton 
          item={props.item}
          scale={1.5}
          active={true}
          onListChange={props.setList}
        />
    </div>
  )
}

const styles = () => ({
  titleTaskContainer: {
    background: 'rgba(196, 196, 196, 0.21)',
    height: 70,
    padding: 3,
    margin: 10,
  },
  titleTaskText: {
    background: 'transparent',
    fontSize: 18,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 0,
    fontWeight: 'bold',
  },
})
