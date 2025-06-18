import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const Search = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="Search"
          titleStyle={{ textAlign: 'center', alignSelf: 'center' }}
        />
        <Appbar.Action icon="magnify" onPress={() => console.log('Searching...')} />
      </Appbar.Header>

      {/* Your search content goes here */}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
