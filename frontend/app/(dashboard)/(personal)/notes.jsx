import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme, FAB, Portal, IconButton, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import ThemedCard from '../../../components/ThemedCard';

import useAuthStore from '../../../store/authStore';
import useNoteStore from '../../../store/noteStore';

const NotesScreen = () => {
  const { colors } = useTheme();
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);  
  const [loading, setLoading] = useState(false);
  const notes = useNoteStore(state => state.notes);
  const toggleStar = useNoteStore(state => state.toggleNoteStar);

  // Display FAB when screen is not focused
  useFocusEffect(() => {
    setFabVisible(true);
    return () => setFabVisible(false); // Hide when leaving screen
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator animating={true} color={colors.primary} size="large" />
      </View>
    );
  }

  const addNewNote = async () => {
    // Generate a temporary ID (will be replaced with real Firestore ID later)
    const tempId = `temp-${Date.now()}`;

    const user = useAuthStore.getState().user

    // Create new note data
    const newNote = {
      id: tempId,
      title: "New Note",
      content: "Write your content here...",
      color: "#ffeb3b", // yellow
      starred: false,
      owner: user.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Navigate to edit screen with the new note
    router.push({
      pathname: '/editNotes/[id]',
      params: {
        id: tempId,
        note: JSON.stringify(newNote),
        isNew: "true" // Add flag to indicate this is a new note
      }
    });
  };

  const handleNotePress = (note) => {

    // Navigate to note detail screen
    router.push({
      pathname: '/editNotes/[id]',
      params: {
        id: note.id,
        note: JSON.stringify(note),
        isNew: "false"
      }
    });
  };

  const groupNotesByTime = (notes) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    return notes.reduce((acc, note) => {
      const noteDate = new Date(note.updated_at);
      
      if (noteDate >= today) {
        acc.today.push(note);
      } else if (noteDate >= yesterday) {
        acc.yesterday.push(note);
      } else if (noteDate >= lastWeek) {
        acc.lastWeek.push(note);
      } else if (noteDate >= lastMonth) {
        acc.lastMonth.push(note);
      } else if (noteDate >= lastYear) {
        acc.lastYear.push(note);
      } else {
        acc.older.push(note);
      }
      
      return acc;
    }, { today: [], yesterday: [], lastWeek: [], lastMonth: [], lastYear: [], older: [] });
  };

  // Floating Action Button actions
  const fabActions = [
    {
      icon: 'plus',
      label: 'Add Note',
      onPress: () => addNewNote(),
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
    {
      icon: 'star',
      label: 'Starred',
      onPress: () => {
        console.log('Show starred notes');
      },
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {notes.length === 0 ? (
        <Text style={{ color: colors.text }}>No notes found</Text>
      ) : (
        <>
          {Object.entries(groupNotesByTime(notes)).map(([timePeriod, notes]) => (
            notes.length > 0 && (
              <View key={timePeriod}>

                <Text style={[styles.sectionHeader, { color: colors.primary }]}>
                  {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
                <Divider style={{ marginVertical: 10, marginHorizontal: 16 }} />

                <View style={styles.notesGrid}>
                  {notes.map(note => (
                    <View
                      key={`${note.id || 'note'}-${note.updated_at}`}
                      style={styles.noteColumn}
                    >
                      <ThemedCard
                        style={{ backgroundColor: note.color || colors.surface, padding: 8 }}
                        onPress={() => handleNotePress(note)}
                      >
                        <View style={[styles.noteHeader, { marginBottom: -8, marginTop: -8 }]}>
                          <Text style={[styles.noteDate, { color: colors.text }]}>
                            {new Date(note.updated_at).toLocaleDateString()}
                          </Text>
                          <IconButton
                            icon={note.starred ? "star" : "star-outline"}
                            iconColor={note.starred ? colors.warning : colors.text}
                            size={20}
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleStar(note.id);
                            }}
                          />
                        </View>
                        <Text style={[styles.noteTitle, { color: colors.text }]}>
                          {note.title}
                        </Text>
                        <Text style={[styles.noteContent, { color: colors.text }]}>
                          {note.content?.length > 100
                            ? `${note.content.substring(0, 100)}...`
                            : note.content}
                        </Text>
                      </ThemedCard>
                    </View>
                  ))}
                </View>

              </View>
            )
          ))}
        </>
      )}

      <Portal>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'plus'}
          actions={fabActions}
          onStateChange={({ open }) => setFabOpen(open)}
          fabStyle={{ backgroundColor: colors.primary, marginBottom: 60 }}
          visible={fabVisible}
        />
      </Portal>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 16,
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'left',
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  noteColumn: {
    width: '50%', // Slightly less than 50% to account for spacing
    marginBottom: 0,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'normal',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 0,
  },
});

export default NotesScreen;