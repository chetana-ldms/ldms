import React, {useState, useEffect, useRef} from 'react'
import {
  fetcQuestionDetails,
  fetchAnswerDetails,
  fetchQuestions,
  fetchQuestionsAdd,
  fetchQuestionsAnswerAdd,
  fetchQuestionsAnswerDelete,
  fetchQuestionsAnswereUpdate,
  fetchQuestionsDelete,
  fetchQuestionsUpdate,
} from '../../../../../api/ChannelApi'
import {Modal, Button, Form} from 'react-bootstrap'
import {useErrorBoundary} from 'react-error-boundary'
import {notify, notifyFail} from '../components/notification/Notification'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteConfirmation from '../../../../../../utils/DeleteConfirmation'

const QA = ({channelId, channelName}) => {
  const handleError = useErrorBoundary()
  const createdUserId = Number(sessionStorage.getItem('userId'))
  const createdDate = new Date().toISOString()
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [channelQAList, setChannelQAList] = useState([])
  console.log(channelQAList, 'channelQAList')
  const [error, setError] = useState(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false)
  const [showEditAnswerModal, setShowEditAnswerModal] = useState('')
  const [answerText, setAnswerText] = useState('')
  const questionTextRef = useRef()
  const answerTextRef = useRef()
  const EditQuestionTextRef = useRef()
  const EditanswerTextRef = useRef()
  const [selectedQuestionId, setSelectedQuestionId] = useState(null)
  const [selectedAnswerId, setSelectedAnswerId] = useState(null)
  const [selectedQuestionData, setSelectedQuestionData] = useState(null)
  const [selectedAnswerData, setSelectedAnswerData] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deleteType, setDeleteType] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const fetchChannelQuestions = () => {
    const data = {channelId, orgId}

    fetchQuestions(data)
      .then((channelQAList) => {
        setChannelQAList(channelQAList)
      })
      .catch((error) => {
        handleError(error)
        setError('Error occurred while fetching channel sub-item data')
      })
  }

  useEffect(() => {
    fetchChannelQuestions()
  }, [channelId])
  useEffect(() => {
    if (showEditQuestionModal && selectedQuestionId) {
      const responce = fetcQuestionDetails(selectedQuestionId)
        .then((response) => {
          setSelectedQuestionData(response)
        })
        .catch((error) => {
          handleError(error)
        })
    }
    if (showEditModal && selectedAnswerId) {
      const responce = fetchAnswerDetails(selectedAnswerId)
        .then((response) => {
          setSelectedAnswerData(response)
        })
        .catch((error) => {
          handleError(error)
        })
    }
  }, [showEditQuestionModal, selectedQuestionId, showEditModal, selectedAnswerId])

  const handlePostQuestion = async () => {
    if (!questionTextRef.current.value) {
      notifyFail('Please enter the question')
      return
    }

    const data = {
      channelId,
      orgId,
      createdDate,
      createdUserId,
      questionDescription: questionTextRef.current.value,
    }

    try {
      const response = await fetchQuestionsAdd(data)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        setShowQuestionModal(false)
        fetchChannelQuestions()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddAnswer = async () => {
    if (!answerTextRef.current.value) {
      notifyFail('Please enter the Answer')
      return
    }

    const data = {
      channelId,
      orgId,
      createdDate,
      createdUserId,
      channelQuestionId: selectedQuestionId,
      answerDescription: answerTextRef.current.value,
    }

    try {
      const response = await fetchQuestionsAnswerAdd(data)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        setShowAnswerModal(false)
        fetchChannelQuestions()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleEditQuestion = async () => {
    if (!EditQuestionTextRef.current.value) {
      notifyFail('Please enter the Question')
      return
    }
    const data = {
      channelId,
      orgId,
      modifiedDate: createdDate,
      modifiedUserId: createdUserId,
      questionId: selectedQuestionId,
      questionDescription: EditQuestionTextRef.current.value,
    }

    try {
      const response = await fetchQuestionsUpdate(data)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        setShowEditQuestionModal(false)
        fetchChannelQuestions()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleDelete = (type, id) => {
    setDeleteType(type)
    setSelectedId(id)
    setShowConfirmation(true)
  }

  const confirmDelete = async () => {
    const data = {
      deletedDate: createdDate,
      deletedUserId: createdUserId,
    }

    if (deleteType === 'question') {
      data.questionId = selectedId
    } else if (deleteType === 'answer') {
      data.answerId = selectedId
    }

    try {
      const response =
        deleteType === 'question'
          ? await fetchQuestionsDelete(data)
          : await fetchQuestionsAnswerDelete(data)

      const {isSuccess, message} = response
      if (isSuccess) {
        notify(message)
        fetchChannelQuestions()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setShowConfirmation(false)
    }
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
  }
  const handleEditAnswer = async () => {
    if (!EditanswerTextRef.current.value) {
      notifyFail('Please enter the Answer')
      return
    }
    const data = {
      channelId,
      orgId,
      modifiedDate: createdDate,
      modifiedUserId: createdUserId,
      questionId: selectedQuestionId,
      answerDescription: EditanswerTextRef.current.value,
      answerId: selectedAnswerId,
    }

    try {
      const response = await fetchQuestionsAnswereUpdate(data)
      const {isSuccess, message} = response

      if (isSuccess) {
        notify(message)
        setShowEditModal(false)
        fetchChannelQuestions()
      } else {
        notifyFail(message)
      }
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className='clearfix'>
        <p className='float-left channel-heading'>
          <strong>{channelName}</strong>
        </p>
        <button
          className='btn-small btn-channel float-right btn-new'
          onClick={() => setShowQuestionModal(true)}
        >
          Post a Question
        </button>
      </div>

      <div className='qa mt-5'>
        {channelQAList !== null ? (
          channelQAList.map((item) => (
            <div className='row' key={item.questionId}>
              <div className='col'>
                <p className='question'>
                  <b>Q:</b> {item.questionDescription}
                  <span className='action float-right'>
                    <i
                      className='fa fa-pencil'
                      title='Edit'
                      onClick={() => {
                        setSelectedQuestionId(item.questionId)
                        setShowEditQuestionModal(true)
                      }}
                      style={{
                        display: createdUserId === 1 ? 'inline-block' : 'none',
                      }}
                    />
                    <i
                      className='fa fa-trash'
                      title='Delete'
                      onClick={() => handleDelete('question', item.questionId)}
                      style={{
                        display: createdUserId === 1 ? 'inline-block' : 'none',
                      }}
                    />
                  </span>
                </p>
                {item.answerDescription && (
                  <p className='answer'>
                    <b>A:</b> {item.answerDescription}
                    <span className='action float-right'>
                      <i
                        className='fa fa-pencil'
                        title='Edit'
                        onClick={() => {
                          setSelectedQuestionId(item.questionId)
                          setSelectedAnswerId(item.answerId)
                          setShowEditModal(true)
                        }}
                        style={{
                          display: createdUserId === 1 ? 'inline-block' : 'none',
                        }}
                      />
                      <i
                        className='fa fa-trash'
                        title='Delete'
                        onClick={() => handleDelete('answer', item.answerId)}
                        style={{
                          display: createdUserId === 1 ? 'inline-block' : 'none',
                        }}
                      />
                    </span>
                  </p>
                )}
                {!item.answerDescription && (
                  <p className='answer'>
                    <button
                      className='btn btn-channel btn-primary'
                      onClick={() => {
                        setSelectedQuestionId(item.questionId)
                        setShowAnswerModal(true)
                      }}
                    >
                      Add your answer
                    </button>
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No Data found</div>
        )}
        {showConfirmation && (
          <DeleteConfirmation
            show={showConfirmation}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>

      <Modal
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
        className='application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Post a Question</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form className='form-section'>
            <Form.Group controlId='questionText'>
              <Form.Label>Question</Form.Label>
              <Form.Control type='text' ref={questionTextRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn-secondary btn-small' onClick={() => setShowQuestionModal(false)}>
            Close
          </Button>
          <Button className='btn-new btn-small' onClick={handlePostQuestion}>
            Post Question
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAnswerModal} onHide={() => setShowAnswerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='form-section'>
            <Form.Group controlId='answerText'>
              <Form.Label>Answer</Form.Label>
              <Form.Control type='text' ref={answerTextRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowAnswerModal(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={handleAddAnswer}>
            Add Answer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditQuestionModal}
        onHide={() => setShowEditQuestionModal(false)}
        className='application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestionData ? (
            <Form className='form-section'>
              <Form.Group controlId='questionText'>
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type='text'
                  defaultValue={selectedQuestionData.questionDescription}
                  ref={EditQuestionTextRef}
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Loading question data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            className='btn-small'
            onClick={() => setShowEditQuestionModal(false)}
          >
            Close
          </Button>
          <Button className='btn-new btn-small' onClick={handleEditQuestion}>
            Save Question
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className='application-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Your Answer</Modal.Title>
          <button type='button' class='application-modal-close' aria-label='Close'>
            <i className='fa fa-close' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form className='form-section'>
            <Form.Group controlId='answerText'>
              <Form.Label>Answer</Form.Label>
              <Form.Control
                type='text'
                defaultValue={selectedAnswerData?.answerDescription}
                ref={EditanswerTextRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' className='btn-small' onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button className='btn-new btn-small' onClick={handleEditAnswer}>
            Save Answer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default QA
