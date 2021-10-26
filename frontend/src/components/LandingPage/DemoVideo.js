import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useWindowDimensions from '../../helpers/WindowDimensions';

function importAll(r) {
    let videos = {};
    r.keys().map((item) => { videos[item.replace('./', '')] = r(item); });
    return videos;
  }

const description = [
    "Login", "Mains PYQs", "Progress Tracker", "Prelims PYQs", "Secure Tab", "Read Tab"
]

const DemoVideo = () => {

    const { width } = useWindowDimensions();
    const [percentage, setPercentage] = useState(35);

    useEffect(() => {
        if(width < 1000) setPercentage(100);
        else setPercentage(35);
    }, [width]);

    const videos = importAll(require.context('../../assets/videos', false, /\.(mp4)$/));
    console.log(JSON.stringify(videos));
    const videoURL = [];
    for(var i = 0; i < 6; i++) {
        videoURL.push({
            url: videos[`${i+1}.mp4`]['default'],
            desc: description[i]
        });
        console.log(videoURL[i]);
    }

    return (
        <div className="demo-video-carousel">
            <Carousel
            autoPlay={true}
            interval={5000}
            infiniteLoop={true}
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            stopOnHover={false}
            centerSlidePercentage={percentage}
            width="80vw"
            centerMode={true}>
                {videoURL.map((video, index) => {
                    return(
                        <div>
                            <div className="demo-title">{`Step : ${index+1}`}</div>
                            <video className="demo-video" autoPlay loop muted controls>
                                <source src={video.url} type="video/mp4"/>
                            </video>
                            <div className="demo-desc">{video.desc}</div>
                        </div>
                    )
                })}
            </Carousel>
        </div>
    )
}

export default DemoVideo;