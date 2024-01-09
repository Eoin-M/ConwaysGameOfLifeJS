const cell_size = 10
let anim_time = 0, anim_max = 5
const state = {
	born: 1,
	born_to_remain: 2,
	remain: 3,
	born_to_die: -1,
	remain_to_die: -2,
}
const state_color = {
	born: {r: 78, g: 187, b: 237},	// blue
	remain: {r: 30, g: 143, b: 90},	// green
	die: {r: 128, g: 59, b: 59},	// red
}

const cgl_canvas = document.getElementById("cgl_canvas")
let ctx = cgl_canvas.getContext("2d")

// no. cells to fill current canvas size
let cols, rows

let cells = [[]]

function init() {
	cols = Math.ceil(cgl_canvas.offsetWidth / cell_size)  	// Max x
	rows = Math.ceil(cgl_canvas.offsetHeight / cell_size)	// Max y
	console.log("Rows:", rows, "Cols:", cols)

	for (let x = 0; x < cols; x++) {
		cells[x] = []
		for (let y = 0; y < rows; y++) {
			cells[x][y] = Math.random() > 0.8 ? state.born : 0
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, cgl_canvas.width, cgl_canvas.height)

	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			if (cells[x][y] !== 0) {
				let itr = getCellInterpolation(cells[x][y])
				let c = getCellColor(cells[x][y], itr)
				
				if (cells[x][y] === state.born_to_remain || cells[x][y] === state.remain) itr = 1
				let offset = (cell_size - (cell_size * itr)) /2

				ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`
				ctx.fillRect((x * cell_size) + offset, (y * cell_size) + offset, cell_size * itr, cell_size * itr)
			}
		}
	}

	anim_time++
	if (anim_time > anim_max) {
		anim_time = 0
		loop()
	} else {
		window.requestAnimationFrame(draw)
	}
}

function getCellInterpolation(cell) {
	switch (cell) {
		case state.born:
			return anim_time ** 2 / anim_max ** 2
		default:
			return 1 - (anim_time ** 2 / anim_max ** 2)
	}
}

function getCellColor(cell, itr) {
	switch (cell) {
		case state.born:
			return state_color.born
		case state.born_to_remain:
			return getColorInterpolationValue(state_color.born, state_color.remain, itr)
		case state.remain:
			return state_color.remain
		case state.born_to_die:
			return getColorInterpolationValue(state_color.born, state_color.die, itr)
		case state.remain_to_die:
			return getColorInterpolationValue(state_color.remain, state_color.die, itr)
	}
}

function getColorInterpolationValue(start, target, itr) {
	return {
		r: start.r + ((target.r - start.r) * (1 - itr)),
		b: start.b + ((target.b - start.b) * (1 - itr)),
		g: start.g + ((target.g - start.g) * (1 - itr))
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
					
					if (cells[nx][ny] > 0) {
						neighbours++
					}
				}
			}
			
			cpy[x][y] = getCellState(cells[x][y], neighbours)
		}
	}

	cells = cpy
	}

function getCellState(cell, neighbours) {
	switch (neighbours) {
	case 2:
		// Cell has 2 neighbours, dead cell stays dead, alive cell stays alive
		return cell > 0? (cell === state.born ? state.born_to_remain : state.remain) : 0
	case 3:
		// Cell has 3 neighbours, dead cell springs to life, alive cell remains alive
		return cell > 0 ? (cell === state.born ? state.born_to_remain : state.remain) : state.born
	default :
		// Cell has any other no. of neighbours, it dies or remains dead
		return cell > 0 ? (cell === state.born ? state.born_to_die : state.remain_to_die) : 0
	}
}

function setup() {
	init()
	window.requestAnimationFrame(draw)
}

function loop() {
	eval()
	window.requestAnimationFrame(draw)
}

setup()