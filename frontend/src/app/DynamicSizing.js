
function DynamicResize (forceUpdate) {
    function handleResize() {
      forceUpdate()
    } 
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}

function getDimRatio () {
  return {
    X: window.screen.availWidth / 1900,
    Y: window.screen.availHeight / 1100,
  }
}


function getDimScreen () {
  return {
    X: window.screen.availWidth,
    Y: window.screen.availHeight,
  }
}


export { DynamicResize, getDimRatio, getDimScreen }
