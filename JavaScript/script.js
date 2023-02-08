let popup = document.getElementById("popupWindow");
let body = document.querySelector('body')
function showPopup(){
popup.classList.add("showPopup");
}
function closepopup(){
popup.classList.remove("showPopup");
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

let countA = 0

let countB = 0

const inputs = {
  ArrowUp: {
    pressed: false
  },

  ArrowDown: {
    pressed: false
  },

  ArrowLeft: {
    pressed: false
  },

  ArrowRight: {
    pressed: false
  },
  
  Enter: {
    pressed: false
  },
}

function secret() {
  requestAnimationFrame(secret)
  if (inputs.ArrowUp.pressed && inputs.ArrowDown.pressed && inputs.ArrowLeft.pressed && inputs.ArrowRight.pressed && inputs.Enter.pressed && countA === 2 && countB === 2) {
    window.location.href = 'secret.html'
  }
}

secret()

addEventListener('keydown', ({key}) => {
  console.log(key)
  switch(key) {
    case 'ArrowUp':
      inputs.ArrowUp.pressed = true
      break
    case 'ArrowDown':
      inputs.ArrowDown.pressed = true
      break
    case 'ArrowLeft':
      inputs.ArrowLeft.pressed = true
      break
    case 'ArrowRight':
      inputs.ArrowRight.pressed = true
      break
    case 'Enter':
      inputs.Enter.pressed = true
      break
    case 'a':
      countA += 1
      break
    case 'b':
      countB += 1
      break
  }
})