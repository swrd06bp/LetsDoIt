
function DynamicResize (forceUpdate) {
    function handleResize() {
      forceUpdate()
    } 
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}

function getDimRatio () {
  return {
    X: Math.min(1, Math.max(window.innerWidth / 1900, 0.5)),
    Y: Math.min(1, Math.max(window.innerHeight / 1100, 0.5)),
  }
}

function getDimRatioText () {
  return {
    X: Math.min(1, Math.max(window.innerWidth / 1900, 0.7)),
    Y: Math.min(1, Math.max(window.innerHeight / 1100, 0.7)),
  }
}


function getDimScreen () {
  return {
    X: window.screen.availWidth,
    Y: window.screen.availHeight,
  }
}


export { DynamicResize, getDimRatio, getDimRatioText, getDimScreen }
