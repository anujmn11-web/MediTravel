import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import HospitalsScreen from '../screens/HospitalsScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import RegisterDoctorScreen from '../screens/RegisterDoctorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🏠';
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Hospitals') icon = '🏥';
          else if (route.name === 'Doctors') icon = '👨‍⚕️';
          else if (route.name === 'Emergency') icon = '🚨';
          else if (route.name === 'History') icon = '📋';

          return <Text style={{ fontSize: focused ? 22 : 18 }}>{icon}</Text>;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hospitals" component={HospitalsScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen name="History" component={MedicalHistoryScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="RegisterDoctor" 
          component={RegisterDoctorScreen} 
          options={{ headerShown: true, title: 'Register Doctor' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
