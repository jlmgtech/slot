import { useState, useEffect } from "/cp/resources/js/preact@10.5.13.hooks.module.js";
import { html } from "/cp/resources/js/html.module.js";
import Shot from "./plugins/Shot";
import DeferredShot from "./plugins/DeferredShot";
import CaptureShot from "./plugins/CaptureShot";
import ReactiveShot from "./plugins/ReactiveShot";
import AnimSlot from "./plugins/AnimShot";
import GroupShot from "./plugins/GroupShot";
import { delay } from "./utils.js";
export { default as SlotGroup } from "./SlotGroup.js";

// plugins are class decorators:
const SlotClass = GroupShot(AnimSlot(CaptureShot(ReactiveShot(DeferredShot(Shot)))));

export default function Slot(opts) {
    const [comp, setComp] = useState('');
    useEffect(() => {
        opts = {setComp, ...opts};
        const slot = new SlotClass(opts);
        slot.initialize().then(() => slot.runloop());
        return slot.finalize;
    }, Object.values(opts));
    return comp;
}

/// a way to specify the location of slots in a layout
export function Stamp() {
    let res = null;
    let numcalls = 0;
    this.stamp = () => html `<${Slot} flow=${(slot) => {
        if (numcalls++) throw new Error("can only call stamp() once per Stamp instance");
        res(slot);
        return new Promise(()=>{});
    }} />`;
    const prm = new Promise((resolve) => {
        res = resolve;
    });
    this.slot = () => {
        return prm;
    };
}
