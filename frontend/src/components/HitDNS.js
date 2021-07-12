import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function HitDNS(props) {
  return (
    <>
      {props.hit.link === undefined ? (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          visible={true}
          style={{
            textAlign: "center",
          }}
        />
      ) : (
        <div className="dns-video">
          <h3 className="dns-title">{props.hit.title}</h3>
          <div className="dns-video-container">
            <iframe
              title={props.hit.title}
              src={props.hit.link
                .replace("/watch?v=", "/embed/")
                .replace("&t=", "?start=")}
              frameborder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
