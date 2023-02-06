const scoreCount = document.querySelector('#score')
const canvas = document.querySelector('canvas')
let popup = document.getElementById('popupWindow')
const c = canvas.getContext('2d')
const APIKEY = "63d202d4a95709597409cfa8";
                    
canvas.width = innerWidth
canvas.height = innerHeight

class Plane {
    constructor() {
        this.velocity = {
            x:0,
            y:0
        }      
        
        this.rotation = 0

        this.opacity = 1

        const plane = new Image()
        plane.src = './Images/fighterJet.png'
        plane.onload = () => {
        this.image = plane
        this.width = plane.width * .05
        this.height = plane.height * .05
        this.position = {
            x: canvas.width / 2 - this.width / 2, //Set x position of plane to be center of web 
            y: canvas.height - this.height - 20 //Set y position of plane to be bottom of web
        }           
        }
    }

    load() {
        c.save()
        c.globalAlpha = this.opacity
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

class alienLaser {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.width = 4
        this.height = 12
    }
    
    draw() { //Create a circle 
        c.fillStyle = '#5CE6CE'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
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
            this.position.x += velocity.x //Shift alien position 
            this.position.y += velocity.y //Shift alien position 
        }
    }

    fire(alienLasers) {
        alienLasers.push (new alienLaser({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height 
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: 10
            }
        }))
    }
}


class Group {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x:5,
            y:0
        }

        this.aliens = []
        const randomColumn = Math.floor(Math.random() * 10 + 5) // Generate random column of aliens 
        const randomRow = Math.floor(Math.random() * 5 + 3) // Generate random row of aliens

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
        c.fillStyle = '#B33639'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1

        this.fade = fades

    }
    
    draw() {
        c.save()
        c.globalAlpha = this.opacity //Fading animation 
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //Create a circle 
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y


        if (this.fade) {
            this.opacity -= 0.01
        }

    }
}

const plane = new Plane()

const lasers = [] // To fire multiple laser 

const groups = []

const alienLasers = []

const particles = []

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

let score = 0

var time = 0

let game = {
    end: false,
    run: true
}

let frames = 0

let frameSpawn = Math.floor((Math.random() * 100) + 500) 

var timer = setInterval(upTimer, 1000);

for (let i = 0; i < 100; i++){
    particles.push(new Particle({ // Create particle effects upon alien killed
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        }, 
        velocity: {
            x: 0,
            y: 3
        },
        radius: Math.random() * 5,
        color: '#CCCCCC'
    }) )                            
}

window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 500)
  }
  document.addEventListener('DOMContentLoaded', function(event) {
      document.querySelector('body').style.opacity = 1
  })

function upTimer() {
    if (!game.run) return
    ++time;
    document.getElementById('time').innerHTML = time
}


function displayParticles({object, color, fades}) {
    for (let i = 0; i < 12; i++){
        particles.push(new Particle({ // Create particle effects upon alien killed
            position: {
                x: object.position.x + object.width / 2 , 
                y: object.position.y + object.height / 2
            }, 
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#66806D',
            fades
        }) )                            
    }
}

function animate() { // Initalize the game
    if (!game.run) return
    requestAnimationFrame(animate)
    c.fillStyle = '#333'
    c.fillRect(0, 0, canvas.width, canvas.height)
    plane.update()
    particles.forEach( (particle, index) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) { // Fade particles out
            setTimeout(() => {
                particles.splice(index, 1)
            }, 0)
        }
        else {
            particle.update()            
        }

    })
    alienLasers.forEach((alienLaser, index) => {
        if (alienLaser.position.y + alienLaser.height >= canvas.height) {
            setTimeout(() => { 
                alienLasers.splice(index, 1)                
            }, 0) 
        }

        else{
        alienLaser.update()            
        }

        if(alienLaser.position.y + alienLaser.height >= plane.position.y && // Plane gets hit
            alienLaser.position.x + alienLaser.width >= plane.position.x &&
            alienLaser.position.x <= plane.position.x + plane.width){

                setTimeout(() => { 
                    alienLasers.splice(index, 1)
                    plane.opacity = 0
                    game.end = true             
                }, 0) 

                setTimeout(() => { 
                    game.run = false
                    popup.classList.add("showPopup")
                }, 1000)

                displayParticles({
                    object: plane,
                    color: '#807373',
                    fades: true
                })
        }
    })
    lasers.forEach((Laser, index) => {
        if (Laser.position.y + Laser.radius <= 0) { //Remove fired laser from array to prevent it slowing down process
            setTimeout(() => { 
                lasers.splice(index, 1)                
            }, 0)
        }

        else {
            Laser.update() //Update position of each laser bullet            
        }
    })

    groups.forEach((group, groupNum) => {
        group.update()
        if (frames % 50 === 0 && group.aliens.length > 0 ){ // Alien fires laser
            group.aliens[Math.floor(Math.random() * group.aliens.length)].fire(alienLasers)
        }
        group.aliens.forEach((alien, i) => {
            alien.update({velocity: group.velocity}) // Set the velocity of the group

            lasers.forEach((laser, n) => {
                if (laser.position.y - laser.radius <= alien.position.y + alien.height && laser.position.x + laser.radius
                    >= alien.position.x && laser.position.x - laser.radius <= alien.position.x + alien.width &&
                    laser.position.y + laser.radius >= alien.position.y) { // Detect collision of laser and alien, laser must be inbetween the left and right of the alien

                    setTimeout(() => { // Remove said laser and alien 
                        const alienKilled = group.aliens.find(alienDied => {
                            return alienDied === alien // Check for the alien in the array 
                        })

                        const laserShot = lasers.find(laserHit =>
                            laserHit === laser)

                        if (alienKilled && laserShot) { // Both conditions fulfilled
                            score += 200
                            scoreCount.innerHTML = score
                            displayParticles({
                                object: alien,
                                fades: true
                            })

                            group.aliens.splice(i, 1)
                            lasers.splice(n, 1)    

                            if(group.aliens.length > 0) { //Dynamic update of the length of the group 
                                const firstAlien = group.aliens[0]
                                const lastAlien = group.aliens[group.aliens.length - 1]

                                group.width = lastAlien.position.x - firstAlien.position.x + lastAlien.width

                                group.position.x = firstAlien.position.x
                            }
                            else {
                                groups.splice(groupNum, 1) // Remove eliminated group
                            }
                        }
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
        frameSpawn = Math.floor((Math.random() * 200) + 200)
        frames = 0
    }

    frames++
}

animate()

addEventListener('keydown', ({key}) => { //Get the input being pressed by the player
    if (game.end) return
    switch (key) {
        case 'q': // Move plane to the left
            keys.q.pressed = true
            break
        case 'Q': // Move plane to the left
            keys.q.pressed = true
            break        
        case 'e': // Move plane to the right
            keys.e.pressed = true
            break
        case 'E': // Move plane to the right
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
                    y:-30   
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
        case 'Q': // Stop plane movement
            keys.q.pressed = false
            break
        case 'E':
            keys.e.pressed = false
            break
    }
})

$(document).ready(function () {
    getScore();
    $("#scoreSubmit").on("click", function(e){
        e.preventDefault();
        let playerName = $("#playerName").val();
        let playerScore = score;
        let playerTime = time;
    
        let jsondata = {
            "Name": playerName,
            "Score": playerScore,
            "Time": playerTime
        };
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://scoreboard-0ca7.restdb.io/rest/player",
            "method": "POST",
            "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(jsondata),
            'beforeSend':function() {
                $("scoreSubmit").prop("disabled", true);
                $("scoreSubmit").trigger("reset");

            }
        }

        $.ajax(settings).done(function (response) {
            getScore();
        });


    })


})

function getScore(limit = 10, all = true) {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://scoreboard-0ca7.restdb.io/rest/player",
        "method": "GET",
        "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
        },
    }  

    $.ajax(settings).done(function (response) {
        let content = ""
        for (var i = 0; i < response.length && i < limit; i++)
        {
            content = `${content}
            <tr id='${response[i]._id}'><td>${response[i].Name}</td>
          <td>${response[i].Score}</td><td>${response[i].Time}</td>`
        }
    })
}