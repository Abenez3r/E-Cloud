import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
} from "reactstrap";
import { updateObject, deleteObject } from "../functions/S3Functions";
import { deleteFile, updateFile } from "../functions/RDSFunctions";
import { getAuthInfo } from "../functions/AuthFunctions";

function NewModal(props) {
  const [userId, setUserId] = useState();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState();
  const [itemExists, setItemExists] = useState(false);
  const [showSavedOrDeletedModal, setShowSavedOrDeletedModal] = useState(false);
  const [fileValid, setFileValid] = useState(true);
  const [size, setSize] = useState(0);
  const [description, setDescription] = useState("");

  // Fetch user ID on component mount
  useEffect(() => {
    async function getUserId() {
      if (!props.showEditModal) return;
      setUserId(await getAuthInfo());
    }
    getUserId();
  }, [props.showEditModal]);

  // Form fields for editing
  let itemFields = props.item
    ? [
        {
          name: "Title",
          defaultValue: props.item.title,
          callback: (e) => setTitle(e.target.value),
          inputType: "text",
        },
        {
          name: "File",
          defaultValue: props.item.file,
          callback: onFileChange,
          inputType: "file",
        },
        {
          name: "Description",
          defaultValue: props.item.description,
          callback: (e) => setDescription(e.target.value),
          inputType: "textarea",
        },
      ]
    : [];

  // Handle file input change
  function onFileChange(e) {
    if (!e.target.files[0]) return;
    if (e.target.files[0].size > 1e7) {
      setFileValid(false);
    } else {
      setFile(e.target.files[0]);
      setSize(e.target.files[0].size);
      if (!fileValid) {
        setFileValid(true);
      }
    }
  }

  // Handle file deletion
  function handleDelete() {
    deleteObject(props.item.file_id);
    deleteFile(userId, props.item.entry_id);
    setShowSavedOrDeletedModal(true);
  }

  // Check if values have been updated
  function isUpdated(newVal, oldVal) {
    if (!newVal) return undefined;
    return newVal !== oldVal ? newVal : undefined;
  }

  // Handle saving updates
  async function handleSave() {
    let fileId = undefined;
    if (file) {
      fileId = await updateObject(file, props.item.file_id);
    }
    const newData = {
      entryId: props.item.entry_id,
      userId: userId,
      title: isUpdated(title.trim(), props.item.title.trim()),
      fileName: fileId ? fileId.key : "",
      size: isUpdated(size, props.item.size),
      description: isUpdated(description.trim(), props.item.description.trim()),
    };
    updateFile(newData);
    setShowSavedOrDeletedModal(true);
    setItemExists(true);
  }

  return (
    props.showEditModal && (
      <React.Fragment>
        <Modal
          isOpen={showSavedOrDeletedModal}
          toggle={() => setShowSavedOrDeletedModal(!showSavedOrDeletedModal)}
        >
          <ModalHeader>Item {itemExists ? "Saved" : "Deleted"}.</ModalHeader>
          <ModalFooter>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={props.showEditModal}
          toggle={props.toggleShowEditModal}
        >
          <Form>
            <ModalHeader>Edit Item</ModalHeader>
            <ModalBody>
              {itemFields.map((field, index) => (
                <Input
                  key={index}
                  placeholder={field.name}
                  onChange={field.callback}
                  defaultValue={field.defaultValue}
                  type={field.inputType}
                />
              ))}
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={!fileValid}
                color="primary"
                onClick={handleSave}
              >
                {fileValid ? "Save" : "File Too Large"}
              </Button>
              <Button color="danger" onClick={handleDelete}>
                Delete File
              </Button>
              <Button color="secondary" onClick={props.toggleShowEditModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </React.Fragment>
    )
  );
}

export default NewModal;
