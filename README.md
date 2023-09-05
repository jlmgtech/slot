#SLOT

---------------


bootstrapping the app
=====================

```jsx
render(<Slot flow={main_loop} />, document.getElementById("app"));
```


basic flow
==========

```jsx
async function main_loop(slot) {
    const response = await slot.capture(() => <>
        <button onClick={() => slot.answer(true)}>Yes</button>
        <button onClick={() => slot.answer(false)}>No</button>
    </>);

    if (response) {
        await slot.show("you clicked yes");
    } else {
        await slot.show("you clicked no");
    }
    await delay(1000); // wait a second before looping...
}
```

using a reactive store
======================

```jsx

async function main_loop(slot) {
    const name = new Store("");

    await slot.capture(() => <>
        <div> Your name is '{name}'</div>
        <input type="text" onInput={name.bind} value={name} placeholder="enter your name" />
        <button onClick={slot.answer}>done</button>
    </>);

    await show.show("Your name is " + name.get());
    await delay(1000);
}

```

embedding slots
===============

```jsx

async function main_loop(slot) {
    await slot.capture(() =>
        <div class="container">
            CLICK COUNTER VER 1.0.0
            <hr />

            <!-- embedded click counter here: -->
            <Slot flow={click_flow} />

            <hr />
            <div>Copyright 2045 All rights reserved</div>
        </div>
    );
}

async function click_flow(slot) {
    for (let i = 0; ; i++) {
        await slot.capture(() => <>
            <div>You clicked the button {i} times.</div>
            <div><button onClick={slot.answer}>click here</button></div>
        </>);
    }
}

```

stamping slots into a layout
============================

```jsx
async function main_loop(slot) {
    const i = new Store(0);

    const [header, body, footer] = await stamp_layout(slot);
    await header.show(() => html `<nav>header here ${i}</nav>`);
    await footer.show(() => html `<footer>this is the footer ${i}</footer>`);

    await click_flow(body, i);
}

async function click_flow(slot, i) {
    await slot.capture(() => html `
        <div>You clicked the button ${i} times.</div>
        <div><button onClick=${() => i.set(i+1)}>click here</button></div>
    `);
}

async function stamp_layout(slot) {
    const header = new Stamp();
    const footer = new Stamp();
    const body = new Stamp();

    await slot.show(() => html `
        <div> ${header.stamp()} </div>
        <div> ${body.stamp()}   </div>
        <div> ${footer.stamp()} </div>
    `);

    return await Promise.all([
        header.slot(),
        body.slot(),
        footer.slot(),
    ]);
}
```

### Closing thoughts ###

This is pretty much it.
