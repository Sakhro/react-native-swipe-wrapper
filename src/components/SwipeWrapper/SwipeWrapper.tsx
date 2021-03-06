import React, { CSSProperties, FC, useEffect, useState } from 'react'
import { Animated, PanResponder, PanResponderInstance } from 'react-native'

import { getAnimatedViewStyle, IAnimatedViewStyle } from './styles'

interface IAnimationProps {
  item: any
  rightSwipeThreshold?: number
  leftSwipeThreshold?: number
  onSwipeLeft: (item: any) => void
  onSwipeRight: (item: any) => void
}
interface IProps extends IAnimationProps {
  items: any[]
  index: number
  style?: CSSProperties
  isStack?: boolean
  cardRotation?: number
}

const getPanHandlers = (panResponder: PanResponderInstance | null) =>
  panResponder
    ? panResponder.panHandlers
    : {}

const onPanResponderRelease = (
  pan: Animated.ValueXY, 
  { rightSwipeThreshold, leftSwipeThreshold, onSwipeRight, onSwipeLeft, item }: IAnimationProps
) => () => {
  const value = (pan.x as any)._value

  const isSwipeRight = value > (rightSwipeThreshold as number)
    && !!onSwipeRight
  const isSwipeLeft = value < (leftSwipeThreshold as number)
    && !!onSwipeLeft

  switch (true) {
    case isSwipeLeft:
      onSwipeLeft(item)
      break
    case isSwipeRight:
      onSwipeRight(item)
      break
    default:
      Animated.spring(pan, {
        toValue: 0,
      }).start()
  }
}

const onPanResponderGrant = (pan: Animated.ValueXY) => () => {
  pan.setValue({ x: 0, y: 0 })
}

const onPanResponderMove = (pan: Animated.ValueXY) => (e, gestureState) => {
  Animated.event([
    null, { dx: pan.x, dy: pan.y },
  ])(e, gestureState)
}

export const SwipeWrapper: FC<IProps> = ({
  children, style, ...other
}) => {
  const [pan] = useState(new Animated.ValueXY());
  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(null)

  useEffect(() => {
    const updatedPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: onPanResponderGrant(pan),
      onPanResponderMove: onPanResponderMove(pan),
      onPanResponderRelease: onPanResponderRelease(pan, other)
    })

    setPanResponder(updatedPanResponder)

    return () => {
      pan.x.removeAllListeners()
      pan.y.removeAllListeners()
    }
  }, [])

  return (
    <Animated.View
      style={[
        getAnimatedViewStyle(pan, other as IAnimatedViewStyle),
        style
      ]}
      {...getPanHandlers(panResponder)}
    >
      {children}
    </Animated.View>
  )
}

SwipeWrapper.defaultProps = {
  rightSwipeThreshold: 150,
  leftSwipeThreshold: -150
}