import React, { useEffect, useState } from 'react'
import Switch from "react-switch"

import { getDimRatio, getDimRatioText } from '../../app/DynamicSizing'
import TopNavigation from '../../app/Navigation'
import Api from '../../app/Api'




function CustomizationPage (props) {
  const [isLaoding, setIsLoading] = useState(true)
  const [happiness, setHappiness] = useState(false)
  const [dailyFocus, setDailyFocus] = useState(false)
  const [weeklyFocus, setWeeklyFocus] = useState(false)
  const api = new Api()

  useEffect(() => {
    getCurrentCustomization()
  }, [])

  const getCurrentCustomization = async () => {
    const resp = await api.getCustomization() 
    const json = await resp.json()
    if (json[0].customization) {
      const customization = json[0].customization
      setHappiness(customization.happiness)
      setDailyFocus(customization.dailyFocus)
      setWeeklyFocus(customization.weeklyFocus)
    }
    setIsLoading(false)
  } 


  return (
    <div>
      <TopNavigation />
      {!isLaoding && ( <div style={styles().wrapper}>
        <div style={styles().title}>Customize your experience</div>
        <div style={styles().itemWrapper}>
          <div style={styles().headerTitle}>
            <Switch checked={dailyFocus} onChange={(value) => {
              setDailyFocus(value)
              api.setCustomization({dailyFocus: value, weeklyFocus, happiness})
            }} />
            <div style={styles().headerTitleText}>Show daily focus</div>
          </div>
          <div style={styles().descriptionText}>
            Track your daily focus and show its history.
          </div>
        </div>
        
        <div style={styles().itemWrapper}>
          <div style={styles().headerTitle}>
            <Switch checked={weeklyFocus} onChange={(value) => {
              setWeeklyFocus(value)
              api.setCustomization({dailyFocus, weeklyFocus: value, happiness})
            }} />
            <div style={styles().headerTitleText}>Show weekly focus</div>
          </div>
          <div style={styles().descriptionText}>
            Track your weekly focus and show its history.
          </div>
        </div>
    
        <div style={styles().itemWrapper}>
          <div style={styles().headerTitle}>
            <Switch checked={happiness} onChange={(value) => {
              setHappiness(value)
              api.setCustomization({dailyFocus, weeklyFocus, happiness: value})
            }} />
            <div style={styles().headerTitleText}>Show happiness tracker</div>
          </div>
          <div style={styles().descriptionText}>
            Track your happiness daily and show its history.
          </div>
        </div>
    
      </div>
      )}
    </div>
  )
}

const styles = () => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 40 * getDimRatioText().X,
    fontWeight: 'bold',
    marginBottom: 50 * getDimRatio().Y,
  },
  itemWrapper: {
    width: 600 * getDimRatio().X,
    height: 150 * getDimRatio().Y,
    marginTop: 30 * getDimRatio().Y,
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontWeight: 'bold',
    fontSize: 24 * getDimRatioText().X,
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 20 * getDimRatioText().X,
    marginTop: 20 * getDimRatioText().Y,
  },

})


export default CustomizationPage


