import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { TextInput, Button, useTheme, Menu, Appbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { updateNote, getUserNotes, addNewNote } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../../store/authStore';

const NoteEditScreen = () => {
  const { colors } = useTheme();
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const params = useLocalSearchParams();
  const [note, setNote] = useState(null); // Keep null initial state
  const colorsPalette = ['#FFEE93', '#FF9F1C', '#A8DADC', '#CDB4DB', '#A2D2FF'];
  const setUserNotes = useAuthStore((state => state.setUserNotes));

  // Initialize note from navigation params
  useEffect(() => {
    if (params.note) {
    const parsedNote = JSON.parse(params.note);
    setNote({
        ...parsedNote,
        color: parsedNote.color || colorsPalette[0],
        starred: parsedNote.starred || false,
    });
    } else {
      router.back();
    }
  }, []);

const handleSave = async () => {
  if (note.id === "new"){
    try{
      
      await addNewNote(note.owner, note);

    } catch {
      console.error("Failed adding new notes")
    }

  } else
    try {
      
      await updateNote(note.id, note);
      
    } catch (error) {
      console.error("Update failed:", error);
    }
    
  // 2. Get fresh notes (or update locally if you prefer)
  const freshNotes = await getUserNotes(note.owner);
  
  // 3. Update both state and AsyncStorage
  setUserNotes({ noteList: freshNotes });
  await AsyncStorage.setItem('noteList', JSON.stringify({ noteList: freshNotes }));

  router.back();
};

  const handleDelete = () => {
    router.back();
  };

  // Show loading while note is null (important because we might not have the note immediately
  if (!note) return <Text>Loading...</Text>;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Appbar.Header style={styles.header}>
        <Appbar.Action 
          icon="arrow-left"
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        />

        <Appbar.Content
          title="Edit Note"
          titleStyle={{ fontWeight: 'bold' }}
        />

        <View style={styles.spacer} />

        <Appbar.Action 
          icon="delete-outline"
          onPress={handleDelete}
          color={colors.error}
          accessibilityLabel="Delete"
          style={styles.actionButton}
        />
        <Appbar.Action 
          icon="check"
          onPress={handleSave}
          accessibilityLabel="Save"
          style={styles.actionButton}
        />
      </Appbar.Header>

      <TextInput
        label="Title"
        value={note.title}
        onChangeText={(text) => setNote({...note, title: text})}
        style={[styles.input, { backgroundColor: colors.surface }]}
        mode="outlined"
      />

      <TextInput
        label={isMarkdown ? "Content (Markdown)" : "Content"}
        value={note.content}
        onChangeText={(text) => setNote({...note, content: text})}
        multiline
        numberOfLines={10}
        style={[styles.input, { 
          backgroundColor: colors.surface,
          minHeight: 200 
        }]}
        mode="outlined"
      />

      <View style={styles.actionsRow}>
        <Menu
          visible={showColorMenu}
          onDismiss={() => setShowColorMenu(false)}
          anchor={
            <Button 
              icon="palette" 
              onPress={() => setShowColorMenu(true)}
              mode="outlined"
            >
              Color
            </Button>
          }
        >
          {colorsPalette.map((color) => (
            <Menu.Item
              key={color}
              onPress={() => {
                setNote({...note, color});
                setShowColorMenu(false);
              }}
              title=""
              style={{ backgroundColor: color, height: 40, margin: 4 }}
            />
          ))}
        </Menu>

        <Button 
          icon={note.starred ? "star" : "star-outline"}
          onPress={() => setNote({...note, starred: !note.starred})}
          mode="outlined"
        >
          {note.starred ? "Starred" : "Star"}
        </Button>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 8,
  },
  input: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  footer: {
    marginTop: 24,
  },
  button: {
    marginVertical: 8,
  },
  spacer: {
    flex: 1 // Takes all available space
  },
  actionButton: {
    marginRight: -4, // Tightens right-side spacing
    width: 48,
    justifyContent: 'center'
  },
  backButton: {
    marginLeft: -8, // Pushes further left
    width: 48,
    justifyContent: 'center'
  }
});

export default NoteEditScreen;