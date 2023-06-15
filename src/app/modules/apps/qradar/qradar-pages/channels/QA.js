import React, { useState, useEffect, useRef } from "react";
import {
  fetchQuestions,
  fetchQuestionsAdd,
  fetchQuestionsAnswerAdd,
} from "../../../../../api/ChannelApi";
import { Modal, Button, Form } from "react-bootstrap";

const QA = ({ channelId, channelName }) => {
  const createdUserId = Number(sessionStorage.getItem("userId"));
  const createdDate = new Date().toISOString();
  const orgId = Number(sessionStorage.getItem("orgId"));
  const [channelQAList, setChannelQAList] = useState([]);
  console.log(channelQAList, "channelQAList");
  const [error, setError] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const questionTextRef = useRef();
  const answerTextRef = useRef();
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  console.log(selectedQuestionId, "selectedQuestionId");

  const fetchChannelQuestions = () => {
    const data = { channelId, orgId };

    fetchQuestions(data)
      .then((channelQAList) => {
        setChannelQAList(channelQAList);
      })
      .catch((error) => {
        console.log(error);
        setError("Error occurred while fetching channel sub-item data");
      });
  };

  useEffect(() => {
    fetchChannelQuestions();
  }, [channelId]);

  const handlePostQuestion = () => {
    const data = {
      channelId,
      orgId,
      createdDate,
      createdUserId,
      questionDescription: questionTextRef.current.value,
    };

    fetchQuestionsAdd(data)
      .then(() => {
        setShowQuestionModal(false);
        fetchChannelQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddAnswer = () => {
    const data = {
      channelId,
      orgId,
      createdDate,
      createdUserId,
      channelQuestionId: selectedQuestionId,
      answerDescription: answerTextRef.current.value,
    };

    fetchQuestionsAnswerAdd(data)
      .then(() => {
        setShowAnswerModal(false);
        fetchChannelQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="clearfix">
        <p className="float-left channel-heading">
          <strong>{channelName}</strong>
        </p>
        <button
          className="btn btn-channel float-right btn-primary"
          onClick={() => setShowQuestionModal(true)}
        >
          Post a Question
        </button>
      </div>

      <div className="qa mt-5">
        {channelQAList.map((item) => (
          <div className="row" key={item.questionId}>
            <div className="col">
              <p className="question">
                <b>Q:</b> {item.questionDescription}
                <span className="action float-right">
                  <i className="fa fa-pencil" title="Edit" />
                  <i className="fa fa-trash" title="Delete" />
                </span>
              </p>
              {item.answerDescription && (
                <p className="answer">
                  <b>A:</b> {item.answerDescription}
                  <span className="action float-right">
                    <i className="fa fa-pencil" title="Edit" />
                    <i className="fa fa-trash" title="Delete" />
                  </span>
                </p>
              )}
              {!item.answerDescription && (
                <p className="answer">
                  <button
                    className="btn btn-channel btn-primary"
                    onClick={() => {
                      setSelectedQuestionId(item.questionId);
                      setShowAnswerModal(true);
                    }}
                  >
                    Add your answer
                  </button>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Post a Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="questionText">
              <Form.Label>Question</Form.Label>
              <Form.Control type="text" ref={questionTextRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowQuestionModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handlePostQuestion}>
            Post Question
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAnswerModal} onHide={() => setShowAnswerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="answerText">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" ref={answerTextRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnswerModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddAnswer}>
            Add Answer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QA;
