import Loader from "react-loader-spinner";

export default function HitVision(props) {
  return (
    <div>
      {" "}
      {props.hit.topic === undefined ? (
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
          <p>
            <strong>Topic in News:</strong> <br />
            <a
              className="vision-links"
              href={props.hit.link}
              target="_blank"
              rel="noreferrer"
            >
              {props.hit.topic}
            </a>
          </p>
          <div>
            <strong>Source:</strong>{" "}
            {`${props.hit.subject} ${
              props.hit.month ? `(${props.hit.month})` : ""
            }`}
          </div>
        </div>
      )}
    </div>
  );
}
