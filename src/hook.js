let isMount = true
let workInProgressHook = null

const fiber ={
    stateNode:'app',
    memoizedState:null
}

function stateHook(initState, wipFiber, wipRoot) {
    let hook;
    if(isMount){
        wipFiber={
            memoizedState:initState,
            next:null,
            queue:{
                pending:null
            }
        }
        if(!fiber.memoizedState){
            fiber.memoizedState = wipFiber
        }else {
            workInProgressHook.next = wipFiber
        }
        workInProgressHook = wipFiber
    }else {
        wipFiber = workInProgressHook
        workInProgressHook = workInProgressHook.next
    }

    let baseState = wipFiber.memoizedState

    if(wipFiber.queue.pending){
        let firstUpdate = wipFiber.queue.pending.next
        do {
            baseState = firstUpdate.action
            firstUpdate = firstUpdate.next
        }while (firstUpdate!==wipFiber.queue.pending.next)

        wipFiber.queue.pending = null
    }
    wipFiber.memoizedState = baseState

    return [baseState,dispatchAction.bind(null,wipFiber.queue)]
}

function dispatchAction(queue, action) {
    const update ={
        action,
        next:null
    }

    if (queue.pending === null){
        update.next = update
    }else {
        update.next = queue.pending.next
        queue.pending.next = update
    }

    queue.pending = update
    schedule()
}

function schedule() {
    isMount = false
    workInProgressHook = fiber.memoizedState
}

export default {
    stateHook
}