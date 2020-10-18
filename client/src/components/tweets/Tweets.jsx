import React from "react";
import TweetItem from "../tweetItem/TweetItem";

export default function Tweets({ isLoading, selectedTweet, replies }) {
  return (
    <div style={{
      //  height: "70vh",
       overflow: "auto", margin: 20, height: '100%' }}>
      <div>
        {isLoading ? (
          '...'
        ) : selectedTweet ? (
          <TweetItem
            item={selectedTweet}
          ></TweetItem>
        ) : (
          <span style={{ margin: "auto"}}>Select a tweet to view conversation</span>
        )}
        {replies &&
          selectedTweet &&
          replies[selectedTweet.id] &&
          replies[selectedTweet.id].map((o, i) => (
            <TweetItem
              key={o.id_str}
              item={o}
            ></TweetItem>
          ))}
      </div>
    </div>
  );
}
