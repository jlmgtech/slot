export default function Shot({setComp, onReturn, flow}) {

    if (typeof flow !== "function") {
        if (typeof flow === "undefined") {
            throw new ReferenceError("flow is undefined");
        } else {
            throw new TypeError("flow must be a function");
        }
    }

    this.running = false;

    this.initialize = async () => {
        this.running = true;
    };

    this.show = async (comp, _opts) => {
        setComp(comp);
    };
    this.reset = async () => {
        return this.show("");
    };
    this.finalize = async () => {
        this.running = false;
    };

    // used when the flow function exits for any reason:
    // used to implement deferred statements.
    this.onreturn = async () => {};

    const slot = this;
    this.runloop = async function runloop() {
        onReturn = onReturn || (()=>{});
        let err = false;
        try {
            const answer = await flow(slot);
            await onReturn(answer);
        } catch (e) {
            err = e;
        } finally {
            await slot.onreturn();
            if (err) {
                throw err;
            } else if (slot.running) {
                setTimeout(() => runloop());
            }
        }
    };
}
