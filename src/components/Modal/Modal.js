import { Modal, Button } from "react-bootstrap";
import { useEffect, forwardRef, useRef, useImperativeHandle } from "react";
import { useState } from "react";
function ModalForm(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    props.reset();
    setShow(false);
  };
  const handleShow = () => {
    if (props.prepare) {
      props.prepare();
    }
    console.log(props.size);
    setShow(true);
  };
  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          handleShow();
        }}
      >
        {props.icon}
      </Button>

      <Modal size={props.size} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.handleSubmit();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalForm;
