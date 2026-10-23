import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser, signOut } = useShop();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const save = () => {
    if (!name.trim() || !email.trim()) return Alert.alert('Required', 'Name and email cannot be empty.');
    updateUser({ ...user, name: name.trim(), email: email.trim() });
    setEditing(false);
    Alert.alert('Profile updated', 'Your profile details have been updated.');
  };

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <ScreenHeader title="My profile" subtitle="Manage your GreenBasket account." />
    <View style={styles.hero}><View style={styles.avatar}><Ionicons name="person" size={38} color={COLORS.green} /></View><Text style={styles.profileName}>{user?.name || 'Shopper'}</Text><Text style={styles.profileEmail}>{user?.email || 'No email added'}</Text><View style={styles.role}><Text style={styles.roleText}>{user?.role || 'Customer'}</Text></View></View>
    <View style={styles.card}>
      {editing ? <>
        <Text style={styles.label}>Full name</Text><TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Full name" />
        <Text style={styles.label}>Email address</Text><TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" />
        <PrimaryButton title="Save changes" onPress={save} /><PrimaryButton title="Cancel" secondary onPress={() => setEditing(false)} />
      </> : <>
        <View style={styles.detail}><Ionicons name="person-outline" size={20} color={COLORS.green} /><View style={{ flex: 1 }}><Text style={styles.detailLabel}>Full name</Text><Text style={styles.detailValue}>{user?.name || 'Shopper'}</Text></View></View>
        <View style={styles.detail}><Ionicons name="mail-outline" size={20} color={COLORS.green} /><View style={{ flex: 1 }}><Text style={styles.detailLabel}>Email address</Text><Text style={styles.detailValue}>{user?.email || 'Not provided'}</Text></View></View>
        <PrimaryButton title="Edit profile" icon="create-outline" onPress={() => setEditing(true)} />
      </>}
    </View>
    <TouchableOpacity style={styles.signOut} onPress={() => { signOut(); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); }}><Ionicons name="log-out-outline" size={21} color={COLORS.red} /><Text style={styles.signOutText}>Sign out</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background }, container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 30 },
  hero: { alignItems: 'center', backgroundColor: COLORS.pale, borderRadius: 22, padding: 22, marginTop: 18, marginBottom: 14 },
  avatar: { width: 76, height: 76, borderRadius: 26, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileName: { color: COLORS.text, fontSize: 20, fontWeight: '900' }, profileEmail: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  role: { marginTop: 11, backgroundColor: COLORS.white, paddingVertical: 5, paddingHorizontal: 13, borderRadius: 20 }, roleText: { color: COLORS.green, fontSize: 11, fontWeight: '800' },
  card: { backgroundColor: COLORS.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 5 },
  detailLabel: { color: COLORS.muted, fontSize: 11, marginBottom: 4 }, detailValue: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  label: { color: COLORS.text, fontSize: 12, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14, color: COLORS.text, backgroundColor: '#FCFDFC' },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 18, marginTop: 8 }, signOutText: { color: COLORS.red, fontWeight: '800', fontSize: 14 }
});