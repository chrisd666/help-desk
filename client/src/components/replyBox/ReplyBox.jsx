import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { InputGroup, FormInput, InputGroupAddon, InputGroupText, Button } from "shards-react";

export default function ReplyBox({ reply, handleInputChange, postReplies, replyButtonDisabled }) {

  return (
    <div
      style={{
        marginLeft: "10px",
        marginRight: "10px",
        marginBottom: "15px"
      }}
    >
      <InputGroup seamless>
        <FormInput placeholder="Reply..." value={reply} onChange={handleInputChange} />
        <InputGroupAddon type="append">
          <InputGroupText
          >
              <FontAwesomeIcon
              style={replyButtonDisabled && {cursor: 'pointer', color: '#007bff'}}
              onClick={!replyButtonDisabled ? postReplies : () => null}
              icon={faPaperPlane} />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
