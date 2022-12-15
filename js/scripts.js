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

//################################################
// objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: 0,
        y: 3
    }
    this.friction = 0.8
    this.gravity = 1
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

    // when the star hits the bottom of the screen, the star moves upwards
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
        this.shatter()
    }

    else {
        this.velocity.y += this.gravity
    }

    this.y += this.velocity.y
}

// spawns MiniStars when it hits the bottom
Star.prototype.shatter = function() {
    this.radius -= 3
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2))
    }
    // console.log(miniStars)
}

// subclass that inherits from Star parent
function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: randomIntFromRange(-5, 5),
        y: randomIntFromRange(-15, 15)
    }
    this.friction = 0.8
    this.gravity = 0.1
    // ttl === time to live
    this.ttl = 100
    this.opacity = 1
}

MiniStar.prototype.draw = function() {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    context.fillStyle = `rgba(255, 0, 0, ${this.opacity})`
    context.fill()
    context.closePath()
}

MiniStar.prototype.update = function() {
    this.draw()

    // when the star hits the bottom of the screen, the star moves upwards
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y = -this.velocity.y * this.friction
    }

    else {
        this.velocity.y += this.gravity
    }

    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1 / this.ttl
}

//################################################
// create mountains
function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount
        context.beginPath()
        context.moveTo(i * mountainWidth, canvas.height)
        context.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
        context.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height)
        context.lineTo(i * mountainWidth - 325, canvas.height)
        context.fillStyle = color
        context.fill()
        context.closePath()
    }
}

//################################################
// draw background
const backgroundGradient = context.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, "#171e26")
backgroundGradient.addColorStop(1, "#3f586b")

//################################################
// object instantiation and animation
let stars
let miniStars
let backgroundStars
function init() {
    stars = []
    miniStars = []
    backgroundStars = []

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width / 2, 30, 30, "blue"))
    }

    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 3
        backgroundStars.push(new Star(x, y, radius, "white"))
    }
}

function animate() {
    requestAnimationFrame(animate)
    context.fillStyle = backgroundGradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    backgroundStars.forEach(backgroundStars => {
        backgroundStars.draw()
    })

    createMountainRange(1, canvas.height - 50, "#384551")
    createMountainRange(2, canvas.height - 100, "#2b3843")
    createMountainRange(3, canvas.height - 300, "#26333e")

    stars.forEach((star, index) => {
        star.update()
        if (star.radius === 0) {
            stars.splice(index, 1)
        }
    })
    
    miniStars.forEach((miniStar, index) => {
        miniStar.update()
        if (miniStar.ttl === 0) {
            miniStars.splice(index, 1)
        }
    })
}

//################################################
// helper functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//################################################
// run loop
init()
animate()