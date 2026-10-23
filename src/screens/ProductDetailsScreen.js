import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../theme';

export default function ProductDetailsScreen({ route, navigation }) {
  const { user, addToCart, favorites, toggleFavorite, products } = useShop();
  const [imgError, setImgError] = useState(false);
  const isAdmin = user?.role === 'Admin';
  const product = (products || []).find(p => p.id === route.params?.productId) || (products && products[0]) || {};
  const favorite = favorites.includes(product.id);

  // 3D dynamic floating & breathing values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(heroScale, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();

    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
    return () => floating.stop();
  }, [floatAnim, heroScale]);

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={COLORS.text} /></TouchableOpacity>
    <Animated.View style={[styles.imageContainer, { transform: [{ translateY: floatAnim }, { scale: heroScale }] }]}>
      <View style={[styles.image, { backgroundColor: product.color }]}>
        {product.image && !imgError ? (
          <Image
            source={{ uri: product.image }}
            style={styles.heroPhoto}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={styles.emoji}>{product.emoji}</Text>
        )}

        {/* 3D Sheen and Vignette */}
        <View style={styles.glossSheen} pointerEvents="none" />
        <View style={styles.vignette} pointerEvents="none" />

        {!isAdmin && <TouchableOpacity style={styles.heart} onPress={() => toggleFavorite(product.id)}><Ionicons name={favorite ? 'heart' : 'heart-outline'} size={25} color={favorite ? COLORS.red : COLORS.text} /></TouchableOpacity>}
      </View>
    </Animated.View>
    <Text style={styles.category}>{product.category ? product.category.toUpperCase() : 'GROCERY'}</Text><Text style={styles.name}>{product.name}</Text><Text style={styles.unit}>{product.unit}</Text>
    <View style={styles.priceRow}><Text style={styles.price}>₹{product.price}</Text><View style={styles.badge}><Ionicons name="leaf-outline" size={15} color={COLORS.green} /><Text style={styles.badgeText}>Fresh pick</Text></View></View>
    <Text style={styles.section}>Product details</Text><Text style={styles.description}>{product.description}</Text>
    <View style={styles.delivery}><Ionicons name="car-outline" size={21} color={COLORS.green} /><View><Text style={styles.detailValue}>Quick delivery</Text><Text style={styles.body}>Delivery options shown at checkout.</Text></View></View>
    {!isAdmin ? (
      <PrimaryButton title="Add to cart" icon="cart-outline" onPress={() => { addToCart(product.id); Alert.alert('Added to cart', `${product.name} was added to your cart.`); }} />
    ) : (
      <PrimaryButton title="Manage in Catalogue" icon="create-outline" onPress={() => navigation.navigate('AdminProducts')} />
    )}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background }, container: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 30 },
  back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: COLORS.white, marginBottom: 18 },
  imageContainer: {
    borderRadius: 28,
    marginBottom: 22,
    elevation: 10,
    shadowColor: '#0E2C1B',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  image: {
    height: 290,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  heroPhoto: { width: '100%', height: '100%', borderRadius: 28 },
  glossSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  vignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  emoji: { fontSize: 120 },
  heart: { position: 'absolute', top: 14, right: 14, width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  category: { color: COLORS.green, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  name: { color: COLORS.text, fontSize: 29, fontWeight: '900', marginTop: 4 }, unit: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 18 }, price: { color: COLORS.green, fontSize: 29, fontWeight: '900' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.pale, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 }, badgeText: { color: COLORS.green, fontSize: 11, fontWeight: '800' },
  section: { color: COLORS.text, fontSize: 18, fontWeight: '800' }, description: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginTop: 9, marginBottom: 18 },
  delivery: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.white, borderRadius: 15, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  detailValue: { color: COLORS.text, fontSize: 14, fontWeight: '700' }, body: { color: COLORS.muted, fontSize: 13, lineHeight: 19 }
});