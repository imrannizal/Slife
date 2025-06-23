import { View, StyleSheet, Linking } from 'react-native';
import { Text, useTheme, Card, Divider } from 'react-native-paper';
import ThemedCard from '../../components/ThemedCard';

const About = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedCard style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={[styles.title, { color: colors.primary }]}>
            About Slife
          </Text>
          <Divider style={styles.divider} />
          
          <Text variant="bodyLarge" style={styles.description}>
            Slife is a focused productivity app designed for students, combining personal task management with collaborative workspace features.
          </Text>

          <Text variant="bodyMedium" style={styles.feature}>
            ✓ Cloud-synced notes & todos across devices
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            ✓ Team workspaces with real-time collaboration
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            ✓ Simple token-based invitation system
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            ✓ Equipped with notifications and reminders
          </Text>
          <Text variant="bodyMedium" style={styles.feature}>
            ✓ Structured environment for academic focus
          </Text>

          <Divider style={styles.divider} />

          <Text variant="bodySmall" style={styles.footer}>
            Version 1.0.0 {'\n'}
            © {new Date().getFullYear()} imrannizal
          </Text>
        </Card.Content>
      </ThemedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 20,
    lineHeight: 24,
  },
  feature: {
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default About;