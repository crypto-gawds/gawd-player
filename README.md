
<div align="center">
<h1>Gawd Player</h1>

<p>A JS component for displaying GAWDS in their various formats, powered by <a href="https://github.com/caseypugh/three-spatial-viewer/">three-spatial-viewer</a>.
</p>
<div style="clear:both;"></div>
<!-- <img src="https://github.com//workflows/CI/badge.svg" /><br/> -->
<!-- <a href="#getting-started">Getting started</a> •
<a href="#examples">Examples</a> • -->
</div>

# Installation
Install in your HTML head and make sure you have also included [three.js](https://threejs.org/docs/index.html#manual/en/introduction/Installation) _and_ [three-spatial-viewer](https://github.com/caseypugh/three-spatial-viewer/)
```html
<script src="gawd-player.js"></script>
```

Or use ES6
```sh
yarn add https://github.com/crypto-gawds/gawd-player
```

And then import the plugin
```js
import { Player } from 'gawd-player'
```

# Getting started
Setup your HTML
```html
<style>
  /* Portrait layout */
  #gawd-container { 
    width: 480;
    height: 640;
  }
</style>

<div id="gawd-container"></div>
```

Using the Player API:
```js
let gawdJsonUrl = "..."
let gawdContainerEl = document.getElementById('gawd-container')

// Use vanilla JS
new CryptoGawd.Player({
  container: gawdContainerEl,
  url: gawdJsonUrl
});

// or TypeScript
import { Player, PlayerProps } from 'gawd-player'

let props: PlayerProps = new PlayerProps()
props.container = gawdContainerEl
props.url = gawdJsonUrl

new Player(props);
```