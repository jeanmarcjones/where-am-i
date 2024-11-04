import { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import CircularProgress from '@/components/animations/circular-progress'
import ButtonCircle from '@/components/button-circle'

const INITIAL_DURATION = 1000

export const useCountdown = () => {
  const [countdown, setCountdown] = useState(INITIAL_DURATION)
  const [isPaused, setIsPaused] = useState<boolean>(true)

  useEffect(() => {
    if (countdown === 0 || isPaused) return

    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 100)
    }, 100)

    return () => clearInterval(interval)
  }, [countdown, isPaused])

  const toggle = () => setIsPaused((prevIsPaused) => !prevIsPaused)
  const reset = (countdown?: string) =>
    setCountdown(Number(countdown) ?? INITIAL_DURATION)

  return {
    countdown,
    setCountdown,
    toggle,
    isPaused,
    reset,
  }
}

export default function Timer() {
  const { countdown, setCountdown, isPaused, toggle, reset } = useCountdown()
  const [duration, setDuration] = useState(countdown.toString())

  const progress = useSharedValue(0)

  const durationNumber = Number(duration)

  const onToggle = () => {
    progress.value = withTiming(1, { duration: durationNumber })
    toggle()
  }

  const onReset = () => {
    if (!isPaused) {
      toggle()
    }

    progress.value = 0
    reset(duration)
  }

  const onChangeText = (text: string) => {
    const num = Number(text)

    if (!isNaN(num)) {
      setCountdown(num)
      setDuration(text)
    }
  }

  return (
    <View style={styles.layout}>
      <TextInput
        style={styles.input}
        inputMode="numeric"
        value={duration}
        onChangeText={onChangeText}
        editable={isPaused}
      />

      <Text style={styles.countdown}>{countdown} ms</Text>

      <CircularProgress {...{ progress }} />

      <View style={styles.directionRow}>
        <ButtonCircle onPress={onToggle} disabled={countdown === 0}>
          {isPaused ? 'Start' : 'Pause'}
        </ButtonCircle>
        <ButtonCircle onPress={onReset} disabled={countdown === durationNumber}>
          Reset
        </ButtonCircle>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BCBBB5',
    borderRadius: 5,
    minWidth: '20%',
    textAlign: 'center',
  },
  countdown: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 20,
  },
  directionRow: {
    flexDirection: 'row',
    gap: 20,
  },
})