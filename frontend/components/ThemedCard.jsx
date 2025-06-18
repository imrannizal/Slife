import { StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

const ThemedCard = ({ children, style, onPress = () => {}}) => {
  const { colors } = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      {children}
    </Card>
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 12,
    elevation: 4,
    padding: 16,
  },
});