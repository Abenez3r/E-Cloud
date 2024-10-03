import React, { useState, useEffect } from "react";
import { Container, Button, Row, Input } from "reactstrap";
import { getAuthInfo } from "../functions/AuthFunctions";
import { uploadObject } from "../functions/S3Functions";
import { addFileToTable } from "../functions/RDSFunctions";

function UploadView(appProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState();
  const [size, setSize] = useState();
  const [description, setDescription] = useState("");
  const [fileValid, setFileValid] = useState(true);
  const [userId, setUserId] = useState();

  // Fetch user ID on component mount
  useEffect(() => {
    async function storeUserId() {
      setUserId(await getAuthInfo());
    }
    storeUserId();
  }, []);

  // Handle file upload
  async function uploadFile() {
    let fileId = await uploadObject(file);
    await addFileToTable({
      file_user_id: userId,
      file_id: fileId.key,
      title: title ? title : file.name,
      size: size,
      file_description: description,
    });
    alert("File successfully uploaded!");
  }

  // Handle file input change
  function onFileChange(e) {
    if (!e.target.files[0]) return;
    setFile(e.target.files[0]);
    if (e.target.files[0].size > 1e7) {
      setFileValid(false);
    } else {
      setSize(e.target.files[0].size);
      if (!fileValid) {
        setFileValid(true);
      }
    }
  }

  // Check if upload is allowed
  function isUploadAllowed() {
    return file && fileValid;
  }

  return (
    <Container>
      <p>Drop your files here!</p>
      <Row style={{ padding: 10 }}>
        <Input
          placeholder="What should we call this?"
          onChange={(e) => setTitle(e.target.value)}
        />
      </Row>
      <Row style={{ padding: 10 }}>
        <Input type="file" onChange={onFileChange} />
      </Row>
      <Row style={{ padding: 10 }}>
        <Input
          placeholder="What is this?"
          type="textarea"
          onChange={(e) => setDescription(e.target.value)}
        />
      </Row>
      <Row style={{ padding: 10 }}>
        <Button
          style={
            fileValid
              ? { backgroundColor: "#c0d6df" }
              : { backgroundColor: "danger" }
          }
          disabled={!isUploadAllowed()}
          onClick={uploadFile}
        >
          {fileValid ? "Upload" : "File too big! (>10MB)."}
        </Button>
      </Row>
    </Container>
  );
}

export default UploadView;
