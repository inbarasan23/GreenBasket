import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
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

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Beverages'];
const EMOJI_PALETTE = [
  { emoji: '🍎', color: '#FCE9E7', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80' },
  { emoji: '🍌', color: '#FFF4CF', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80' },
  { emoji: '🥦', color: '#E1F2DE', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80' },
  { emoji: '🥕', color: '#FFE8D7', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80' },
  { emoji: '🥛', color: '#E5F1FC', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80' },
  { emoji: '🍞', color: '#F5E9D9', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { emoji: '🥑', color: '#E5F2D8', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
  { emoji: '🍇', color: '#F3E5F5', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80' },
  { emoji: '🍓', color: '#FDE8E8', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80' },
  { emoji: '🧀', color: '#FFF9C4', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80' },
  { emoji: '🍉', color: '#FFEBEE', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80' },
  { emoji: '🍊', color: '#FFE0B2', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80' },
];

export default function AdminManageProductsScreen({ navigation }) {
  const { products, addProduct, updateProduct, deleteProduct, resetDefaultProducts } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('1 kg');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_PALETTE[0].emoji);
  const [selectedColor, setSelectedColor] = useState(EMOJI_PALETTE[0].color);

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Fruits');
    setPrice('');
    setUnit('1 kg');
    setDescription('');
    setSelectedEmoji(EMOJI_PALETTE[0].emoji);
    setSelectedColor(EMOJI_PALETTE[0].color);
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setUnit(product.unit || '1 kg');
    setDescription(product.description || '');
    setSelectedEmoji(product.emoji || '🥑');
    setSelectedColor(product.color || '#EAF5E8');
    setModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (!name.trim()) {
      Alert.alert('Required field', 'Please enter a product name.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }

    const matchedPreset = EMOJI_PALETTE.find(item => item.emoji === selectedEmoji);
    const photoUrl = matchedPreset ? matchedPreset.image : editingProduct?.image;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        category,
        price: numPrice,
        unit: unit.trim() || '1 kg',
        description: description.trim() || `${name.trim()} - fresh farm produce.`,
        emoji: selectedEmoji,
        color: selectedColor,
        image: photoUrl,
      });
      Alert.alert('Success', `Updated "${name.trim()}" successfully!`);
    } else {
      addProduct({
        name: name.trim(),
        category,
        price: numPrice,
        unit: unit.trim() || '1 kg',
        description: description.trim() || `${name.trim()} - fresh organic quality.`,
        emoji: selectedEmoji,
        color: selectedColor,
        image: photoUrl,
      });
      Alert.alert('Success', `Added "${name.trim()}" to catalogue!`);
    }

    setModalVisible(false);
  };

  const confirmDelete = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${product.name}" from the store?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(product.id);
            Alert.alert('Deleted', `"${product.name}" has been removed.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Top Bar with Add Button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Product Management</Text>
          <Text style={styles.headerSubtitle}>
            {products.length} products live in catalogue
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products to edit or manage..."
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

      {/* Category Pills */}
      <View style={styles.categoryScrollWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {['All', ...CATEGORIES].map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>📦</Text>
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or add a new product.</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAddModal}>
              <Ionicons name="add" size={16} color={COLORS.white} />
              <Text style={styles.emptyAddBtnText}>Add Product Now</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={[styles.productThumb, { backgroundColor: item.color || COLORS.pale }]}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.adminThumbImg}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.productEmoji}>{item.emoji || '🥑'}</Text>
              )}
            </View>

            <View style={styles.productDetails}>
              <View style={styles.badgeRow}>
                <Text style={styles.catBadge}>{item.category.toUpperCase()}</Text>
                <Text style={styles.priceTag}>₹{item.price}</Text>
              </View>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productUnit}>{item.unit} · {item.description ? item.description.slice(0, 30) + '...' : 'Fresh produce'}</Text>
            </View>

            <View style={styles.actionsColumn}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEditModal(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color={COLORS.green} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmDelete(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Quick Footer Action to reset mock data */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.resetCatalogBtn}
          onPress={() => {
            Alert.alert(
              'Reset Catalogue',
              'Reset products to the default initial list?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', onPress: resetDefaultProducts },
              ]
            );
          }}
        >
          <Ionicons name="refresh-outline" size={14} color={COLORS.muted} />
          <Text style={styles.resetCatalogText}>Reset to Default Products</Text>
        </TouchableOpacity>
      </View>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <KeyboardAvoidingModalContent
            editingProduct={editingProduct}
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            unit={unit}
            setUnit={setUnit}
            description={description}
            setDescription={setDescription}
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onClose={() => setModalVisible(false)}
            onSave={handleSaveProduct}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function KeyboardAvoidingModalContent(props) {
  const {
    editingProduct,
    name, setName,
    category, setCategory,
    price, setPrice,
    unit, setUnit,
    description, setDescription,
    selectedEmoji, setSelectedEmoji,
    selectedColor, setSelectedColor,
    onClose, onSave
  } = props;

  return (
    <View style={styles.modalCard}>
      {/* Modal Header */}
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalTitle}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Text>
          <Text style={styles.modalSub}>
            {editingProduct ? 'Update item pricing & details' : 'List a fresh item in GreenBasket'}
          </Text>
        </View>
        <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
        {/* Emoji & Visual Icon Selection */}
        <Text style={styles.inputLabel}>Choose Product Icon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
          {EMOJI_PALETTE.map((item, idx) => {
            const isSelected = selectedEmoji === item.emoji;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSelectedEmoji(item.emoji);
                  setSelectedColor(item.color);
                }}
                style={[
                  styles.emojiCircle,
                  { backgroundColor: item.color },
                  isSelected && styles.emojiCircleActive,
                ]}
              >
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Name */}
        <Text style={styles.inputLabel}>Product Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Organic Strawberries"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.muted}
        />

        {/* Category Picker */}
        <Text style={styles.inputLabel}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.formCatPill,
                category === cat && styles.formCatPillActive,
              ]}
            >
              <Text
                style={[
                  styles.formCatPillText,
                  category === cat && styles.formCatPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price & Unit Row */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.inputLabel}>Price (₹) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 120"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor={COLORS.muted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Unit / Quantity</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 1 kg / 500 g / 1 dozen"
              value={unit}
              onChangeText={setUnit}
              placeholderTextColor={COLORS.muted}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.inputLabel}>Product Description</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Short description highlighting freshness and farm source..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor={COLORS.muted}
        />

        {/* Save & Cancel Buttons */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle-outline" size={19} color={COLORS.white} style={{ marginRight: 6 }} />
          <Text style={styles.saveBtnText}>
            {editingProduct ? 'Save Changes' : 'Add to Catalogue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    elevation: 3,
    shadowColor: COLORS.green,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: { color: COLORS.white, fontWeight: '800', fontSize: 13, marginLeft: 4 },
  searchContainer: {
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
  categoryScrollWrap: { marginBottom: 10 },
  categoryScroll: { paddingHorizontal: 18, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  categoryChipText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  categoryChipTextActive: { color: COLORS.white },
  listContainer: { paddingHorizontal: 18, paddingBottom: 20 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productThumb: {
    width: 62,
    height: 62,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  adminThumbImg: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  productEmoji: { fontSize: 32 },
  productDetails: { flex: 1, justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  catBadge: { fontSize: 9, fontWeight: '900', color: COLORS.green, letterSpacing: 0.8 },
  priceTag: { fontSize: 15, fontWeight: '900', color: COLORS.text, marginRight: 8 },
  productName: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  productUnit: { fontSize: 11, color: COLORS.muted },
  actionsColumn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FDE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 12, color: COLORS.muted, marginBottom: 14, textAlign: 'center' },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  emptyAddBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700', marginLeft: 4 },
  footerRow: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  resetCatalogBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
  resetCatalogText: { fontSize: 11, color: COLORS.muted, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 19, fontWeight: '900', color: COLORS.text },
  modalSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: { paddingBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '800', color: COLORS.text, marginBottom: 6, marginTop: 10 },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FCFDFC',
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  emojiRow: { flexDirection: 'row', marginBottom: 10 },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiCircleActive: { borderColor: COLORS.green, transform: [{ scale: 1.08 }] },
  formCatPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formCatPillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  formCatPillText: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  formCatPillTextActive: { color: COLORS.white },
  row: { flexDirection: 'row', alignItems: 'center' },
  saveBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    elevation: 3,
  },
  saveBtnText: { color: COLORS.white, fontWeight: '900', fontSize: 15 },
  cancelBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  cancelBtnText: { color: COLORS.muted, fontWeight: '700', fontSize: 13 },
});
