import React from "react";
import { ListGroupItem, Row, Col, Button } from "reactstrap";
import { CSSTransition } from "react-transition-group";
import { getDownloadUrl } from "../functions/S3Functions";

export function File(props) {
  // Function to open the edit modal
  function toggleShowEditModal(item) {
    props.toggleShowEditModal(item);
  }

  // Function to download the file
  async function downloadFile() {
    let url = await getDownloadUrl(props.item.file_id);
    window.open(url);
  }

  return (
    <CSSTransition timeout={500} classNames="fade">
      <ListGroupItem id={`itemtype-${props.item.key}`}>
        <div style={{ display: "inline-block", width: "90%" }}>
          <Row>
            <div style={{ float: "left" }}>
              <Row>
                <h3>{props.item.title}</h3>
              </Row>
              <Row style={{ border: ".5px solid gray" }}>
                <Col>
                  <p>Size: {props.item.size} bytes</p>
                </Col>
                <Col>
                  <p>Last Modified: {props.item.updated_time}</p>
                </Col>
                <Col>
                  <p>Uploaded: {props.item.uploaded_time}</p>
                </Col>
              </Row>
              <Row>
                {props.item.description && (
                  <p style={{ fontStyle: "italic" }}>{props.item.description}</p>
                )}
              </Row>
            </div>
          </Row>
          <Row style={{ float: "right" }}>
            <Button
              className={"btn btn-warning float-right"}
              onClick={downloadFile}
            >
              Download
            </Button>
            <Button
              className={"btn btn-info float-right"}
              onClick={() => toggleShowEditModal(props.item)}
            >
              Edit
            </Button>
          </Row>
        </div>
      </ListGroupItem>
    </CSSTransition>
  );
}

export default File;
