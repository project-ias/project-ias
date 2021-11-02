import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useWindowDimensions from "../../helpers/WindowDimensions";

const CardData = [
  {
    text: "Once you have an idea of what the UPSC demands are (After analysing PYQs and Syllabus) you can start reading news papers and current affairs.",
    author: "Junaid Ahmad",
    misc: "IAS Rank 3 | CSE 2018",
  },
  {
    text: "Syllabus and PYQ papers, they are very very important. They will give you an idea what UPSC is asking and what is the demand of UPSC. The easier it is for you to understand, the easier it will be to pass the exam.",
    author: "Junaid Ahmad",
    misc: "IAS Rank 3 | CSE 2018",
  },
  {
    text: "Knowing the syllabus and PYQs help you a create visual map of the enemy's base (UPSC Exam), you have to conquer",
    author: "Gaurav Kaushal",
    misc: "UPSC | CSE 2012",
  },
  {
    text: "2nd Pillar - Syllabus. But since, Syllabus is vast and it doesn't tell you which topic will have most likelihood of being asked in the examination, therefore we need another pillar to tackle that problem. 3rd Pillar - Unsolved questions papers (Or PYQs).",
    author: "Dr. Vijay Agrawal",
    misc: "Former civil servant",
  },
];

const Card = (props) => {
  return (
    <div className="header-card">
      <div className="header-card-text">{props.text}</div>
      <div className="header-card-info">
        <div className="header-card-author">{props.author}</div>
        <div className="header-card-misc">{props.misc}</div>
      </div>
    </div>
  );
};

const HeaderCard = () => {
  const { width } = useWindowDimensions();
  const [percentage, setPercentage] = useState(33);

  useEffect(() => {
    if (width < 1000) setPercentage(100);
    else setPercentage(33);
  }, [width]);

  const myRef = useRef(null);

  const handleScroll = () => {
    myRef.current.scrollIntoView();
  };

  return (
    <div className="header-card-div">
      <div className="header-card-title">Why Project-IAS ?</div>
      <Carousel
        autoPlay={true}
        interval={3000}
        infiniteLoop={true}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        stopOnHover={false}
        centerSlidePercentage={percentage}
        width="80vw"
        centerMode={true}
      >
        {CardData.map((card) => {
          return (
            <Card text={card.text} author={card.author} misc={card.misc} />
          );
        })}
      </Carousel>
      <button className="landing-scroll" onClick={handleScroll}>
        <FontAwesomeIcon icon={faAngleDoubleDown} />
      </button>
      <div ref={myRef}>
        <iframe
          className="header-card-youtube"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/FaNccksE7Rs"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
};

export default HeaderCard;
