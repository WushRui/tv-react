function diffText(dom, vnode) {
    let out = dom
    if(dom && dom.nodeType === 3){
        if(dom.textContent !== vnode)
            dom.textContent = vnode
    }else {
        out = document.createTextNode(vnode)
        if(dom && dom.parentNode)
            dom.parentNode.replaceChild(out, dom)
    }

    return out
}

function diffChildren(dom, vchildren) {

}

function diffComponent(dom, vnode) {

}

function diffNode(dom, vnode) {
    if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' )
        return ;

    if(typeof vnode === 'number') vnode = String(vnode)

    if(typeof vnode === 'string'){
        return diffText(dom, vnode)
    }

    if (typeof vnode.tag === 'function'){
        diffComponent(dom, vnode)
    }

    let out = dom;
    if(!dom){
       out = document.createElement(vnode.tag)
    }

    if (vnode.children && vnode.children.length >0)
        diffChildren(out, vnode.children)

    return out
}

export  function diff(dom, vnode, container) {
    const ref = diffNode(dom, vnode)

    if(container){
        container.appendChild(ref)
    }

    return ref
}