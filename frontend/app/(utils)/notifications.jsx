// screens/NotificationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const {colors } = useTheme();

  // Mock notification data (replace with AsyncStorage later)
  const mockNotifications = [
    {
      id: '1',
      title: 'New Message',
      subtitle: 'John sent you a message: "Hey there!"',
      isRead: false,
      image: 'https://i.pravatar.cc/150?img=1', // Placeholder image
    },
    {
      id: '2',
      title: 'Order Shipped',
      subtitle: 'Your order #12345 has been shipped.',
      isRead: false,
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '3',
      title: 'Reminder',
      subtitle: 'Meeting with the team at 3 PM today.',
      isRead: true,
      image: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  // Load notifications from AsyncStorage (or mock data)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('@notifications');
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        } else {
          setNotifications(mockNotifications);
          await AsyncStorage.setItem('@notifications', JSON.stringify(mockNotifications));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    await AsyncStorage.setItem('@notifications', JSON.stringify(updatedNotifications));
  };

  // Render each notification item
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, item.isRead && styles.readNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.notificationImage} />
      <View style={styles.notificationText}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <Appbar.Header style={styles.header}>
        {/* Far left back button */}
        <Appbar.Action 
          icon="arrow-left"
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        />

        {/* Spacer to push right buttons to the edge */}
        <View style={styles.spacer} />

        {/* Right-aligned action buttons */}
        <Appbar.Action 
          icon="delete-outline"
          //onPress={handleDelete}
          color={colors.error}
          accessibilityLabel="Delete"
          style={styles.actionButton}
        />
      </Appbar.Header>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#f5f5f5',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  readNotification: {
    opacity: 0.7,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  notificationSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginLeft: 8,
  },
  spacer: {
    flex: 1
  },
});

export default NotificationsScreen;