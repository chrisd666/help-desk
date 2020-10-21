import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  NavItem,
  NavLink,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "shards-react";
import socketIOClient from "socket.io-client";
import api from "../api/customApi";
import { apiUrl } from "../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { changeLoginState } from "../store/actions";
import Mentions from "../components/mentions/Mentions";
import Tweets from "../components/tweets/Tweets";
import ReplyBox from "../components/replyBox/ReplyBox";
import InfoColumn from "../components/infoColumn/InfoColumn";
import Sidebar from "../components/sidebar/Sidebar";
import 'linearicons/dist/web-font/style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import 'animate.css/animate.min.css'

const HelpDeskScreen = (props) => {
  const store = useSelector(state => state)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState([])
  const [selectedTweet, setSelectedTweet] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [replies, setReplies] = useState({})
  const [isReplyDisabled, setIsReplyDisabled] = useState(false)
  const [reply, setReply] = useState("")
  const [dropdownOpen, setDropDownOpen] = useState(false)

  const fetchTweets = async () => {
    return await api.get(`${apiUrl}/api/twitter/tweets`);
  }

  const fetchUserReplies = async () => {
    return await api.get(`${apiUrl}/api/twitter/user/tweets`);
  };

  const createTweetsThread = async (tweets, userReplies, replies) => {
    let combined = [...tweets, ...userReplies].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let tweet of combined) {
      if (replies[tweet.in_reply_to_status_id])
        replies[tweet.in_reply_to_status_id].push(tweet);
      else {
        for (const replyArrId of Object.keys(replies)) {
          if (
            replies[replyArrId].some(
              reply => reply.id === tweet.in_reply_to_status_id
            )
          ) {
            replies[replyArrId].push(tweet);
            break;
          }
        }
      }
    }
    return replies;
  };

  const handleIncomingReply = tweet => {
    if (replies[tweet.in_reply_to_status_id])
      replies[tweet.in_reply_to_status_id].push(tweet);
    else {
      for (const replyArrId of Object.keys(replies)) {
        if (
          replies[replyArrId].some(
            reply => reply.id === tweet.in_reply_to_status_id
          )
        ) {
          if (replies[replyArrId].some(reply => reply.id === tweet.id)) return;
          replies[replyArrId].push(tweet);
          break;
        }
      }
    }

    setReplies({replies})
  };

  const initSockets = async (user, filteredTweets) => {
    const socket = socketIOClient(apiUrl);
    socket.on("connect", async () => {
      console.log('connection', {screen_name: user.screen_name , token: store.jwtToken, rp: window.localStorage.getItem('rp_token')})

      socket.emit("register_screen_name", {
        term: user.screen_name,
        jwtToken: store.jwtToken || window.localStorage.getItem('rp_token')
      });
      socket.on("tweets", tweet => {
        console.log('TWEET IN')

        if (tweet.in_reply_to_status_id !== null) {
          handleIncomingReply(tweet);
        } else if (!tweets.some(o => o.id === tweet.id)) {
          if (tweets.length > 0) {
            setTweets([tweet, ...tweets])
          } else {
            setTweets([tweet, ...filteredTweets])
          }

        }
      });
    });
    socket.on("disconnect", () => {
      socket.off("tweets");
      socket.removeAllListeners("tweets");
    });
  };

  const init = async () => {
    const usr = user
      ? user
      : await api.get(`${apiUrl}/api/twitter/self`);

    const allTweets = await fetchTweets();
    const [pass, fail] = allTweets.reduce(
      ([p, f], e) =>
        e.in_reply_to_status_id === null ? [[...p, e], f] : [p, [...f, e]],
      [[], []]
    );
    let replies = {};
    pass.forEach(e => (replies[e.id] = []));

    const userReplies = await fetchUserReplies();

    replies = await createTweetsThread(fail, userReplies, replies);

    setIsLoading(false)
    setUser(usr)
    setTweets(pass)
    setReplies(replies)

    initSockets(store.user, pass)
  };

  const handleSelected = (index, tweet) => {
    setSelectedIndex(index)
    setSelectedTweet(tweet)
  };

  const handleReply = str => {
    setReply(str)
  };

  const handleInputChange = event => {
    setReply(event.target.value)
  };

  const postReplies = async query => {
    if (selectedTweet === null) {
      window.alert("Please select a tweet to reply");
      return;
    }

    setIsReplyDisabled(true)

    const { data } = await api.post(
      `${apiUrl}/api/twitter/postReplies`,
      JSON.stringify({
        inReplyToStatusId: query.selectedTweet.id_str,
        status: query.reply
      })
    );
    const replies = { ...query.replies };

    if (!replies[query.selectedTweet.id]) {
      replies[query.selectedTweet.id] = [];
    }
    replies[query.selectedTweet.id].push(data);

    setReply("@" + query.selectedTweet.user.screen_name + " ")
    setReplies(replies)
    setIsReplyDisabled(false)
  };

  const toggleDropdown = () => {
    setDropDownOpen(!dropdownOpen)
  }

  const logout = async () => {
    window.localStorage.clear();

    dispatch(changeLoginState(false, null, ""))

    setTimeout(() => {
      props.history.push("/");
    }, 100);
  };

  useEffect(() => {
    setIsLoading(true)
    init()
  }, [])

  return (
    <div
        className="d-flex"
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <Sidebar />

        <div className="w-100">
        <Navbar type="light" expand="md" className="justify-content-between" style={{paddingLeft: 100, paddingRight: 100}}>
            <Nav navbar>
              <NavItem>
                <NavLink>
                  <u>Updates</u>
                </NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <NavItem className="mr-4">
                <NavLink>Session: 34 minutes</NavLink>
              </NavItem>

              <Dropdown
                className="ml-4"
                open={dropdownOpen}
                toggle={toggleDropdown}
              >
                <DropdownToggle nav caret>
                  User: {store.user.name}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={logout}>Log Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
        </Navbar>

        <div style={{marginRight: 100, marginLeft: 100, marginTop: 90}}
        // className='mt-4'
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <h2 className="my-0 mr-3 font-weight-bold">Tweets</h2>

              <InputGroup seamless style={{height: 30, width: 250}}>
                <InputGroupAddon type="prepend">
                  <InputGroupText>
                    <span className="lnr lnr-magnifier" style={{marginTop: 4}}/>
                  </InputGroupText>
                </InputGroupAddon>
                <FormInput placeholder="Quick Search" style={{borderRadius: 30, height: "100%"}} />
              </InputGroup>

              <Button pill theme="light" className="ml-4 py-0" style={{height: 30, borderColor: '#f0edeb', backgroundColor: '#f0edeb'}}>
                  <FontAwesomeIcon icon={faSlidersH} />
                  <span className="ml-2">Filter</span>
              </Button>
            </div>


            <Button pill theme="light" className="ml-4 p-0 online-button" style={{height: 30, backgroundColor: '#fff'}}>
              <DropdownToggle nav caret className="mx-1 p-0" style={{color: '#212529'}}>
                  <div style={{height: 10, width: 10, display: "inline-block"}} className="bg-success rounded-circle ml-2" />
                  <span className="ml-3">Online</span>

              </DropdownToggle>

            </Button>
          </div>


          <Row>
            <Col lg="3">
              <Mentions
                isLoading={isLoading}
                tweets={tweets}
                selectedIndex={selectedIndex}
                handleReply={handleReply}
                handleSelected={handleSelected}
              />
            </Col>
            <Col lg="6" className='p-0 h-100'>
              <div
                className='border rounded  d-flex flex-column justify-content-between'
                style={{height: '75vh'}}
              >
              {
                    selectedTweet?.user ?
                <div
                  className='border-bottom d-flex align-items-center justify-content-between'
                >

                    <div className='d-flex align-items-center'>
                      <img
                      style={{width: 30, height: 30, marginLeft: 30}}
                      className="rounded-circle border my-2"
                      src={selectedTweet.user.profile_image_url}
                      alt={selectedTweet.user.name}
                      />

                      <b className='m-2'>{selectedTweet.user.name}</b>

                      <div style={{height: 10, width: 10, display: "inline-block"}} className="bg-success rounded-circle ml-1" />
                    </div>


                    <span>Room: 102</span>
                    <span>Oct 1 -- Oct 12</span>

                    <Button
                      pill theme="light" className="ml-4 py-0"
                      style={{
                        marginRight: 30,
                        height: 30,
                        borderColor: '#f0edeb',
                        backgroundColor: '#f0edeb'
                      }}>
                        <span className="ml-2">Create a task</span>
                    </Button>

                </div>
                : <div style={{height: 47}} className='border-bottom d-flex flex-row' />

              }

                <Tweets
                  isLoading={isLoading}
                  selectedTweet={selectedTweet}
                  replies={replies}
                />

                <ReplyBox
                  reply={reply}
                  replyButtonDisabled={isReplyDisabled}
                  handleInputChange={handleInputChange}
                  postReplies={() => {
                    postReplies({ reply, selectedTweet, replies });
                  }}
                />
              </div>
            </Col>
            <Col lg="3" className='p-0'>
              <InfoColumn  selectedTweet={selectedTweet} />
            </Col>
          </Row>
          </div>
        </div>
      </div>
  )
}

export default HelpDeskScreen;
