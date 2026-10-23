import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import OfferCarousel from '../components/OfferCarousel';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import HealthCelebration from '../components/HealthCelebration';
import { COLORS } from '../theme';

const CATEGORIES = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
];

export default function ShopScreen({ navigation }) {
  const { user, products } = useShop();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [celebrationProduct, setCelebrationProduct] = useState(null);

  const filtered = (products || []).filter(
    product =>
      (category === 'All' || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  // When Shop Now is pressed
  const handleShopNow = () => {
    setCategory('All');
    setSearch('');
  };

  const renderHeader = () => {
    return (
      <View>
        {/* =========================
            TOP HEADER
        ========================== */}

        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || 'Shopper'} 👋
            </Text>

            <Text style={styles.title}>
              Fresh groceries
            </Text>
          </View>

          <View style={styles.logo}>
            <Ionicons
              name="leaf"
              size={22}
              color={COLORS.green}
            />
          </View>
        </View>

        {/* =========================
            ADMIN BADGE
        ========================== */}

        {user?.role === 'Admin' && (
          <View style={styles.admin}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={COLORS.green}
              />
              <Text style={styles.adminText}>
                Admin Portal · {products.length} Products
              </Text>
            </View>
            <TouchableOpacity
              style={styles.adminActionBtn}
              onPress={() => navigation.navigate('AdminProducts')}
            >
              <Text style={styles.adminActionText}>Manage</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* =========================
            SEARCH
        ========================== */}

        <View style={styles.search}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.muted}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search fruits, vegetables..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* =========================
            ANIMATED OFFER CAROUSEL
        ========================== */}

        <OfferCarousel
          onShopNow={handleShopNow}
        />

        {/* =========================
            CATEGORY SECTION
        ========================== */}

        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>
            Shop by category
          </Text>

          <Ionicons
            name="grid-outline"
            size={18}
            color={COLORS.green}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                category === item &&
                  styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item &&
                    styles.chipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* =========================
            PRODUCT HEADING
        ========================== */}

        <View style={styles.heading}>
          <View>
            <Text style={styles.section}>
              {category === 'All'
                ? 'Daily essentials'
                : category}
            </Text>

            <Text style={styles.sectionSubtitle}>
              Fresh products selected for you
            </Text>
          </View>

          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>
              {filtered.length} items
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <FlatList
          data={filtered}
          keyExtractor={item =>
            String(item.id)
          }
          numColumns={2}

          columnWrapperStyle={
            filtered.length > 1
              ? styles.productRow
              : null
          }

          contentContainerStyle={
            styles.listContent
          }

          showsVerticalScrollIndicator={false}

          ListHeaderComponent={
            renderHeader
          }

          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductCard
                item={item}

                onPress={() =>
                  navigation.navigate(
                    'ProductDetails',
                    {
                      productId: item.id,
                    }
                  )
                }

                onAdded={product =>
                  setCelebrationProduct(
                    product
                  )
                }
              />
            </View>
          )}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="search-outline"
                  size={32}
                  color={COLORS.green}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No products found
              </Text>

              <Text style={styles.empty}>
                Try another search or category.
              </Text>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearch('');
                  setCategory('All');
                }}
              >
                <Text style={styles.resetText}>
                  Show all products
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* =========================
            HEALTH CELEBRATION
        ========================== */}

        <HealthCelebration
          visible={Boolean(
            celebrationProduct
          )}
          product={
            celebrationProduct
          }
          onClose={() =>
            setCelebrationProduct(null)
          }
        />
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
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 35,
  },

  /* =========================
     HEADER
  ========================== */

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  greeting: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '900',
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 15,

    backgroundColor: COLORS.pale,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /* =========================
     ADMIN
  ========================== */

  admin: {
    flexDirection: 'row',
    gap: 8,

    alignItems: 'center',

    backgroundColor: COLORS.pale,

    padding: 10,

    borderRadius: 12,

    marginBottom: 13,
  },

  adminText: {
    color: COLORS.greenDark,
    fontWeight: '700',
    fontSize: 12,
  },

  adminActionBtn: {
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  adminActionText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },

  /* =========================
     SEARCH
  ========================== */

  search: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    borderRadius: 15,

    paddingHorizontal: 13,

    marginBottom: 3,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,

    paddingVertical: 13,
    paddingHorizontal: 9,

    fontSize: 13,

    color: COLORS.text,
  },

  /* =========================
     CATEGORY
  ========================== */

  categoryHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 22,
    marginBottom: 12,
  },

  categoryTitle: {
    color: COLORS.text,

    fontSize: 17,

    fontWeight: '900',
  },

  categoryScroll: {
    flexGrow: 0,

    marginBottom: 22,
  },

  categoryContent: {
    paddingRight: 10,
  },

  chip: {
    borderRadius: 20,

    backgroundColor: COLORS.white,

    borderWidth: 1,

    borderColor: COLORS.border,

    paddingHorizontal: 16,

    paddingVertical: 9,

    marginRight: 8,
  },

  chipActive: {
    backgroundColor: COLORS.green,

    borderColor: COLORS.green,
  },

  chipText: {
    color: COLORS.muted,

    fontSize: 12,

    fontWeight: '700',
  },

  chipTextActive: {
    color: COLORS.white,
  },

  /* =========================
     PRODUCT HEADING
  ========================== */

  heading: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 14,
  },

  section: {
    color: COLORS.text,

    fontSize: 18,

    fontWeight: '900',
  },

  sectionSubtitle: {
    color: COLORS.muted,

    fontSize: 11,

    marginTop: 4,
  },

  itemBadge: {
    backgroundColor: COLORS.pale,

    paddingHorizontal: 11,

    paddingVertical: 7,

    borderRadius: 20,
  },

  itemBadgeText: {
    color: COLORS.green,

    fontSize: 11,

    fontWeight: '800',
  },

  /* =========================
     PRODUCTS
  ========================== */

  productRow: {
    gap: 12,
  },

  productWrapper: {
    flex: 1,

    maxWidth: '50%',

    marginBottom: 12,
  },

  /* =========================
     EMPTY
  ========================== */

  emptyContainer: {
    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: 50,
  },

  emptyIcon: {
    width: 65,
    height: 65,

    borderRadius: 22,

    backgroundColor: COLORS.pale,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 14,
  },

  emptyTitle: {
    color: COLORS.text,

    fontSize: 17,

    fontWeight: '900',

    marginBottom: 6,
  },

  empty: {
    color: COLORS.muted,

    textAlign: 'center',

    fontSize: 12,
  },

  resetButton: {
    marginTop: 17,

    backgroundColor: COLORS.green,

    paddingHorizontal: 18,

    paddingVertical: 11,

    borderRadius: 13,
  },

  resetText: {
    color: COLORS.white,

    fontSize: 12,

    fontWeight: '800',
  },

});