import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { TextInput, Button, useTheme, Menu, Appbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

import useNoteStore from '../../../store/noteStore';

const NoteEditScreen = () => {
  const { colors } = useTheme();
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const params = useLocalSearchParams();
  const [note, setNote] = useState(null); // Keep null initial state
  const colorsPalette = ['#FFEE93', '#FF9F1C', '#A8DADC', '#CDB4DB', '#A2D2FF'];
  const addNote = useNoteStore(state => state.addNote);
  const updateNote = useNoteStore(state => state.updateNote);
  const deleteNote = useNoteStore(state => state.deleteNote);

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

    // to not include id into the firestore notes table
    const savedNote = {
      owner: note.owner,
      title: note.title,
      color: note.color,
      content: note.content,
      starred: note.starred,
      updated_at: note.updated_at,
    }

    if (params.isNew === "true") {
      addNote(savedNote);
    } else {
      updateNote(note.id, savedNote);
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteNote(note.id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Show loading while note is null (important because we might not have the note immediately)
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

        {params.isNew === "false" && (
          <Appbar.Action
            icon="delete-outline"
            onPress={handleDelete}
            color={colors.error}
            accessibilityLabel="Delete"
            style={styles.actionButton}
          />
        )}

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
        onChangeText={(text) => setNote({ ...note, title: text })}
        style={[styles.input, { backgroundColor: colors.surface }]}
        mode="outlined"
      />

      <TextInput
        label={isMarkdown ? "Content (Markdown)" : "Content"}
        value={note.content}
        onChangeText={(text) => setNote({ ...note, content: text })}
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
                setNote({ ...note, color });
                setShowColorMenu(false);
              }}
              title=""
              style={{ backgroundColor: color, height: 40, margin: 4 }}
            />
          ))}
        </Menu>

        <Button
          icon={note.starred ? "star" : "star-outline"}
          onPress={() => setNote({ ...note, starred: !note.starred })}
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