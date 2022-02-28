import React,{useState} from "./src/react";
import Tab from './compnent/tab'
import Tab2 from './compnent/tab2'

export default function (props) {
    console.log(props,999)
    const [num,setNum] = useState(0)

    return (
        <div>
            <div>3333</div>
            <div>666</div>
            {false && <div>test</div>}
            <Tab/>
            <Tab2/>
        </div>
    )
}