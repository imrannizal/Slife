import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Appbar, TextInput, Button, Switch, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTodoScreen = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [todo, setTodo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize todo from navigation params
  useEffect(() => {
    if (params.todo) {
      const parsedTodo = JSON.parse(params.todo);
      setTodo({
        ...parsedTodo,
        deadline: parsedTodo.deadline ? new Date(parsedTodo.deadline) : new Date()
      });
    } else {
        router.back();
    }
  }, []);

  const handleSave = () => {
    // Here you would typically save to Firebase
    console.log('Saving todo:', todo);
    router.back();
  };

  const handleDelete = () => {
    // Here you would typically delete the todo from Firebase
    console.log('Deleting todo:', todo);
    router.back();
  };

  if (!todo) return <Text>Loading...</Text>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}>

      <Appbar.Header style={styles.header}>
        <Appbar.Action 
            icon="arrow-left"
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
        />

        <Appbar.Content
            title="Edit Todo"
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
            icon="check"  // Standard Material "tick" icon
            onPress={handleSave}
            accessibilityLabel="Save"
            style={styles.actionButton}
        />
      </Appbar.Header>

      <TextInput
        label="Title"
        value={todo.title}
        onChangeText={(text) => setTodo({...todo, title: text})}
        style={{ marginBottom: 16, margin: 8 }}
        mode="outlined"
      />

      <TextInput
        label="Description"
        value={todo.description}
        onChangeText={(text) => setTodo({...todo, description: text})}
        multiline
        style={{ marginBottom: 16, minHeight: 200, margin: 8 }}
        mode="outlined"
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, margin: 8 }}>

        <Button 
            mode="outlined" 
            icon="calendar"
            onPress={() => setShowDatePicker(true)}
            style={{ marginBottom: 16 }}
        >
            {todo.deadline.toLocaleDateString()}
        </Button>

        {showDatePicker && (
            <DateTimePicker
            value={todo.deadline}
            mode="date"
            onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setTodo({...todo, deadline: date});
            }}
            />
        )}

        <Switch
          value={todo.is_personal}
          onValueChange={() => setTodo({...todo, is_personal: !todo.is_personal})}
        />
        <Text style={{ marginLeft: 8 }}>
          {todo.is_personal ? 'Personal' : 'Shared'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = {
  contentContainer: {
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginLeft: -8, // Pushes further left
    width: 48,
    justifyContent: 'center'
  },
  actionButton: {
    marginRight: -4, // Tightens right-side spacing
    width: 48,
    justifyContent: 'center'
  },
  spacer: {
    flex: 1 // Takes all available space
  },
};

export default EditTodoScreen;