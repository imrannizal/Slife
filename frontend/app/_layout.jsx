import { Stack } from 'expo-router'
import { PaperProvider } from 'react-native-paper'

const RootLayout = () => {
  return (
    <>
      <PaperProvider>
        <Stack screenOptions={{
          headerShown: false,
        }} />
      </PaperProvider>
    </>
  )
}

export default RootLayout