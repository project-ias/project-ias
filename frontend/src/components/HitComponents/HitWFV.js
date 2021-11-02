import Loader from "react-loader-spinner";

export default function HitWFV(props) {
  return (
    <div>
      {" "}
      {props.hit.topics === undefined ? (
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
            <strong>Topics:</strong> {props.hit.topics}
          </p>
          <div className="wfv-links-div">
            <a
              className="wfv-links"
              href={props.hit.link}
              target="_blank"
              rel="noreferrer"
            >
              Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
