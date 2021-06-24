import React, { useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../constants/constants'

export default function SearchPage() {

    const [pyqs, setPyqs] = useState([])

    function handleChange(e) {
        console.log("e.",e.target.value)
        const query = e.target.value
        const data = { 'query': query }
        const URL = `${BACKEND_URL}/search`

        if(query !== '') {
            console.log("Non empty query",query)
            axios
            .post(URL, data)
            .then(res => {
                console.log("res",res.data)
                setPyqs(res.data.hits)
            })
            .catch(err => {
                console.log("err is ",err)
            })
        } else if(query === '') {
            setPyqs([])
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
        {pyqs &&
        pyqs.map(item => (
            <div key={item['id']}>
                <h4>{item['question']} ({item['year']})</h4>
                <p><strong>Topics:</strong> {item['topics'].join(',')}</p>
                <br/>
            </div>
        ))
        
        }
    </div>)
}