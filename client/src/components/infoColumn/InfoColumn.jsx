import React from "react";

export default function InfoColumn({ selectedTweet }) {
  return (
    <div
      className="border rounded"
      style={{
        height: "85vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
            <div style={{'margin-top': 50}}>
                <img
                  style={{width: 150, height: 150}}
                  className="rounded-circle border mb-3"
                  src={selectedTweet.user.profile_image_url}
                  alt={selectedTweet.user.name}
                />
            </div>

            <div>
              <b style={{ margin: "6px" }}>{selectedTweet.user.name}</b>
              <span style={{ color: "#747880", margin: "6px" }}>
                @{selectedTweet.user.screen_name}
              </span>
            </div>

            <span style={{ color: "black" }}>
              {selectedTweet.user.followers_count}{" "}
              <span style={{ color: "#747880" }}>Followers</span>
            </span>

            <div style={{ display: "flex", flexDirection: "row", margin: "5px" }}>
              <span style={{ color: "#747880" }}>
                {selectedTweet.user.location
                  ? selectedTweet.user.location
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
