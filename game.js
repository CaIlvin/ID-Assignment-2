const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Plane {
    constructor() {


        const plane = new Image()
        plane.src = './Images/fighter-jet.png'
        plane.onload = () => {
        this.image = plane
        this.width = plane.width * 0.15
        this.height = plane.height * 0.15
        this.position = {
            x: canvas.width / 2 - this.width / 2, //Set x position of plane to be center of web 
            y: canvas.height - this.height - 20 //Set y position of plane to be bottom of web
        }

        this.velocity = {
            x:0,
            y:0
        }                    
        }


    }

    load() {
        if (this.image)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}

const plane = new Plane()
plane.load()

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = '#333'
    c.fillRect(0, 0, canvas.width, canvas.height)
    plane.load()
}

animate()