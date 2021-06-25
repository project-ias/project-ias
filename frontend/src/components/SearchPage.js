import React, { useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../constants/constants'

export default function SearchPage() {

    const [pyqs, setPyqs] = useState([])
    const [content, setContent] = useState([])

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

        <input  onKeyUp={processChange}/>
        <table>
            <tbody>
                <tr>
                    <td> 
                        {pyqs &&
                            pyqs.map(item => (
                                <div key={item['id']}>
                                    <h4>{item['question']} ({item['year']})</h4>
                                    <p><strong>Topics:</strong> {item['topics'].join(',')}</p>
                                    <br/>
                                </div>
                            ))
                        }
                    </td>
                    <td>
                        {content &&
                            content.map(item => (
                                <div key={item['id']}>
                                    <h4>{item['link']} ({item['exam']})</h4>
                                    <p><strong>Topics:</strong> {item['tags'].join(',')}</p>
                                    <br/>
                                </div>
                            ))
                            }
                    </td>
                </tr>
            </tbody>
        </table>
       
    </div>)
}