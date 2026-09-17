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
  Linking,
} from 'react-native';
import { fetchHospitals } from '../services/api';

export default function HospitalsScreen() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics'];

  useEffect(() => {
    loadHospitals();
  }, [selectedSpecialty]);

  const loadHospitals = async () => {
    setLoading(true);
    const filterSpec = selectedSpecialty === 'All' ? '' : selectedSpecialty;
    const data = await fetchHospitals('', filterSpec);
    setHospitals(data);
    setLoading(false);
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    (h.city && h.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hospitals Directory 🏥</Text>
        <Text style={styles.headerSub}>Discover verified medical centers across India</Text>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search hospital name or city..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {specialties.map(spec => (
            <TouchableOpacity
              key={spec}
              style={[styles.pill, selectedSpecialty === spec && styles.pillActive]}
              onPress={() => setSelectedSpecialty(spec)}>
              <Text style={[styles.pillText, selectedSpecialty === spec && styles.pillTextActive]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading hospitals...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredHospitals.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalName}>{item.name}</Text>
                  <Text style={styles.locationText}>
                    📍 {item.city || 'India'}, {item.state || ''}
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {item.rating || '4.8'}</Text>
                </View>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.specBadge}>
                  <Text style={styles.specBadgeText}>{item.specialty || 'Multi-Specialty'}</Text>
                </View>
                {item.bed_capacity && (
                  <View style={styles.bedBadge}>
                    <Text style={styles.bedBadgeText}>🛏️ {item.bed_capacity} Beds</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => item.contact_phone && Linking.openURL(`tel:${item.contact_phone}`)}>
                  <Text style={styles.callBtnText}>📞 Call Hospital</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailsBtn}>
                  <Text style={styles.detailsBtnText}>View Packages</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 12,
  },
  pillsScroll: { flexDirection: 'row' },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  pillActive: { backgroundColor: '#2563EB' },
  pillText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  pillTextActive: { color: '#FFFFFF' },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hospitalName: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  locationText: { fontSize: 13, color: '#64748B', marginTop: 4 },
  ratingBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  badgeRow: { flexDirection: 'row', marginTop: 12, flexWrap: 'wrap', gap: 6 },
  specBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  specBadgeText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  bedBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  bedBadgeText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  callBtn: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  callBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  detailsBtn: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  detailsBtnText: { color: '#0F172A', fontWeight: '600', fontSize: 13 },
});
