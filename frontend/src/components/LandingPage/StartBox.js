const StartBox = () => {
  const HandleClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="start-box">
      <div className="start-title">So where do we start ?</div>
      <div className="start-btn">
        <button
          className="current-user-auth-btn black-btn"
          onClick={HandleClick}
        >
          RIGHT HERE
        </button>
      </div>
    </div>
  );
};

export default StartBox;
