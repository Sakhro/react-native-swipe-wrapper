import { StyleSheet, Animated } from 'react-native';

export interface IAnimatedViewStyle {
  items: any[]
  index: number
  isStack?: boolean
  cardRotation?: number
  leftSwipeThreshold: number
  rightSwipeThreshold: number
}

const styles = StyleSheet.create({
  shadowStyle: {
    shadowColor: '#555555',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10.32,
    elevation: 16,
  }
});

const getCardMultiplier = (cardStockNumber: number) =>
  (cardStockNumber > 3
    ? 3
    : cardStockNumber) - 1

const getCardShadow = (cardStockNumber: number) =>
  cardStockNumber < 4
    ? styles.shadowStyle
    : null

const getTranslateYValue = (pan: Animated.ValueXY, isStack: boolean) =>
  isStack
    ? pan.y
    : 0

const getScaleValue = (isStack: boolean, cardMultiplier: number) =>
  isStack
    ? 1 - (cardMultiplier - 1) * 0.03
    : 1

const getStyles = (isStack: boolean, cardStockNumber: number) => {
  const cardMultiplier = getCardMultiplier(cardStockNumber)
  const cardShadow = getCardShadow(cardStockNumber)

  const scaleValue = getScaleValue(isStack, cardMultiplier)
  const defaultStyles = isStack
    ? {
      position: 'absolute',
      top: 10 * cardMultiplier,
      zIndex: -1 * cardMultiplier,
      ...cardShadow,
    }
    : {}

  return {
    defaultStyles,
    scaleValue
  }
}

export const getAnimatedViewStyle = (
  pan: Animated.ValueXY, {
    items, index, isStack = false, leftSwipeThreshold, rightSwipeThreshold, cardRotation = 10
  }: IAnimatedViewStyle
) => {
  const cardStockNumber = items.length - index
  const translateYValue = getTranslateYValue(pan, isStack)

  const { defaultStyles, scaleValue } = getStyles(isStack, cardStockNumber)

  return [
    {
      ...defaultStyles,
      transform: [
        { scale: scaleValue },
        { translateX: pan.x },
        { translateY: translateYValue },
        {
          rotate: pan.x.interpolate(
            {
              inputRange: [leftSwipeThreshold, 0, rightSwipeThreshold],
              outputRange: [`-${cardRotation}deg`, '0deg', `${cardRotation}deg`],
            }
          ),
        },
      ],
    },
  ]
}
