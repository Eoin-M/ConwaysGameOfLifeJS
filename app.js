const cell_size = 25
const colors = {
	born: "#34b1eb",	// blue
	remain: "#085c35",	// green
	die: "#eb4034"		// red
}

// Get no. cells to fill current window
const cols = Math.ceil(window.innerWidth / cell_size),  	// Max x
	rows = Math.ceil(window.innerHeight / cell_size)		// Max y
	
console.log("Rows:", rows, "Cols:", cols)

const cgl_canvas = document.getElementById("cgl_canvas")
let ctx = cgl_canvas.getContext("2d")

// Set canvas height programmatically
cgl_canvas.width = window.innerWidth
cgl_canvas.height = window.innerHeight

let cells = [[]]

function init() {
	for (let x = 0; x < cols; x++) {
		cells[x] = []
		for (let y = 0; y < rows; y++) {
			cells[x][y] = Math.random() > 0.8 ? colors.born : null
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, cgl_canvas.width, cgl_canvas.height)

	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			if (cells[x][y]) {
				ctx.fillStyle = cells[x][y]
				ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size)
			}
		}
	}
}

function eval() {
	let cpy = []

	for (let x = 0; x < cols; x++) {
		cpy[x] = []

		for (let y = 0; y < rows; y++) {
			// Check cells 8 neighbours
			let neighbours = 0
			for (let xx = -1; xx <= 1; xx++) {
				for (let yy = -1; yy <= 1; yy++) {
					// Don't include current cell
					if (xx === 0 && yy === 0) {
						continue
					}

					let nx = x + xx < 0 ? cols + xx : (x + xx) % cols  // Neighbouring col, wrap around negative to last in array, and max to 0 in array
					let ny = y + yy < 0 ? rows + yy : (y + yy) % rows  // Neighbouring row, wrap around negative to last in array, and max to 0 in array
					
					if (cells[nx][ny]) {
						neighbours++
					}
				}
			}
			
			cpy[x][y] = getCellColor(cells[x][y], neighbours)
		}
	}

	cells = cpy
}

function setup() {
	init()
	draw()
}

function loop() {
	eval()
	draw()
}

function getCellColor(cell, neighbours) {
	switch (neighbours) {
	case 2:
		// Cell has 2 neighbours, dead cell stays dead, alive cell stays alive
		return cell ? colors.remain : ""
	case 3:
		// Cell has 3 neighbours, dead cell springs to life, alive cell remains alive
		return cell ? colors.remain : colors.born
	default :
		// Cell has any other no. of neighbours, it dies or remains dead
		return ""
	}
}

setup()

// setTimeout(eval, 10000)