#### July 18, 2022 - A new project is born

electron-playground is itended to be a light-weight sandbox to play and experiment with all sort of things. Mainly to find answers to questions yet to be asked and questions which linger for quiet some time now in the back of my head. Naturally, most stuff will center on Electron. But I will probably also tackle the hotest shit in web technologies in general. And the not so hot but battle-proven libraries and frameworks which might help making a little more sense in this dense jungle we call our profession.

Enough nonsensical chit-chat! I will turn to electron-playground when ODIN/NIDO is too convoluted to try out new things or understand old problems and topics in more depth. Hopefully, this playground is  sufficiently fertile so that nifty little tricks make it back to the main project.

Day 1 - Electron - 101

First steps first: The first step is a more or less verbatim copy of Electron's Quick Start guide. Contrary to NIDO, security is ramped up to the max (at least I think so). **Node integration** is disabled and **context isolation** is engaged. Meaning, we cannot use any Node modules or API in renderer. I think this is a safety measure to prevent injection of code which then has access to the formidable power Node APIs pose. Context isolation takes it up a notch:

> Context Isolation is a feature that ensures that both your preload scripts and Electron's internal logic run in a separate context to the website you load in a webContents. This is important for security purposes as it  helps prevent the website from accessing Electron internals or the powerful APIs your preload script has access to.

Pretty sketchy for my taste. But maybe I will find out in good time. Getting around the restrictions of missing Node integration, **preload scripts** have some ways to close the gap with **context bridge**. From the first glance, through context bridge one can provide some API to renderer which may use selected Node mechanics without exposing all Node features to renderer. Concretely (and in theory), writing a file might be exposed with some specific API (which may also contain additional safety checks) without the need to `require 'fs'` in renderer.

Speaking of security: Web security is turned off in NIDO as well. At least during development mode. Needless to say, that it is recommended to have it enabled at all times. Doing web request from localhost to say WMTS, is really a nightmare, as far as I'm concerned. Who does really understand how this is supposed to work?! Is it possible at all?!

Closing for tonight: node integration, context isolation and web security are all good and well. But what about native LevelDB support in our trusted renderers? From what I understand LevelDB scales down to IndexedDB API/implementation when used in browser environment. I'm pretty sure that I/O performance is really poor compared to native implementation. Also available database memory might be limited to ridiculous low numbers.

These topics are the very first I will try to understand: How much slower is LevelDB in browser flavor? Is native LevelDB possible without compromising security as advocated by the Electron creators. Stay tuned for a new episode, where we add Webpack to the build and can configure native modules to be packaged and used.

#### July 20, 2022 - Webpack and Security

Dear diary! Today I implemented Webpack build. There's nothing new here. Just copied Webpack configuration from NIDO and made a few adjustments. But having Webpack was just an intermediate step. The primary goal was to see how context isolation and missing node integration would impact a more serious setup. To make a long story short: Fuck security!

At least two issues pop up with context isolation enabled and node integration disabled. First: Webpack Development Server (i.e. HMR) does not work => `Uncaught ReferenceError: global is not defined`. Second: Certain dependencies require `require` to be available, which is not without node integration. `levelup` for example is such a module => `Uncaught ReferenceError: require is not defined`. While there where a few pointers concerning the first problem (naturally without fixes), the second issue should be no surprise. From the introduction of `levelup` GitHub page:

> Fast and simple storage. A Node.js wrapper for abstract-leveldown compliant stores, which follow the characteristics of LevelDB.

There you have it! A **Node.js wrapper** will probably have a hard time with node integration turned off. BTW: Enabling node integration with context isolation won't do for `levelup` either. Summing up, there is no way around this for the moment:

```javascript
webPreferences: {
  nodeIntegration: true, // default: false
  contextIsolation: false, // default: true, since 12.0.0
}
```

#### July 20, 2022 - Sassy CSS

Dear diary! Long time no see! Today it's time to look into SCSS. An awful lot of CodePen and CodeSandbox examples are based on SCSS. It is not always easy to transpile this code to CSS in your head on-the-fly. At least my head is a pretty bad transpiler. While it might be beneficial to learn CSS from scratch without any fancy-pancy syntax, at some point it is probably worthwhile to learn something new. SASS and SCSS are around for quite some time now (some odd 15 years) and developers seem to have adopted this technology deep and wide. As a side note: SASS is a bit older than SCSS and uses indentation to structure code. SCSS is more in line with CSS parenthesis usage. Setting up Webpack with SASS is a piece of cake. Throw in a SASS itself, a few loaders and a CSS/SCSS rule and you're done.

```
$ npm install -D node-sass sass-loader css-loader style-loader
```

And somewhere in Webpack configuration:

```json
{
  test: /\.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}
```

That's it! Now for the funny part: Learning SCSS syntax and its advantages over plain and boring CSS. More on that some other fine day. Sleep well dear diary!
