import Dom from './dom'
import Hook from  './hook'

let currentFiber = null
let nextUnitWork = null
let wipRoot = null
let deletions = []
let wipFiber = null

function createDom(fiber) {
    const dom = fiber.tag === 'TEXT_ELEMENT'?
        document.createTextNode(fiber.attrs.nodeValue) :
        fiber.tag && document.createElement(fiber.tag)

    Dom.setAttribute(dom,{}, fiber.attrs)

    return dom
}

function updateHostComponent(fiber) {
    if(!fiber.dom){
        fiber.dom =  createDom(fiber)
    }
    reconcileChildren(fiber,fiber.children)
}

function updateFunctionComponent(fiber) {
    wipFiber = fiber
    wipFiber.memoizedState = null
    const children = [fiber.tag(fiber.props)]
    reconcileChildren(fiber, children)
}

function reconcileChildren(fiber,elements) {
    let index = 0
    let oldFiber = fiber.alternate && fiber.alternate.child
    let prevSibling = null
    let newFiber = null

    while (elements && index < elements.length) {
        const element = elements[index]
        const sameTag = oldFiber && element && element.tag === oldFiber.tag;

        if(sameTag){
            newFiber = {
                tag: oldFiber.tag,
                attrs: element.attrs,
                children: element.children,
                parent: fiber,
                dom:oldFiber.dom,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        }

        if(element && !sameTag){
            newFiber = {
                tag: element.tag,
                attrs: element.attrs,
                children: element.children,
                parent: fiber,
                dom: null,
                alternate:null,
                effectTag: "PLACEMENT"
            }
        }

        if (oldFiber && !sameTag) {
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            fiber.child = newFiber
        } else if(element){
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
}

function buildFiberTree(fiber) {
    const isFunctionComponent = typeof fiber.tag === 'function'

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if (fiber.child) {
        nextUnitWork = fiber.child;
        buildFiberTree(nextUnitWork)
        return
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            nextUnitWork = nextFiber.sibling;
            buildFiberTree(nextUnitWork)
            return;
        }
        nextFiber = nextFiber.parent;
    }

    if (!nextFiber && wipRoot) {
        commitRoot();
    }
}

function commitRoot() {
    console.log(wipRoot,'------',nextUnitWork)
    deletions.forEach(commitWork)
    commitWork(wipRoot.child);
    currentFiber = wipRoot
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }

    const domParent = domParentFiber.dom;
    if(fiber.dom && fiber.effectTag === "PLACEMENT"){
        domParent.appendChild(fiber.dom);
    }else if(fiber.dom && fiber.effectTag === 'UPDATE'){

    }else if (fiber.effectTag === "DELETION"){
        commitDeletion(fiber, domParent)
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
    if(fiber.dom){
        domParent.removeChild(fiber.dom)
    }else {
        commitDeletion(fiber.child, domParent);
    }
}

function render(vnode, container) {
    wipRoot = {
        dom: container,
        children: [vnode],
        alternate:currentFiber
    }
    nextUnitWork = wipRoot

    buildFiberTree(nextUnitWork)
}

function distributeState(initState) {
    return Hook.stateHook(initState, wipFiber, wipRoot)
}

export default {
    render,
    distributeState
}