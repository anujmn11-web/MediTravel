import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function MedicalHistoryScreen() {
  const records = [
    { id: 1, title: 'Cardiology Health Checkup', doctor: 'Dr. Naresh Trehan', hospital: 'Medanta', date: '12 Sep 2026', status: 'Completed', type: 'Lab Report' },
    { id: 2, title: 'Joint Replacement Consultation', doctor: 'Dr. Ashok Rajgopal', hospital: 'Fortis', date: '04 Aug 2026', status: 'Completed', type: 'Prescription' },
    { id: 3, title: 'Annual ECG & Blood Profile', doctor: 'Dr. Devi Shetty', hospital: 'Narayana Health', date: '15 May 2026', status: 'Archived', type: 'Diagnostics' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.userName}>Patient Portal</Text>
            <Text style={styles.userSub}>Medical ID: MT-8829104</Text>
            <Text style={styles.bloodType}>Blood Group: O+ Positive</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>+ Upload New Document / Record</Text>
        </TouchableOpacity>

        {/* Records List */}
        <Text style={styles.sectionTitle}>Medical History & Reports</Text>
        {records.map(rec => (
          <View key={rec.id} style={styles.recordCard}>
            <View style={styles.recHeader}>
              <Text style={styles.recTitle}>{rec.title}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rec.type}</Text>
              </View>
            </View>
            <Text style={styles.recDoc}>👨‍⚕️ {rec.doctor} • {rec.hospital}</Text>
            <View style={styles.recFooter}>
              <Text style={styles.recDate}>📅 {rec.date}</Text>
              <TouchableOpacity>
                <Text style={styles.viewLink}>View File 📄</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 16 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 26 },
  userName: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  userSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  bloodType: { fontSize: 12, fontWeight: '600', color: '#2563EB', marginTop: 2 },
  uploadBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  recDoc: { fontSize: 13, color: '#64748B', marginTop: 6 },
  recFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  recDate: { fontSize: 12, color: '#94A3B8' },
  viewLink: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
});
