import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { fetchEmergencyContacts } from '../services/api';

export default function EmergencyScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchEmergencyContacts().then(setData);
  }, []);

  const triggerSOS = (number) => {
    Alert.alert(
      '🚨 Confirm Emergency Call',
      `Calling Emergency Hotline: ${number}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => Linking.openURL(`tel:${number.replace(/\s+/g, '')}`) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Urgent Header */}
        <View style={styles.urgentBanner}>
          <Text style={styles.urgentIcon}>🚨</Text>
          <Text style={styles.urgentTitle}>Emergency Assistance</Text>
          <Text style={styles.urgentSub}>Immediate medical response & dispatch lines</Text>

          {/* Huge SOS Button */}
          <TouchableOpacity
            style={styles.sosButton}
            activeOpacity={0.8}
            onPress={() => triggerSOS('112')}>
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubText}>TAP TO CALL 112</Text>
          </TouchableOpacity>
        </View>

        {/* Hotlines Grid */}
        <Text style={styles.sectionTitle}>Emergency Helplines</Text>
        <View style={styles.helplineRow}>
          <TouchableOpacity style={styles.helplineCard} onPress={() => triggerSOS('102')}>
            <Text style={styles.helplineIcon}>🚑</Text>
            <Text style={styles.helplineName}>Ambulance</Text>
            <Text style={styles.helplineNum}>102 / 108</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helplineCard} onPress={() => triggerSOS('+91 1800 11 2026')}>
            <Text style={styles.helplineIcon}>🏥</Text>
            <Text style={styles.helplineName}>MediTravel Helpline</Text>
            <Text style={styles.helplineNum}>1800 11 2026</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Emergency Care Centers */}
        <Text style={styles.sectionTitle}>Nearby Urgent Care Centers</Text>
        {data && data.hospitals.map((hosp, idx) => (
          <View key={idx} style={styles.hospCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hospTitle}>{hosp.name}</Text>
              <Text style={styles.hospLoc}>{hosp.location}</Text>
              <Text style={styles.hospDist}>📍 {hosp.distance} away</Text>
            </View>
            <TouchableOpacity
              style={styles.callHospBtn}
              onPress={() => triggerSOS(hosp.phone)}>
              <Text style={styles.callHospBtnText}>Call Ward</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEF2F2' },
  scrollContent: { padding: 20 },
  urgentBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  urgentIcon: { fontSize: 40, marginBottom: 8 },
  urgentTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  urgentSub: { fontSize: 13, color: '#FCA5A5', marginTop: 2, marginBottom: 20, textAlign: 'center' },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sosText: { fontSize: 32, fontWeight: '900', color: '#DC2626' },
  sosSubText: { fontSize: 10, fontWeight: '700', color: '#991B1B', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#7F1D1D', marginBottom: 12, marginTop: 4 },
  helplineRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  helplineCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  helplineIcon: { fontSize: 28, marginBottom: 6 },
  helplineName: { fontSize: 13, fontWeight: '600', color: '#7F1D1D' },
  helplineNum: { fontSize: 16, fontWeight: '800', color: '#DC2626', marginTop: 4 },
  hospCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  hospTitle: { fontSize: 16, fontWeight: '700', color: '#7F1D1D' },
  hospLoc: { fontSize: 12, color: '#991B1B', marginTop: 2 },
  hospDist: { fontSize: 12, fontWeight: '600', color: '#DC2626', marginTop: 4 },
  callHospBtn: { backgroundColor: '#DC2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  callHospBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});
