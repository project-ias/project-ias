import landingSearchGif from '../../landing_search.gif';

const HeaderTitle = () => {

    return(
        <div className="title-box">
            <div className="text-box">
                <div className="primary-title">PROJECT IAS</div>
                <div className="secondary-title">Search through PYQs, DNS and reading materials in a go</div>
            </div>
            <div className="gif-box">
                <img src={landingSearchGif} className="landing-search-gif"></img>
            </div>
        </div>
    )
}

export default HeaderTitle;