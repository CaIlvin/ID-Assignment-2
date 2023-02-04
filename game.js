const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Plane {
    constructor() {
        this.velocity = {
            x:0,
            y:0
        }      
        
        this.rotation = 0

        const plane = new Image()
        plane.src = './Images/fighter-jet.png'
        plane.onload = () => {
        this.image = plane
        this.width = plane.width * 0.5
        this.height = plane.height * .5
        this.position = {
            x: canvas.width / 2 - this.width / 2, //Set x position of plane to be center of web 
            y: canvas.height - this.height - 100 //Set y position of plane to be bottom of web
        }           
        }
    }

    load() {
        c.save()
        c.translate(
            plane.position.x + plane.width / 2,
            plane.position.y + plane.height / 2
        )

        c.rotate(this.rotation)        

        c.translate(
            -plane.position.x - plane.width / 2,
            -plane.position.y - plane.height / 2
        )

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }

    update() {
        if (this.image) {
            this.load()
            this.position.x += this.velocity.x //Shift plane position 
        }
    }
}

const plane = new Plane()

const keys = {
    q: {
        pressed: false
    },

    e: {
        pressed: false
    },

    space: {
        pressed: false
    }
}

function animate() { // Initalize plane image
    requestAnimationFrame(animate)
    c.fillStyle = '#333'
    c.fillRect(0, 0, canvas.width, canvas.height)
    plane.update()
    if (keys.q.pressed && plane.position.x >= 0) {
        plane.velocity.x = -10
        plane.rotation = -0.15
    }
    else if (keys.e.pressed && plane.position.x + plane.width <= canvas.width) {
        plane.velocity.x = 10
        plane.rotation = 0.15
    } 
    else {
        plane.velocity.x = 0
        plane.rotation = 0
    }
}

animate()

addEventListener('keydown', ({key}) => { //Get the input being pressed by the player
    switch (key) {
        case 'q': // Move plane to the left
            console.log ('left')
            keys.q.pressed = true
            break
        case 'e': // Move plane to the right
            console.log ('right')
            keys.e.pressed = true
            break
        case ' ': // Fire button
            console.log ('space')
            break
    }
})

addEventListener('keyup', ({key}) => { //Get the input being pressed by the player
    switch (key) {
        case 'q': // Stop plane movement
            console.log ('left')
            keys.q.pressed = false
            break
        case 'e':
            console.log ('right')
            keys.e.pressed = false
            break
        case ' ': // Fire button
            console.log ('space')
            break
    }
})