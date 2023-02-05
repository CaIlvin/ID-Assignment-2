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
    constructor({position}) {
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
            x: position.x, //Set x position of alien
            y: position.y //Set y position of alien
        }           
        }
    }

    load() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.load()
            this.position.x += velocity.x //Shift plane position 
            this.position.y += velocity.y //Shift plane position 
        }
    }
}

class Group {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x:4,
            y:0
        }

        this.aliens = []
        const randomColumn = Math.floor(Math.random() * 10 + 5) // Generate random column of aliens 
        const randomRow = Math.floor(Math.random() * 5 + 2) // Generate random row of aliens

        this.width = randomColumn * 50
        
        for (let i=0; i<randomColumn; i++) {
           for (let n=0; n<randomRow; n++) {
            this.aliens.push(
                new Alien({
                    position: { // Space the aliens evenly 
                        x: i * 50,
                        y: n * 50
                    }
                })
              )
           }
        }
        console.log(this.aliens)
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0
        
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x 
            this.velocity.y = 50          
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

const lasers = [] // To fire multiple laser 

const groups = []

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

let frames = 0

let frameSpawn = Math.floor((Math.random() * 700) + 500) 

function animate() { // Initalize plane and aliens 
    requestAnimationFrame(animate)
    c.fillStyle = '#333'
    c.fillRect(0, 0, canvas.width, canvas.height)
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

    groups.forEach(group => {
        group.update()
        group.aliens.forEach((alien, i) => {
            alien.update({velocity: group.velocity}) // Set the velocity of the group

            lasers.forEach((laser, n) => {
                if (laser.position.y - laser.radius <= alien.position.y + alien.height && laser.position.x + laser.radius
                    >= alien.position.x && laser.position.x - laser.radius <= alien.position.x &&
                    laser.position.y + laser.radius >= alien.position.y) { // Detect collision of laser and alien, laser must be inbetween the left and right of the alien

                    setTimeout(() => { // Remove said laser and alien 
                        group.aliens.splice(i, 1)
                        lasers.splice(n, 1)
                    }, 0)
                }
            })
        })
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

    if (frames % frameSpawn === 0){ // Spawn new group of alien
        groups.push(new Group())
        frameSpawn = Math.floor((Math.random() * 700) + 500)
        frames = 0
    }

    frames++
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