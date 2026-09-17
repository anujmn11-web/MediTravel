import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchDoctors } from '../services/api';

export default function DoctorsScreen() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    const data = await fetchDoctors();
    setDoctors(data);
    setLoading(false);
  };

  const filteredDoctors = doctors.filter(doc =>
    (doc.full_name || doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (doc.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (docName) => {
    Alert.alert(
      'Appointment Request',
      `Would you like to book a consultation with ${docName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Booking', onPress: () => Alert.alert('Success', 'Consultation request sent successfully!') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Specialist Doctors 👨‍⚕️</Text>
        <Text style={styles.headerSub}>Connect with leading surgeons & medical experts</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by doctor name or specialty..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>Loading doctor profiles...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredDoctors.map(doc => (
            <View key={doc.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👨‍⚕️</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.docName}>{doc.full_name || doc.name}</Text>
                  <Text style={styles.specialtyText}>{doc.specialty}</Text>
                  <Text style={styles.qualText}>{doc.qualification || 'MBBS, MD'} • {doc.experience_years || 15}+ Yrs Exp</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.hospitalTag}>🏥 {doc.hospital_name || 'Top Multi-Specialty Hospital'}</Text>
                <Text style={styles.feeText}>₹{doc.fee || 1200} / Consult</Text>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => handleBook(doc.full_name || doc.name)}>
                <Text style={styles.bookBtnText}>Book Consultation</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2, marginBottom: 12 },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748B', fontSize: 14 },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24 },
  docName: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  specialtyText: { fontSize: 13, color: '#16A34A', fontWeight: '600', marginTop: 2 },
  qualText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  hospitalTag: { fontSize: 12, color: '#475569', flex: 1 },
  feeText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  bookBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  bookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
