import { Text, useColorScheme } from 'react-native'
import { colours } from '../constants/colours'

const ThemedText = ({style, title=false, ...props}) => {

    const ColorScheme = useColorScheme()
    const theme = colours[ColorScheme] ??  colours.light

    const textColours = title ? theme.title : theme.text

  return (
    <Text 
        style = {[{color: textColours}, style]}
        {...props}
    />
  )
}

export default ThemedText