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
      socket.emit("register_screen_name", {
        term: user.screen_name,
        jwtToken: store.jwtToken
      });
      socket.on("tweets", tweet => {
        if (tweet.in_reply_to_status_id !== null) {
          handleIncomingReply(tweet);
        } else if (!tweets.some(o => o.id === tweet.id)) {
          setTweets([tweet, ...filteredTweets])
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
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <Navbar type="light" expand="md">
          <div  className="ml-auto" style={{"margin-right": 100, "margin-left": 100}}>
            <Nav navbar className="ml-auto">
              <Dropdown
              open={dropdownOpen}
              toggle={toggleDropdown}
            >
              <DropdownToggle nav caret>
                {store.user.name}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={logout}>Log Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            </Nav>
          </div>
        </Navbar>

        <div style={{"margin-right": 100, "margin-left": 100}} className='mt-4'>
          <h1>Tweets</h1>

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
                style={{height: '85vh'}}
              >
              {
                    selectedTweet?.user ?
                <div className='border-bottom d-flex flex-row'>


                    <img
                    style={{width: 30, height: 30, marginLeft: 30}}
                    className="rounded-circle border my-2"
                    src={selectedTweet.user.profile_image_url}
                    alt={selectedTweet.user.name}
                    />

                    <b className='m-2'>{selectedTweet.user.name}</b>


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
  )
}

export default HelpDeskScreen;
