import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { SwipeWrapper } from '../SwipeWrapper'

import s from './styles'

const initialCards = ['GO', 'THREE', 'TWO', 'ONE']

export const App: FC = () => {
  const [cards, setCards] = useState(initialCards)

  const onSwipe = (item: string) => {
    setCards(prevState => prevState.filter(card => card !== item))
  }

  return (
    <View style={s.container}>
      <View style={s.content}>
        {cards.map((item, index) => (
          <SwipeWrapper
            key={item}
            item={item}
            items={cards}
            index={index}
            style={s.wrapper}
            isStack={true}
            onSwipeRight={onSwipe}
            onSwipeLeft={onSwipe}
          >
            <Text>
              {item}
            </Text>
          </SwipeWrapper>
        ))}
      </View>
    </View>
  )
}