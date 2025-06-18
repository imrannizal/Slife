import { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Text, TextInput, Button, Checkbox, useTheme } from 'react-native-paper';

const Todo = () => {

  // var
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  //func
  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: task, completed: false }]);
    setTask('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // page
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Todo List
      </Text>

      <TextInput
        label="New Task"
        value={task}
        onChangeText={setTask}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={addTodo} style={styles.button}>
        Add Task
      </Button>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleComplete(item.id)}
            />
            <Text style={[styles.todoText, item.completed && styles.completed]}>
              {item.text}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
      />
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  todoText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 16,
  },
});