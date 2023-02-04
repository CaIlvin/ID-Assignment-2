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
        plane.src = './Images/Fighter jet 2.png'
        plane.onload = () => {
        this.image = plane
        this.width = plane.width * .2
        this.height = plane.height * .2
        this.position = {
            x: canvas.width / 2 - this.width / 2, //Set x position of plane to be center of web 
            y: canvas.height - this.height - 20 //Set y position of plane to be bottom of web
        }           
        }
    }

    load() {
        c.save()
        c.translate(
            plane.position.x + plane.width / 2,
            plane.position.y + plane.height / 2
        )

        c.rotate(this.rotation) // Rotate image with canvas

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

class Alien {
    constructor() {
        this.velocity = {
            x:0,
            y:0
        }      

        const alien = new Image()
        alien.src = './Images/alien.png'
        alien.onload = () => {
        this.image = alien
        this.width = alien.width * .1
        this.height = alien.height * .1
        this.position = {
            x: canvas.width / 2 - this.width / 2, //Set x position of plane to be center of web 
            y: canvas.height / 2 //Set y position of plane to be bottom of web
        }           
        }
    }

    load() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        if (this.image) {
            this.load()
            this.position.x += this.velocity.x //Shift plane position 
            this.position.y += this.velocity.y //Shift plane position 
        }
    }
}



class Laser {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }
    
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //Create a circle 
        c.fillStyle = 'rgb(223, 15, 15)'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const plane = new Plane()

const alien = new Alien()

const lasers = [] // To fire multiple laser 

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
    alien.update()
    plane.update()
    lasers.forEach((Laser, index) => {
        if (Laser.position.y + Laser.radius <= 0) { //Remove fired laser from array to prevent it slowing down process
            setTimeout(() => { // Prevent afterimage of laser bullet
                lasers.splice(index, 1)                
            }, 0)
        }

        else {
            Laser.update() //Update position of each laser bullet            
        }

    })
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
            keys.q.pressed = true
            break
        case 'e': // Move plane to the right
            keys.e.pressed = true
            break
        case ' ': // Fire button
            lasers.push(new Laser({ // Append laser to array 
                position: {
                    x: plane.position.x + plane.width / 2,
                    y: plane.position.y,
            
                },
            
                velocity: {
                    x:0,
                    y:-20
                }
            }))
            break
    }
})

addEventListener('keyup', ({key}) => { //Get the key being released by the player
    switch (key) {
        case 'q': // Stop plane movement
            keys.q.pressed = false
            break
        case 'e':
            keys.e.pressed = false
            break
        // case ' ': // Fire button
        //     break
    }
})