import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";

export default function HitSecure(props) {
  return (
    <div>
      {props.hit.ques === undefined ? (
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
        <div>
          <Highlight attribute="ques" hit={props.hit} />
          <p>
            <strong>Topics:</strong> {props.hit.topic}
          </p>
          <div className="secure-links-div">
            <a
              className="secure-links"
              href={props.hit.link}
              target="_blank"
              rel="noreferrer"
            >
              Link
            </a>
            <a
              className="secure-links"
              href={props.hit.ref}
              target="_blank"
              rel="noreferrer"
            >
              Reference
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
