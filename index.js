import React from "./src/react";
import reactDom from "./src/react-dom";
import App from './app'

let isShow = false
console.log( <div>
    <span>666</span>
    <div>3344</div>
    {isShow && <div>444</div>}
</div>)

reactDom.render(
   <App/>,
    document.getElementById('app'))