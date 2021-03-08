const scoreToColor = (score) => {
  if (score === 1)
    return '#cc0000'
  else if (score === 2)
    return '#ff0000'
  else if (score === 3)
    return '#ff3300'
  else if (score === 4)
    return '#ff9933'
  else if (score === 5)
    return '#ffff66'
  else if (score === 6)
    return '#ccff66'
  else if (score === 7)
    return '#66ff33'
  else if (score === 8)
    return '#33cc33'
  else if (score === 9)
    return '#009933'
  else if (score === 10)
    return '#006600'
}

export { scoreToColor } 
