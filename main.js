'use strict';

// determine slide number
const slideNumber = 5;
const slides = [...Array(slideNumber + 1).keys()].slice(1) // [1,2,3,4,5]

// mount slides and circles to viewport
const viewport = document.getElementById('viewport')
const bottombar = document.getElementsByClassName('number')[0]

slides.forEach((val) => {
  let image = document.createElement('img')
  let circle = document.createElement('div')

  image.classList.add('image', `image-${val}`)
  image.src = `http://via.placeholder.com/640x400?text=${val}`
  viewport.appendChild(image)

  circle.classList.add('circle', `circle-${val}`)
  if (val === 1) circle.classList.add('active')
  circle.innerHTML = val
  bottombar.appendChild(circle)
})

// slide state management
const position =  [...Array(slideNumber).keys()].map((val) => val*-100 + '%')
let toggle = 0

// define toggle function
const toggleImage = (direction) => {
  if (toggle === slideNumber-1 && direction === 'right') toggle = 0
  else if (toggle === 0 && direction === 'left') toggle = slideNumber-1
  else toggle = direction === 'right' ? (toggle+1) : (toggle-1)

  let images = document.getElementsByClassName('image');
  [...images].forEach((el) => {
    el.style.left = position[toggle]
  })

  let active = document.getElementsByClassName('active')[0]
  let current = document.getElementsByClassName(`circle-${toggle+1}`)[0]

  if (active) active.classList.remove('active')
  current.classList.add('active')
}
