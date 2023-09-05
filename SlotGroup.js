export default function SlotGroup() {

    const slots = [];
    const ress = [];
    const prms = [];

    this.size = 0;
    this.add = contd => slot => {
        slots.push(slot);
        this.size++;
        return contd(slot);
    };

    this.addReturn = (oldReturn) => {
        // addReturn wraps the onReturn provided to the slot
        const i = prms.length;
        prms.push(new Promise(resolve => {
            const i = ress.length;
            ress.push(() => {
                console.log("resolving %d", i);
                return resolve();
            });
        }));

        return async (result) => {
            if (typeof oldReturn === "function") {
                await oldReturn(result); // process the user-provided onReturn
            }
            ress[i](result);
        };
    };

    this.answer = async (result, callback) => {
        callback = typeof callback === "function" ? callback : (() => {});
        await callback(0, 0);
        for (let i = 0; i < slots.length; i++) {
            const progress = (i+1)/this.size;
            await callback(i+1, progress);
            slots[i].answer(result);
            await prms[i];
        }
    };

};
