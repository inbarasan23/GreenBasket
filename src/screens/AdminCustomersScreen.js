import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { COLORS } from '../theme';

export default function AdminCustomersScreen() {
  const { customers } = useShop();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c => {
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrdersAll = customers.reduce((sum, c) => sum + c.ordersCount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Registered Customers</Text>
          <Text style={styles.headerSubtitle}>
            {customers.length} total shoppers · CRM Demo
          </Text>
        </View>

        <View style={styles.statPill}>
          <Ionicons name="people" size={16} color={COLORS.green} />
          <Text style={styles.statPillText}>{customers.length} users</Text>
        </View>
      </View>

      {/* Overview Stat Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#EAF5E8' }]}>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={[styles.statValue, { color: COLORS.green }]}>{totalOrdersAll}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FFF4CF' }]}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={[styles.statValue, { color: '#B37A00' }]}>₹{totalSpentAll.toLocaleString('en-IN')}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#E5F1FC' }]}>
          <Text style={styles.statLabel}>Avg Basket</Text>
          <Text style={[styles.statValue, { color: '#1E6CB8' }]}>
            ₹{Math.round(totalSpentAll / (totalOrdersAll || 1))}
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or phone..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter Chips */}
      <View style={styles.statusChipsRow}>
        {['All', 'VIP', 'Active', 'New'].map(st => (
          <TouchableOpacity
            key={st}
            onPress={() => setSelectedStatus(st)}
            style={[
              styles.statusChip,
              selectedStatus === st && styles.statusChipActive,
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                selectedStatus === st && styles.statusChipTextActive,
              ]}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customers List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>👥</Text>
            <Text style={styles.emptyTitle}>No customers found</Text>
            <Text style={styles.emptySubtitle}>No records matched your search query.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.customerCard}
            onPress={() => setSelectedCustomer(item)}
            activeOpacity={0.8}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>

            <View style={styles.custInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.custName}>{item.name}</Text>
                <View
                  style={[
                    styles.tag,
                    item.status === 'VIP'
                      ? styles.tagVip
                      : item.status === 'Active'
                      ? styles.tagActive
                      : styles.tagNew,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      item.status === 'VIP'
                        ? styles.tagVipText
                        : item.status === 'Active'
                        ? styles.tagActiveText
                        : styles.tagNewText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.custEmail}>{item.email}</Text>
              <Text style={styles.custPhone}>{item.phone}</Text>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Ionicons name="bag-check-outline" size={13} color={COLORS.green} />
                  <Text style={styles.metricText}>{item.ordersCount} orders</Text>
                </View>
                <Text style={styles.metricDot}>•</Text>
                <View style={styles.metricItem}>
                  <Ionicons name="cash-outline" size={13} color={COLORS.green} />
                  <Text style={styles.metricText}>₹{item.totalSpent} spent</Text>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      />

      {/* Customer Detail Modal */}
      <Modal
        visible={!!selectedCustomer}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCustomer(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.detailCard}>
            {selectedCustomer ? (
              <View>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>
                      {selectedCustomer.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.modalName}>{selectedCustomer.name}</Text>
                    <Text style={styles.modalStatus}>{selectedCustomer.status} Customer</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedCustomer(null)}>
                    <Ionicons name="close-circle" size={26} color={COLORS.muted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={18} color={COLORS.green} />
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Email Address</Text>
                    <Text style={styles.detailVal}>{selectedCustomer.email}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={18} color={COLORS.green} />
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Phone Number</Text>
                    <Text style={styles.detailVal}>{selectedCustomer.phone}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.green} />
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Member Since</Text>
                    <Text style={styles.detailVal}>{selectedCustomer.joinedDate}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="receipt-outline" size={18} color={COLORS.green} />
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Order History & Value</Text>
                    <Text style={styles.detailVal}>
                      {selectedCustomer.ordersCount} Completed Orders (₹{selectedCustomer.totalSpent})
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => {
                    Alert.alert(
                      'Customer Contacted',
                      `Simulated message notification sent to ${selectedCustomer.name}.`
                    );
                    setSelectedCustomer(null);
                  }}
                >
                  <Ionicons name="paper-plane-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                  <Text style={styles.contactBtnText}>Send Promotion / Update</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pale,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statPillText: { fontSize: 12, fontWeight: '800', color: COLORS.green },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    marginVertical: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: { fontSize: 11, fontWeight: '700', color: COLORS.muted, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '900' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text, padding: 0 },
  statusChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginBottom: 10,
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  statusChipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  statusChipTextActive: { color: COLORS.white },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: COLORS.green },
  custInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  custName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagVip: { backgroundColor: '#FFF4CF' },
  tagVipText: { color: '#B37A00', fontSize: 10, fontWeight: '900' },
  tagActive: { backgroundColor: COLORS.pale },
  tagActiveText: { color: COLORS.green, fontSize: 10, fontWeight: '900' },
  tagNew: { backgroundColor: '#E5F1FC' },
  tagNewText: { color: '#1E6CB8', fontSize: 10, fontWeight: '900' },
  custEmail: { fontSize: 12, color: COLORS.muted, marginBottom: 2 },
  custPhone: { fontSize: 11, color: COLORS.muted, marginBottom: 6 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { fontSize: 11, fontWeight: '700', color: COLORS.text },
  metricDot: { fontSize: 11, color: COLORS.muted },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: COLORS.muted },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center' },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarText: { fontSize: 22, fontWeight: '900', color: COLORS.green },
  modalName: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  modalStatus: { fontSize: 12, color: COLORS.green, fontWeight: '700', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  detailCol: { flex: 1 },
  detailLabel: { fontSize: 11, color: COLORS.muted, marginBottom: 2 },
  detailVal: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  contactBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  contactBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
});
