import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const quickActions = [
    { id: 'hospitals', title: 'Hospitals', icon: '🏥', bg: '#EFF6FF', color: '#2563EB', screen: 'Hospitals' },
    { id: 'doctors', title: 'Doctors', icon: '👨‍⚕️', bg: '#F0FDF4', color: '#16A34A', screen: 'Doctors' },
    { id: 'emergency', title: 'Emergency', icon: '🚨', bg: '#FEF2F2', color: '#DC2626', screen: 'Emergency' },
    { id: 'records', title: 'Records', icon: '📋', bg: '#FAF5FF', color: '#9333EA', screen: 'History' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.appName}>MediTravel 🏥</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBadge}
            onPress={() => navigation.navigate('History')}>
            <Text style={styles.profileInitials}>MT</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Callout Card */}
        <TouchableOpacity 
          style={styles.emergencyCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Emergency')}>
          <View style={styles.emergencyRow}>
            <View style={styles.emergencyBadge}>
              <Text style={styles.emergencyIcon}>🚨</Text>
            </View>
            <View style={styles.emergencyTextCol}>
              <Text style={styles.emergencyTitle}>24/7 Emergency Care</Text>
              <Text style={styles.emergencySub}>One-tap SOS & urgent hospital guidance</Text>
            </View>
          </View>
          <View style={styles.emergencyBtn}>
            <Text style={styles.emergencyBtnText}>Get Assistance</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Action Grid */}
        <Text style={styles.sectionTitle}>Quick Services</Text>
        <View style={styles.gridContainer}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[styles.gridTile, { backgroundColor: action.bg }]}
              onPress={() => navigation.navigate(action.screen)}>
              <Text style={styles.tileIcon}>{action.icon}</Text>
              <Text style={[styles.tileTitle, { color: action.color }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feature Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>Pan-India Network</Text>
          <Text style={styles.bannerTitle}>Connect with World-Class Healthcare</Text>
          <Text style={styles.bannerDesc}>
            Access 500+ top verified hospitals, specialist surgeons, and transparent treatment packages.
          </Text>
          <TouchableOpacity 
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('Hospitals')}>
            <Text style={styles.bannerBtnText}>Explore Hospitals</Text>
          </TouchableOpacity>
        </View>

        {/* Doctor Registration CTA */}
        <View style={styles.doctorCta}>
          <View style={styles.doctorCtaContent}>
            <Text style={styles.doctorCtaTitle}>Are you a Specialist?</Text>
            <Text style={styles.doctorCtaSub}>Join MediTravel platform to reach medical tourists nationwide.</Text>
          </View>
          <TouchableOpacity 
            style={styles.doctorCtaBtn}
            onPress={() => navigation.navigate('RegisterDoctor')}>
            <Text style={styles.doctorCtaBtnText}>Register Doctor</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  emergencyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyIcon: {
    fontSize: 20,
  },
  emergencyTextCol: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  emergencySub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  emergencyBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  emergencyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridTile: {
    width: '48%',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  banner: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  bannerTag: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 8,
  },
  bannerDesc: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 14,
  },
  doctorCta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorCtaContent: {
    flex: 1,
    marginRight: 10,
  },
  doctorCtaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorCtaSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  doctorCtaBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  doctorCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
