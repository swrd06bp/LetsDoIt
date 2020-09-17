import React, { useState } from 'react'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

function ScoreBox(props) {

  return (
    <TouchableOpacity 
      style={[styles.scoreContainer, {backgroundColor: props.background}]}
      onPress={props.onSubmit}
    >
      <Text>{props.title}</Text>
    </TouchableOpacity>

  )
}

function Survey (props) {

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        How do you feel?
      </Text>
      <View style={styles.sliderContainer}>
       <ScoreBox onSubmit={() => props.onSubmit(1)} title={'Couldnt be worse'} background={'#cc0000'}/>
       <ScoreBox onSubmit={() => props.onSubmit(2)} title={'Very bad'} background={'#ff0000'}/>
       <ScoreBox onSubmit={() => props.onSubmit(3)} title={'Bad'} background={'#ff3300'}/>
       <ScoreBox onSubmit={() => props.onSubmit(4)} title={'Meh'} background={'#ff9933'}/>
       <ScoreBox onSubmit={() => props.onSubmit(5)} title={'So-so'} background={'#ffff66'}/>
       <ScoreBox onSubmit={() => props.onSubmit(6)} title={'Okay'} background={'#ccff66'}/>
       <ScoreBox onSubmit={() => props.onSubmit(7)} title={'Good'} background={'#66ff33'}/>
       <ScoreBox onSubmit={() => props.onSubmit(8)} title={'Very good'} background={'#33cc33'}/>
       <ScoreBox onSubmit={() => props.onSubmit(9)} title={'Great'} background={'#009933'}/>
       <ScoreBox onSubmit={() => props.onSubmit(10)} title={'Really great'} background={'#006600'}/>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 30,
  },
  sliderContainer: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    width: 150,
    height: 450,
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '10%',
    width: 150,
  }
})

export default Survey


