import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function RegisterDoctorScreen({ navigation }) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualification, setQualification] = useState('');
  const [hospital, setHospital] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!name || !specialty || !phone) {
      Alert.alert('Missing Fields', 'Please fill in doctor name, specialty, and contact number.');
      return;
    }
    Alert.alert(
      'Registration Submitted',
      `Thank you Dr. ${name}! Your registration application has been submitted for verification.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Doctor Registration 👨‍⚕️</Text>
        <Text style={styles.sub}>List your specialization on the MediTravel Pan-India Platform.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Dr. John Doe"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Specialty *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cardiac Surgery, Orthopedics"
            placeholderTextColor="#94A3B8"
            value={specialty}
            onChangeText={setSpecialty}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Qualifications</Text>
          <TextInput
            style={styles.input}
            placeholder="MBBS, MS, FRCS"
            placeholderTextColor="#94A3B8"
            value={qualification}
            onChangeText={setQualification}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hospital / Clinic Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Associated Hospital"
            placeholderTextColor="#94A3B8"
            value={hospital}
            onChangeText={setHospital}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. New Delhi, Mumbai"
            placeholderTextColor="#94A3B8"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            placeholderTextColor="#94A3B8"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Registration</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
