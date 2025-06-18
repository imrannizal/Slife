import { StyleSheet, View } from 'react-native'
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const Notification = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="Notifications"
          titleStyle={{ textAlign: 'center', alignSelf: 'center' }}
        />
      </Appbar.Header>

      {/* Your search content goes here */}
    </View>
  );
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
