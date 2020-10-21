import React, { useState } from "react";
import { faChevronDown, faChevronUp, faEnvelope, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormCheckbox, ListGroup, ListGroupItem } from "shards-react";
import { bounce } from 'react-animations';

export default function InfoColumn({ selectedTweet }) {
  const [dropdownOpen, setDropDownOpen] = useState(true)

  const toggleDropdown = () => {
    setDropDownOpen(!dropdownOpen)
  }

  return (
    <div
      className="border rounded"
      style={{
        height: "75vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="mt-2 mr-4" style={selectedTweet ? {width: '100%'} : {display: "none"}}>
        <Button
          pill theme="light" className="p-0 rounded-circle"
          style={{
            height: 30,
            width: 30,
            borderColor: '#f0edeb',
            backgroundColor: '#f0edeb',
            float: "right"
          }
        }>
          <span className="lnr lnr-cross my-3" style={{fontSize: 20}} />
        </Button>
      </div>

      {selectedTweet && (
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "10px"
            }}
          >
            <div style={{overflow: "auto"}}>
              <div className="d-flex flex-column align-items-center mb-4" style={{'margin-top': 10}}>
                <div className="mb-2">
                    <img
                      style={{width: 150, height: 150}}
                      className="rounded-circle border"
                      src={selectedTweet.user.profile_image_url}
                      alt={selectedTweet.user.name}
                    />
                </div>

                <div className="mb-2">
                  <b style={{ marginRight: "10px" }}>{selectedTweet.user.name}</b>
                  {/* <span style={{ color: "#747880"}}>
                    @{selectedTweet.user.screen_name}
                  </span> */}
                </div>

                <div className="text-success mb-2">Online</div>

                <div>
                  <Button pill theme="light" className="ml-4 py-0" style={{height: 30, borderColor: '#f0edeb', backgroundColor: '#f0edeb'}}>
                      <FontAwesomeIcon icon={faPhoneAlt} />
                      <span className="ml-2">Call</span>
                  </Button>

                  <Button pill theme="light" className="ml-4 py-0" style={{height: 30, borderColor: '#f0edeb', backgroundColor: '#f0edeb'}}>
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span className="ml-2">Email</span>
                  </Button>
                </div>
              </div>

              <div className="mt-4" style={{ color: "black" }}>
                <div className="mb-3" style={{ display: "flex", justifyContent: "space-between"}}>
                  <span style={{ color: "#747880" }}>
                    Screen Name
                  </span>
                  <b>
                    @{selectedTweet.user.screen_name}
                  </b>
                </div>

                <div className="mb-3" style={{ display: "flex", justifyContent: "space-between"}}>
                  <span style={{ color: "#747880" }}>Followers</span>
                  <b>{selectedTweet.user.followers_count}</b>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between"}}>
                  <span style={{ color: "#747880" }}>
                    Location
                  </span>
                  <b>
                    {selectedTweet.user.location
                      ? selectedTweet.user.location
                      : "Unknown"}
                  </b>
                </div>
              </div>
            </div>

            <div
              className="border-top d-flex justify-content-center"
              style={{width: '100%', position: 'absolute', bottom: 0}}
            >
              <div style={{width: '80%'}}>
                <div className="d-flex justify-content-between my-3">
                  <span>Tasks</span>
                  <FontAwesomeIcon
                    icon={dropdownOpen ? faChevronDown : faChevronUp}
                    onClick={() => toggleDropdown()}
                  />
                </div>

                <ListGroup
                  className={
                    !dropdownOpen ? 'd-none animate__animated animate__fadeOut'
                      : 'animate__animated animate__fadeIn'}
                  >
                  <ListGroupItem className="border-0 p-0 mb-2">
                    <FormCheckbox
                      checked={false}
                      onChange={e => {}}
                    >
                      <b>Clean up rooms.</b>
                    </FormCheckbox>
                  </ListGroupItem>
                  <ListGroupItem className="border-0 p-0 mb-2">
                    <FormCheckbox
                      checked={false}
                      onChange={e => {}}
                    >
                      <b>Change lines and towels when guests are out.</b>
                    </FormCheckbox>
                  </ListGroupItem>
                  <ListGroupItem className="border-0 p-0 mb-2">
                    <FormCheckbox
                      checked={false}
                      onChange={e => {}}
                    >
                      <b>Bring complimentary bottle of red wine.</b>
                    </FormCheckbox>
                  </ListGroupItem>
                  <ListGroupItem className="border-0 p-0 mb-1">
                    <u><p>ALL TASKS</p></u>
                  </ListGroupItem>
                </ListGroup>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
