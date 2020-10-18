import React from "react";
import moment from "moment";

function TweetItem({ style, item }) {
  return (
    <div
      style={{
        margin: 10,
        display: "flex",
        'justify-content': 'space-between'
      }}
    >
      <div className="d-flex">
        <img
            style={{width: 30, height: 30}}
            className="rounded-circle border"
            src={item.user.profile_image_url}
            alt={item.user.name}
          />

        <b
          style={{
            fontSize: "1em",
          }}
          className="user-tweet ml-2"
        >
          {item.text}
        </b>
      </div>

      <p className="created-at" style={{ fontSize: "0.8em" }}>
            {moment(item.created_at).fromNow()}
      </p>
    </div>
  );
}

export default TweetItem;
