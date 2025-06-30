import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { Appbar, TextInput, Button, useTheme, Icon, Checkbox } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import useTodoStore from '../../../store/todoStore';
import useWorkspaceStore from '../../../store/workspaceStore';

const EditTodoScreen = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [todo, setTodo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [visible, setVisible] = useState(false);
  const [workspaces, setWorkspaces] = useState([]); // should be dynamic list
  const addTodo = useTodoStore(state => state.addTodo);
  const updateTodo = useTodoStore(state => state.updateTodo);
  const deleteTodo = useTodoStore(state => state.deleteTodo);

  // Initialize todo from navigation params
  useEffect(() => {
    if (params.todo) {
      const parsedTodo = JSON.parse(params.todo);
      setTodo({
        ...parsedTodo,
        deadline: parsedTodo.deadline ? new Date(parsedTodo.deadline) : new Date()
      });

      const workspaceList = useWorkspaceStore.getState().workspaces
      const workspaceNames = workspaceList.map(ws => ws.name);

      setWorkspaces([...workspaceNames, "Personal"]);

    } else {
      router.back();
    }
  }, []);

  const handleSave = () => {

    // to not include id into the firestore todos table
    const savedTodo = {
      deadline: new Date(todo.deadline),
      description: todo.description,
      is_completed: todo.is_completed,
      is_personal: todo.is_personal,
      owner: todo.owner,
      title: todo.title,
      updated_at: todo.updated_at,
      workspace: todo.workspace
    }

    if (params.isNew === "true") {
      addTodo(savedTodo);
    } else {
      updateTodo(todo.id, savedTodo);
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this todo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTodo(todo.id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
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
          title={params.isNew === "true" ? "Create Todo" : "Edit Todo"}
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
          icon="check"  // Standard Material "tick" icon
          onPress={handleSave}
          accessibilityLabel="Save"
          style={styles.actionButton}
        />
      </Appbar.Header>

      <TextInput
        label="Title"
        value={todo.title}
        onChangeText={(text) => setTodo({ ...todo, title: text })}
        style={{ marginBottom: 16, margin: 8 }}
        mode="outlined"
      />

      <TextInput
        label="Description"
        value={todo.description}
        onChangeText={(text) => setTodo({ ...todo, description: text })}
        multiline
        style={{ marginBottom: 16, minHeight: 200, margin: 8 }}
        mode="outlined"
      />

      {/* View that has date and time picker */}
      <View style={{ marginBottom: 16, margin: 8, flexDirection: 'row', gap: 8 }}>
        {/* Date Picker Button */}
        <Button
          mode="outlined"
          icon="calendar"
          onPress={() => setShowDatePicker(true)}
          style={{ marginBottom: 8 }}
        >
          {new Date(todo.deadline).toLocaleDateString()}
        </Button>

        {/* Time Picker Button */}
        <Button
          mode="outlined"
          icon="clock-outline"
          onPress={() => setShowTimePicker(true)}
          style={{ marginBottom: 8 }}
        >
          {new Date(todo.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Button>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(todo.deadline)}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                const currentDateTime = new Date(todo.deadline);
                date.setHours(currentDateTime.getHours());
                date.setMinutes(currentDateTime.getMinutes());
                setTodo({ ...todo, deadline: date.toISOString() });
              }
            }}
          />
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <DateTimePicker
            value={new Date(todo.deadline)}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowTimePicker(false);
              if (time) {
                const currentDateTime = new Date(todo.deadline);
                currentDateTime.setHours(time.getHours());
                currentDateTime.setMinutes(time.getMinutes());
                setTodo({ ...todo, deadline: currentDateTime.toISOString() });
              }
            }}
          />
        )}
      </View>

      {params.isNew === "false" && (
        <Pressable
          onPress={() => setTodo({ ...todo, is_completed: !todo.is_completed })}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 16,
            marginBottom: 16,
            opacity: pressed ? 0.6 : 1
          })}
        >
          <Checkbox
            status={todo.is_completed ? 'checked' : 'unchecked'}
            color={colors.primary}
            uncheckedColor={colors.onSurfaceVariant}
          />
          <Text style={{
            marginLeft: 8,
            color: todo.is_completed ? colors.primary : colors.onSurface,
            fontSize: 14
          }}>
            {todo.is_completed ? 'Completed' : 'Mark as complete'}
          </Text>
        </Pressable>
      )}

      { }
      <View style={{ margin: 8, marginBottom: 16 }}>
        {/* Pressable dropdown trigger */}
        <Pressable
          onPress={() => setVisible(!visible)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 4,
            backgroundColor: pressed ? colors.surfaceVariant : colors.surface,
            borderWidth: 1,
            borderColor: colors.outline,
          })}
        >
          <Text style={{ flex: 1 }}>{todo.workspace || "Personal"}</Text>
          <Icon
            source={visible ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.onSurface}
          />
        </Pressable>

        {/* Dropdown menu */}
        {visible && (
          <View style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.outline,
            marginTop: 4,
            borderRadius: 4,
          }}>
            {workspaces.map((workspace) => (
              <Pressable
                key={workspace}
                onPress={() => {
                  setTodo({ ...todo, workspace });
                  setVisible(false);
                }}
                style={({ pressed }) => ({
                  padding: 12,
                  backgroundColor: pressed ? colors.surfaceVariant : undefined,
                })}
              >
                <Text>{workspace}</Text>
              </Pressable>
            ))}
          </View>
        )}
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