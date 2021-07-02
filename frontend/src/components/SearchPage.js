import React, { useState } from 'react'
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser'
import { parse } from 'node-html-parser'
import { BACKEND_URL } from '../constants/constants'
import { InstantSearch, SearchBox, Hits, Highlight, RefinementList } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';


const searchClient = instantMeiliSearch(
    "http://localhost:7700",
    "masterKey"
  );

function Hit(props) {
    console.log("props is ",props)
    return(
        <div>
            {props.hit.question} 
            
            <br/>
            <b>Options:</b>
            {props.hit.options.map(item => {
                return(
                    <div>
                       <input type="checkbox"  value={item} name={item} />
                        <label for={item}>{item}</label><br/>
                    </div>
                )
            })}
            
            <br/>
            <b>Explanation:</b>
            {ReactHtmlParser(props.hit.explanation)}
        </div>
    )
// return <Highlight attribute="name" hit={props.hit} />;
}

export default function SearchPage () {

    const [pyqs, setPyqs] = useState([])
    const [content, setContent] = useState([])

    function removePrevNext(htmlString) {
        let parsedHtml = parse(htmlString)
        parsedHtml.querySelector(".next-post").remove()
        return parsedHtml.toString()
    }
    
    function handleChange(e) {
        console.log("e.",e.target.value)
        const query = e.target.value
        const data = { 'query': query }
        const PYQ_URL = `${BACKEND_URL}/search_pyq`
        const Content_URL = `${BACKEND_URL}/search_content`

        if(query !== '') {
            console.log("Non empty query",query)
            axios
            .post(PYQ_URL, data)
            .then(res => {
                console.log("res",res.data)
                setPyqs(res.data.hits)
            })
            .catch(err => {
                console.log("err is ",err)
            })

            axios
            .post(Content_URL, data)
            .then(res => {
                console.log("content res",res.data)
                setContent(res.data.hits)
            })
            .catch(err => {
                console.log("err is ",err)
            })

        } else if(query === '') {
            setPyqs([])
            setContent([])
        }
    }

    function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
      }
      
    
    const processChange = debounce((e) => handleChange(e));

    return(<div>
        <h1>Project IAS</h1>

        {/* <input  onKeyUp={processChange}/>
                <h1>PYQ Mains</h1>
                        {pyqs &&
                            pyqs.map(item => (
                                <div key={item['id']}>
                                    <h4>{item['question']} ({item['year']})</h4>
                                    <div>{}</div>
                                    <p><strong>Topics:</strong> {item['topics'].join(',')}</p>
                                    <br/>
                                </div>
                            ))
                        }
                    
                    <h1>Dhristi IAS Content</h1>
                        {content &&
                            content.map(item => (
                                <div key={item['id']}>
                                    <h4><a href={item['link']}>{item['title']}</a> ({item['exam']})</h4>
                                    <div>{ReactHtmlParser(removePrevNext(item['content']))}</div>
                                    <p><strong>Topics:</strong> {item['tags'].join(',')}</p>
                                    <br/>
                                </div>
                            ))

                        } */}

                 <h1>Prelims</h1>
                    <InstantSearch
                        indexName="prelims"
                        searchClient={searchClient}
                    >
                        <SearchBox />
                        {/* <RefinementList attribute="exam" /> */}
                        <Hits hitComponent={Hit} />
                    </InstantSearch>
                  
       
    </div>)
    // return(
    //     <InstantSearch
    //     indexName="pyqs"
    //     searchClient={searchClient}
    //   >
    //     <SearchBox />
    //     <RefinementList attribute="exam" />
    //     <Hits hitComponent={Hit} />
    //   </InstantSearch>
    // )
}