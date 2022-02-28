import hook from './react-dom'

function createTextElement(text) {
    return typeof text === 'boolean' || text === false ? {} : {
        tag: "TEXT_ELEMENT",
        attrs: {
            nodeValue: text
        },
        children: []
    }
}

function createElement(tag, attrs, ...children) {
    attrs = attrs || {}
    return {
        tag,
        attrs,
        children:children.map(child =>
            typeof child === "object" ? child : createTextElement(child)
        ),
        key: attrs.key || null
    }
}

export function useState(initState) {
    return hook.distributeState(initState)
}

export function useEffect() {

}

export default {
    createElement
}