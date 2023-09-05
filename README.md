# SLOT #

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
        <div> Your name is '{+name}'</div>
        <input type="text" onInput={name.bind} value={+name} placeholder="enter your name" />
        <button onClick={slot.answer}>done</button>
    </>);

    await show.show("Your name is " + name);
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
    await header.show(() => html `<nav>header here ${+i}</nav>`);
    await footer.show(() => html `<footer>this is the footer ${+i}</footer>`);

    await click_flow(body, i);
}

async function click_flow(slot, i) {
    await slot.capture(() => html `
        <div>You clicked the button ${+i} times.</div>
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

DIY routing example
===================

```jsx
async function main_loop(slot) {
    switch (window.location.path) {
        case "/":
            return await homePage(slot);
        case "/portal":
            return await userPortal(slot);
        case "/about":
            return await aboutPage(slot);
        default:
            return await notFound(slot);
    }
}
```

### Closing thoughts ###

This is an un-framework. It does not provide the rails that a framework does,
and even removes a lot of the comfort rails provided inherently by (P)React.
This allows you the freedom to envisage your own framework and design
principles, but for most people this will not be an improvement over using an
off-the-shelf solution.  

What it does provide, however, is an easy, unopinionated library of functions
for creating composable, encapsulated components, and a separation of UI flow
from display logic and routing. This means that things like a login flow can be
re-used from project to project without needing to have specific reserved
routes or dedicated pages. The login can exist wherever you want it to, and it
can look like whatever you want it to, without sacrificing any design in your
own system.  

Even though Slot is a departure from the established approach from React, it is
effortlessly interoperable with React. You can use react components within a
slot and you can use a slot in another react project just like you'd use any
other react component:  

#### Slot project using react component ####
```jsx
// using a DateSelector react component in a slot:
// There's nothing unusual, here:
await slot.capture(() => <div> <DateSelector /> </div>);
```

#### React project using slot component ####
```jsx
// using a slot in a react project that doesn't know anything about slots:
// the login flow will return with a user when it is successful logging in
function MyComponent({handleLogIn}) {
    return <div>
        Sign in here!
        <Slot flow=${login_flow} onReturn={user => handleLogIn(user)} />
    </div>;
}
```
