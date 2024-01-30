# Conway's Game of Life - Vanilla JS Module

A colorful implementation of Conway's Game of Life,
built in vanilla JavaScript (minimum version ECMA2015)

Read More about the game on [Wikipedia](https://wikipedia.org/wiki/Conway's_Game_of_Life)

## Usage
Add the cgl.js file to your project, create a canvas in HTML,
import the module and pass it a reference to your canvas

```html
<canvas id="cgl_canvas"></canvas>

<script type="module">
    const cgl_canvas = document.getElementById("cgl_canvas")
    // Set canvas height programmatically
    cgl_canvas.width = window.innerWidth
    cgl_canvas.height = window.innerHeight

    import CGL from "./cgl.js"
    CGL(cgl_canvas)
</script>
```

## Example

### View a live preview here --> https://eoin-m.github.io/ConwaysGameOfLifeJS/

<img src="example.gif" width="50%">