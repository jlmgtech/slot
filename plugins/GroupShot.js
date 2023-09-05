export default function GroupShot(classDef) {
    return function(...args) {
        classDef.apply(this, args);

        // <${Slot} group=${grp} flow=${grp.add(slot => edit_page(slot, page))} onReturn=${grp.addReturn()} />

        const oldRunLoop = this.runloop;
        this.runloop = async function runloop(flow, onReturn, group) {
            if (group) {
                flow = group.add(flow);
                onReturn = group.addReturn(onReturn);
            }
            return oldRunLoop(flow, onReturn, group);
        };
    };
}
