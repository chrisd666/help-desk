import React from "react";
import moment from "moment";
import { Card, CardBody, Col, Row } from "shards-react";

const MentionItem = ({ tweet, handleReply, selectedIndex, handleSelected }) => {
  return (
      <Card
        className="mx-3 my-2 border rounded"
        style={selectedIndex === tweet.id_str ? {'background-color': '#f0edeb'} : {'background-color': '#fff'}}
      >
        <CardBody className="p-3">
          <div
            key={tweet.id.toString()}
            onClick={() => {
              handleReply("@" + tweet.user.screen_name + " ");
              handleSelected(tweet.id_str, tweet);
            }}
          >
            <Row>
              <Col lg="2">
                  <img
                  style={{width: 30, height: 30}}
                  className="rounded-circle border"
                  src={tweet.user.profile_image_url}
                  alt={tweet.user.name}
                />
              </Col>

              <Col lg="8">
                <div style={{ marginLeft: "10px"}}>
                  <b style={{ fontSize: "1em" }}>
                    {tweet.user.name}{" "}
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: "0.8em"
                      }}
                    >
                      {moment(tweet.created_at).fromNow()}
                    </span>
                  </b>
                  <p>
                    <span style={{ fontSize: "0.8em" }}>{tweet.text}</span>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

  );
}

export default MentionItem;