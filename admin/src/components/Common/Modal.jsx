import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody,Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
export function MyVerticallyCenteredModal(props) {
    const { data, id,show } = props;
    const [modalData, setModalData] = useState(data);
    const [modal, setModal] = useState(show);
    const  toggle=()=> {
        setModal(!modal);
    }

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalBody>
                    lorem ipsum
                </ModalBody>
            </Modal>
        </div>
    )
}