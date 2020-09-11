import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { getDimRatio } from '../app/DynamicSizing'


function Confirmation (props) {

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
      style={styles()}
    >
      <div style={styles().confirmationWrapper}>
        <div style={styles().titleConfirmation}>Are you sure?</div>
        <div style={styles().choiceContainerConfirmation}>
          <div 
            style={styles().buttonCancelConfirmation}
            onClick={props.onClose}
            onMouseOver={(event) => {
              event.target.style.background = '#58FAD0'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#32A3BC'
            }}
          >
            Dismiss
          </div>
          <div 
            style={styles().buttonDeleteConfirmation} 
            onClick={props.onDelete}
            onMouseOver={(event) => {
              event.target.style.background = '#F5A9A9'
            }}
            onMouseLeave={(event) => {
              event.target.style.background = '#F51111'
            }}
          >
            Delete
          </div>
        </div>
      </div>
    </Modal>

  )
}

function DeleteButton(props) {
  const [modalOpen, setModalOpen] = React.useState(false)

  useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  const onDelete = () => {
    if (modalOpen) return 
    else if (props.confirm) setModalOpen(true)
    else props.onDelete()
  }

  return (
    <div>
      <Confirmation 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onDelete={() => {
          setModalOpen(false)
          props.onDelete()
        }}
      />
    <div 
      onClick={onDelete}
      style={styles().deleteButton}
      onMouseOver={(event) => event.target.style.background = '#F2F2F2'}
      onMouseLeave={(event) => event.target.style.background = 'white'}
    >
      <img 
        className='deleteTask' 
        alt='delete' 
        src='/trash.png'
        width={props.width}
        height={props.height} />
    </div>
    </div>
  )
}


const styles = () => ({
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    cursor: 'pointer',
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: 'transparent',
  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    borderRadius: 20,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
  confirmationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    background: 'white',
    width: 200 * getDimRatio().X,
    height: 100 * getDimRatio().X,
  },
  titleConfirmation: {
    fontSize: 25 * getDimRatio().X,
    fontWeight: 'bold',
  },
  choiceContainerConfirmation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonDeleteConfirmation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#F51111',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatio().X,
    marginLeft: 5,
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
  buttonCancelConfirmation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    background: '#32A3BC',
    height: 30* getDimRatio().Y,
    width: 60 * getDimRatio().X,
    fontSize: 15 * getDimRatio().X,
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 0,
    borderRadius: 20,
  },
})

export default DeleteButton
