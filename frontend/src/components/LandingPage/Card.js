const Card = (props) => {
    return (
        <div className={`landing-card landing-card-${props.accent}`}>
            <div className="landing-card-title">{props.title}</div>
            <div className="landing-card-text">{props.text}</div>
        </div>
    )
}

export default Card;