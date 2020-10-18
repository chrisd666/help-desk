import React, { useState, useEffect } from "react";
import {
  Card,
  CardSubtitle,
  CardTitle,
  CardBody,
  Button
} from "shards-react";
import api from "../api/customApi";
import { apiUrl } from "../api/endpoints";
import { useDispatch } from "react-redux";
import { changeLoginState } from "../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const login = async () => {
  const res = await api.post(`${apiUrl}/api/auth/twitter/reverse`);
  if (res.data && res.data.oauth_token) {
    window.location.href =
      "https://api.twitter.com/oauth/authenticate?oauth_token=" +
      res.data.oauth_token;
  } else {
    window.alert("ERROR : " + res.message);
  }
};

const AuthScreen = (props) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false);

  const verify = async (query, props) => {
    setLoading(true);
    const res = await api.post(
      `${apiUrl}/api/auth/twitter`,
      JSON.stringify({ ...query })
    );

    if (!res.headers["x-auth-token"]) {
      window.alert("Please try again later");
      dispatch(changeLoginState(false, null, null))
      return;
    } else {
      window.localStorage.setItem('rp_token', res.headers["x-auth-token"])
      const user = await api.get(`${apiUrl}/api/twitter/self`);

      dispatch(changeLoginState(true, user, res.headers["x-auth-token"]))
      props.history.push("/desk");
    }
  };

  useEffect(() => {
    var search = window.location.search.substring(1);
    if (search) {
      const query = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );
      if (query && Object.keys(query).length > 0) {
        verify(query, props);
      }
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F7F7"
      }}
    >
      <Card>
        <CardBody className='text-center'>
          <CardTitle>Welcome to Help Desk</CardTitle>
          <CardSubtitle >Please Log In to continue</CardSubtitle>
            <Button
            className='my-3'
            outline pill
            onClick={() => login()}
            >
              <FontAwesomeIcon className='mr-1' icon={faTwitter} />
              <span>Log In</span>
            </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default AuthScreen;
