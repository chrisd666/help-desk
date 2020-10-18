import React from 'react';
import MentionItem from '../mentionItem/MentionItem';

const Mentions = ({ isLoading, tweets, selectedIndex, handleReply, handleSelected }) => {
  return (
    <div style={{ height: "92vh", overflow: "scroll" }}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          padding: 0
        }}
      >

        {
          tweets.length > 0 ? (
            tweets.map((o, i) => (
              <MentionItem
              key={i.toString()}
              tweet={o}
              selectedIndex={selectedIndex}
              handleReply={s => handleReply(s)}
              handleSelected={(id_str, o) => handleSelected(id_str, o)}
            />

            ))
          ) : (
            <span>No mentioned tweets found</span>
          )
        }
      </div>
    </div>
  );
}

export default Mentions