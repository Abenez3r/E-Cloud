import React, { useState, useEffect } from "react";
import { Container, ListGroup } from "reactstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { getUserFiles } from "../functions/RDSFunctions";
import { getAuthInfo } from "../functions/AuthFunctions";
import File from "./File";
import NewModal from "./NewModal";

function FileList(props) {
  const [items, setItems] = useState([]);
  const [modalShown, setModalShown] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Fetch user files on component mount
  useEffect(() => {
    renderObjects();
  }, []);

  async function renderObjects() {
    let userId = await getAuthInfo();
    let userFiles = await getUserFiles(userId);
    setItems(userFiles);
  }

  // Function to toggle the edit modal
  function toggleShowEditModal(item) {
    setItemToEdit(item);
    setModalShown(true);
  }

  return (
    <Container>
      <NewModal
        showEditModal={modalShown}
        item={itemToEdit}
        toggleShowEditModal={() => setModalShown(false)}
      />
      <ListGroup>
        <TransitionGroup>
          {items.map((item, index) => (
            <CSSTransition key={index} timeout={500} classNames="fade">
              <File item={item} toggleShowEditModal={toggleShowEditModal} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroup>
    </Container>
  );
}

export default FileList;
