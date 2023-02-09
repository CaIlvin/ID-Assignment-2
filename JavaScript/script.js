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
// Get the audio element and the volume control buttons
const audio = document.getElementById("background-music");
const volumeDown = document.getElementById("volume-down");
const volumeUp = document.getElementById("volume-up");

// Add event listeners for the volume control buttons
volumeDown.addEventListener("click", function() {
  audio.volume = Math.max(0, audio.volume - 0.1);
});
volumeUp.addEventListener("click", function() {
  audio.volume = Math.min(1, audio.volume + 0.1);
});
let countUp = 0

let countDown = 0

let countLeft = 0

let countRight = 0
const inputs = {
  A: {
    pressed: false
  },

  B: {
    pressed: false
  },
  
  Enter: {
    pressed: false
  },
}

function secret() {
  requestAnimationFrame(secret)
  if (inputs.A.pressed && inputs.B.pressed && inputs.Enter.pressed && countUp === 2 && countDown === 2 && countLeft === 2 && countRight === 2) {
    window.location.href = 'secret.html'
  }
}

secret()

addEventListener('keydown', ({key}) => {
  console.log(key)
  switch(key) {
    case 'a':
      inputs.A.pressed = true
      break
    case 'b':
      inputs.B.pressed = true
      break
    case 'ArrowUp':
      countUp += 1
      break
    case 'ArrowDown':
      countDown += 1
      break
    case 'ArrowLeft':
      countLeft += 1
      break
    case 'ArrowRight':
      countRight += 1
      break
    case 'Enter':
      inputs.Enter.pressed = true
      break
  }
})