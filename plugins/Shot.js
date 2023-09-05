export default function Shot({setComp}) {
    let running = false;

    this.initialize = async () => {
        running = true;
    };

    this.show = async (comp, _opts) => {
        setComp(comp);
    };
    this.reset = async () => {
        return this.show("");
    };
    this.finalize = async () => {
        running = false;
    };
    // used when the flow function exits for any reason:
    // used to implement deferred statements.
    this.onreturn = async () => {};

    const slot = this;
    this.runloop = async function runloop(flow, onReturn) {
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
            } else if (running) {
                setTimeout(() => runloop(flow, onReturn));
            }
        }
    };
}
