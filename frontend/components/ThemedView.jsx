import { View, useColorScheme } from 'react-native'
import { colours } from '../constants/colours'

const ThemedView = ({style, ...props}) => {

    const ColorScheme = useColorScheme()
    const theme = colours[ColorScheme] ??  colours.light

  return (
    <View
        style = {[{backgroundColor: theme.background}, style]}
        {...props}
    />
  )
}

export default ThemedView