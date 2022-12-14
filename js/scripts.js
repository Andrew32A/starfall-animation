const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

// if user resizes window, the canvas will adjust
addEventListener("resize", () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
    // console.log(canvas.width)
    // console.log(canvas.height)
})

// objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
}

Star.prototype.draw = function() {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    context.fillStyle = this.color
    context.fill()
    context.closePath()
}

Star.prototype.update = function() {
    this.draw()

    this.y += 1
}

// object instantiation and animation
let stars
function init() {
    stars = []

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width / 2, 30, 30, "blue"))
    }
}

function animate() {
    requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach(star => {
        star.update()
    })
}

// run loop
init()
animate()
