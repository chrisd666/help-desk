import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { InputGroup, FormInput, InputGroupAddon, InputGroupText, Button } from "shards-react";

export default function ReplyBox({ reply, handleInputChange, postReplies, replyButtonDisabled }) {
  const user = useSelector(state => state.user)

  return (
    <div
      className="d-flex"
      style={{
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom: "15px"
      }}
    >
      <img
        style={{width: 30, height: 30}}
        className="rounded-circle border mx-2"
        src={user.profile_image_url || null}
        alt={user.name || ''}
      />

      <InputGroup seamless style={{height: 50}}>
        <FormInput placeholder="Reply..." value={reply} onChange={handleInputChange} />
        <InputGroupAddon type="append">
          <InputGroupText
          >
              <FontAwesomeIcon
                className="h-100"
                style={replyButtonDisabled && {cursor: 'pointer', color: '#007bff'}}
                onClick={!replyButtonDisabled ? postReplies : () => null}
                icon={faPaperPlane}
              />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
