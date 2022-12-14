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
        x: (Math.random() - 0.5) * 8,
        y: 3
    }
    this.friction = 0.8
    this.gravity = 1
}

Star.prototype.draw = function() {
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    context.fillStyle = this.color
    context.shadowColor = "#e3eaef"
    context.shadowBlur = 20
    context.fill()
    context.closePath()
    context.restore()
}

Star.prototype.update = function() {
    this.draw()

    // when the star hits the bottom of the screen, the star moves upwards
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
        this.shatter()
    }

    else {
        this.velocity.y += this.gravity
    }

    // when star hits side of screen, it bounces to the opposite x coordinate
    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction
        this.shatter()
    }

    this.x += this.velocity.x
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
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    context.fillStyle = `rgba(227, 234, 239, ${this.opacity})`
    context.shadowColor = "#e3eaef"
    context.shadowBlur = 20
    context.fill()
    context.closePath()
    context.restore()
}

MiniStar.prototype.update = function() {
    this.draw()

    // when the star hits the bottom of the screen, the star moves upwards
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
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
let ticker = 0
let randomSpawnRate = 75
const groundHeight = 100
function init() {
    stars = []
    miniStars = []
    backgroundStars = []

    // for (let i = 0; i < 1; i++) {
    //     stars.push(new Star(canvas.width / 2, 30, 30, "#e3eaef"))
    // }

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
    context.fillStyle = "#182028"
    context.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

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

    ticker++
    
    if (ticker % randomSpawnRate == 0) {
        // radius must be divisible by 3! else an error will occur
        const radius = 12
        const x = Math.max(radius, Math.random() * canvas.width - radius)
        stars.push(new Star(x, -100, radius, "#e3eaef"))
        randomSpawnRate = randomIntFromRange(75, 200)
    }
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