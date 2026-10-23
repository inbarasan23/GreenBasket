import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

import { useShop } from '../context/ShopContext';
import ScreenHeader from '../components/ScreenHeader';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../theme';

const UPI_ID = 'inbadharma2004@okicici';
const PAYEE_NAME = 'GreenBasket';

export default function CartScreen() {
  const { cart, addToCart, removeFromCart, products } = useShop();
  const [paymentVisible, setPaymentVisible] = useState(false);

  const items = (products || []).filter(p => (cart[p.id] || 0) > 0);

  const subtotal = items.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0
  );

  const delivery = subtotal >= 299 || subtotal === 0 ? 0 : 30;
  const total = subtotal + delivery;

  const count = items.reduce(
    (sum, product) => sum + cart[product.id],
    0
  );

  const paymentLink =
    total > 0
      ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
        `&pn=${encodeURIComponent(PAYEE_NAME)}` +
        `&am=${total.toFixed(2)}` +
        `&cu=INR&tn=${encodeURIComponent('GreenBasket order')}`
      : null;

  function openCheckout() {
    if (!items.length || total <= 0) {
      Alert.alert('Empty cart', 'Please add products before checkout.');
      return;
    }

    setPaymentVisible(true);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScreenHeader
          title="My cart"
          subtitle={`${count} items in your basket`}
        />

        {items.length > 0 ? (
          <>
            <FlatList
              style={styles.list}
              data={items}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View
                    style={[
                      styles.emojiBox,
                      { backgroundColor: item.color },
                    ]}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.cartPhoto}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.unit}>{item.unit}</Text>
                    <Text style={styles.price}>
                      ₹{(item.price * cart[item.id]).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.quantity}>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.qtyButton}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={COLORS.green}
                      />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{cart[item.id]}</Text>

                    <TouchableOpacity
                      onPress={() => addToCart(item.id)}
                      style={styles.qtyButton}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={COLORS.green}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.body}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  ₹{subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.body}>Delivery</Text>
                <Text style={styles.totalValue}>
                  {delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total to pay</Text>
                <Text style={styles.totalPrice}>
                  ₹{total.toFixed(2)}
                </Text>
              </View>

              <PrimaryButton
                title="Proceed to checkout"
                onPress={openCheckout}
              />
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={{ fontSize: 52 }}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.body}>
              Add some fresh favorites to get started.
            </Text>
          </View>
        )}

        <Modal
          visible={paymentVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPaymentVisible(false)}
        >
          <View style={styles.overlay}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.paymentCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Scan & Pay</Text>

                  <TouchableOpacity
                    onPress={() => setPaymentVisible(false)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={28}
                      color={COLORS.muted}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.paymentSubtitle}>
                  GreenBasket grocery order
                </Text>

                <Text style={styles.paymentAmount}>
                  ₹{total.toFixed(2)}
                </Text>

                <View style={styles.qrBox}>
                  <QRCode
                    value={paymentLink}
                    size={220}
                    backgroundColor="#FFFFFF"
                    color="#000000"
                  />
                </View>

                <Text style={styles.upiText}>UPI ID: {UPI_ID}</Text>

                <Text style={styles.paymentNote}>
                  Scan with a supported UPI app. Verify the recipient and
                  exact amount before authorizing payment.
                </Text>

                <Text style={styles.demoNotice}>
                  This app does not verify payment automatically. Confirm
                  receipt before treating an order as paid.
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPaymentVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 11,
    borderRadius: 17,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 11,
  },
  emojiBox: {
    width: 66,
    height: 66,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cartPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  unit: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
  },
  price: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 5,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pale,
    borderRadius: 12,
    padding: 3,
    gap: 7,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: COLORS.text,
    fontWeight: '800',
    minWidth: 12,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  body: {
    color: COLORS.muted,
    fontSize: 13,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  totalPrice: {
    color: COLORS.green,
    fontSize: 22,
    fontWeight: '900',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 75,
    paddingHorizontal: 18,
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 18,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '900',
  },
  paymentSubtitle: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 13,
  },
  paymentAmount: {
    marginVertical: 18,
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.green,
  },
  qrBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  upiText: {
    marginTop: 14,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  paymentNote: {
    marginTop: 12,
    color: COLORS.text,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  demoNotice: {
    marginTop: 12,
    color: '#925B12',
    backgroundColor: '#FFF5DF',
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: COLORS.green,
    paddingVertical: 13,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 18,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});