import React from 'react';
import { FlatList, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { useShop } from '../context/ShopContext';
import ScreenHeader from '../components/ScreenHeader';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../theme';

export default function FavoritesScreen({ navigation }) {
  const { favorites, products } = useShop();
  const items = (products || []).filter(p => favorites.includes(p.id));
  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <ScreenHeader title="Your favorites" subtitle="The good stuff you saved for later." />
    {items.length ? <FlatList data={items} keyExtractor={i => i.id} numColumns={2} columnWrapperStyle={{ gap: 12 }} contentContainerStyle={{ paddingBottom: 30 }}
      renderItem={({ item }) => <View style={{ flex: 1, maxWidth: '50%' }}><ProductCard item={item} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} /></View>} />
      : <View style={styles.empty}><Text style={{ fontSize: 52 }}>💚</Text><Text style={styles.emptyTitle}>Nothing saved yet</Text><Text style={styles.body}>Tap the heart on a product to add it here.</Text></View>}
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background }, container: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 75, paddingHorizontal: 18, gap: 10 },
  emptyTitle: { color: COLORS.text, fontSize: 19, fontWeight: '800', marginTop: 8 }, body: { color: COLORS.muted, fontSize: 13, lineHeight: 19 }
});