
function DynamicResize (forceUpdate) {
    function handleResize() {
      forceUpdate()
    } 
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}

function getDimRatio () {
  return {
    X: Math.max(window.innerWidth / 1900, window.screen.availWidth / 1900 / 1.5),
    Y: Math.max(window.innerHeight / 1100, window.screen.availHeight / 1100 / 1.5),
  }
}

function getDimRatioText () {
  return {
    X: Math.max(window.innerWidth / 1900, window.screen.availWidth / 1900 / 1.2),
    Y: Math.max(window.innerHeight / 1100, window.screen.availHeight / 1100 / 1.2),
  }
}


function getDimScreen () {
  return {
    X: window.screen.availWidth,
    Y: window.screen.availHeight,
  }
}


export { DynamicResize, getDimRatio, getDimRatioText, getDimScreen }
