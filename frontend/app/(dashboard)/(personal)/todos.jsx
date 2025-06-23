import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, BackHandler } from 'react-native';
import { useTheme, FAB, Portal, Checkbox } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import ThemedCard from '../../../components/ThemedCard';

const TodosScreen = () => {
  const { colors } = useTheme();
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  
  // Mock data for UI demonstration
  const [todos, setTodos] = useState([
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, fruits',
      workspace: 'Home',
      deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      is_completed: false,
      is_personal: true,
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Finish project report',
      description: 'Complete the quarterly report for stakeholders',
      workspace: 'Work',
      deadline: new Date(Date.now() + 172800000).toISOString(), // 2 days
      is_completed: false,
      is_personal: false,
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Call mom',
      description: 'Discuss family gathering plans',
      workspace: 'Personal',
      deadline: null,
      is_completed: true,
      is_personal: true,
      updated_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      id: '4',
      title: 'Team meeting',
      description: 'Weekly sync with development team',
      workspace: 'Work',
      deadline: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      is_completed: false,
      is_personal: false,
      updated_at: new Date().toISOString()
    }
  ]);

  // Group todos by workspace
  const todosByWorkspace = todos.reduce((acc, todo) => {
    const workspace = todo.workspace || 'Uncategorized';
    if (!acc[workspace]) {
      acc[workspace] = [];
    }
    acc[workspace].push(todo);
    return acc;
  }, {});

  // Function to toggle todo completion status
  const toggleComplete = (todoId) => {
    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, is_completed: !todo.is_completed } : todo
    ));
  };

  // Function to open todo details (placeholder for navigation)
  const openTodoDetails = (todo) => {
    router.push({
      pathname: "/editTodos/[id]",
      params: { 
        id: todo.id,
        todo: JSON.stringify(todo) // Must stringify objects for params
      }
    });
  };

  // Floating Action Button actions
  const fabActions = [
    {
      icon: 'plus',
      label: 'Add Todo',
      onPress: () => console.log('Add new todo'),
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
    {
      icon: 'delete',
      label: 'Auto-Delete',
      onPress: () => {
        setTodos(todos.filter(todo => !todo.is_completed));
      },
      color: colors.error,
      style: { backgroundColor: colors.surface }
    },
    {
      icon: 'calendar',
      label: 'Sort by Deadline',
      onPress: () => {
        setTodos([...todos].sort((a, b) => 
          (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31')
        ));
      },
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
  ];

  // Display FAB when screen is not focused
  useFocusEffect(() => {
    setFabVisible(true);
    return () => setFabVisible(false); // Hide when leaving screen
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {Object.entries(todosByWorkspace).map(([workspace, workspaceTodos]) => (
        <View key={workspace} style={styles.workspaceSection}>
          <Text style={[styles.workspaceTitle, { color: colors.primary }]}>
            {workspace}
          </Text>
          {workspaceTodos.map(todo => (
            <ThemedCard 
              key={todo.id}
              style={[styles.todoCard, todo.is_completed && styles.completedCard]}
              onPress={() => openTodoDetails(todo)}
            >
              <View style={styles.todoHeader}>
                <Checkbox
                  status={todo.is_completed ? 'checked' : 'unchecked'}
                  onPress={() => toggleComplete(todo.id)}
                  color={colors.primary}
                />
                <Text style={[styles.todoTitle, todo.is_completed && styles.completedText]}>
                  {todo.title}
                </Text>
              </View>
              {todo.description && (
                <Text style={[styles.todoDescription, todo.is_completed && styles.completedText]}>
                  {todo.description}
                </Text>
              )}
              {todo.deadline && (
                <Text style={styles.todoDeadline}>
                  Due: {new Date(todo.deadline).toLocaleString()}
                </Text>
              )}
              <Text style={styles.todoDate}>
                Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </Text>
            </ThemedCard>
          ))}
        </View>
      ))}

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
  workspaceSection: {
    marginBottom: 20,
  },
  workspaceTitle: {
    fontSize: 24,
    fontWeight: 'normal',
    marginLeft: 16,
    marginBottom: 0,
  },
  todoCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  completedCard: {
    opacity: 0.7,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  todoDescription: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 40, // Align with title
  },
  todoDeadline: {
    fontSize: 12,
    color: '#D32F2F', // Red for urgency
    marginBottom: 4,
    marginLeft: 40,
  },
  todoDate: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
});

export default TodosScreen;