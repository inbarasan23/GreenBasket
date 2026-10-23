
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { COLORS } from '../theme';

export default function ProductCard({ item, onPress, onAdded }) {
  const { user, favorites, toggleFavorite, cart, addToCart } = useShop();
  const isAdmin = user?.role === 'Admin';
  const isFavorite = favorites.includes(item.id);
  const count = cart[item.id] || 0;
  const [imgError, setImgError] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const addScale = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle organic 3D floating animation
    const randomDuration = 2200 + (parseInt(item.id, 10) || 1) * 200;
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: randomDuration,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: randomDuration,
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
    return () => floating.stop();
  }, [floatAnim, item.id]);

  function animateAdd() {
    Animated.sequence([
      Animated.spring(addScale, {
        toValue: 0.78,
        useNativeDriver: true,
      }),
      Animated.spring(addScale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    addToCart(item.id);

    if (onAdded) {
      onAdded(item);
    }
  }

  const rotateX = tiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  const photoScale = tiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: floatAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={onPress}
        onPressIn={() => {
          Animated.parallel([
            Animated.spring(scale, {
              toValue: 0.96,
              useNativeDriver: true,
            }),
            Animated.spring(tiltAnim, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start();
        }}
        onPressOut={() => {
          Animated.parallel([
            Animated.spring(scale, {
              toValue: 1,
              friction: 5,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.spring(tiltAnim, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true,
            }),
          ]).start();
        }}
      >
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              backgroundColor: item.color,
              transform: [{ rotateX }],
            },
          ]}
        >
          {item.image && !imgError ? (
            <Animated.Image
              source={{ uri: item.image }}
              style={[
                styles.photo,
                { transform: [{ scale: photoScale }] },
              ]}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Text style={styles.emoji}>{item.emoji}</Text>
          )}

          {/* 3D Glass Light Reflections */}
          <View style={styles.glossShine} pointerEvents="none" />
          <View style={styles.depthEdge} pointerEvents="none" />

          {!isAdmin && (
            <TouchableOpacity
              style={styles.heart}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? COLORS.red : COLORS.text}
              />
            </TouchableOpacity>
          )}

          {!isAdmin && count > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count} in cart</Text>
            </View>
          )}
        </Animated.View>

        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.unit}>{item.unit}</Text>

        <View style={styles.bottom}>
          <Text style={styles.price}>₹{item.price}</Text>

          {!isAdmin && (
            <Animated.View style={{ transform: [{ scale: addScale }] }}>
              <TouchableOpacity
                style={styles.add}
                activeOpacity={0.8}
                onPress={animateAdd}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8EDE5',
    width: '100%',
    elevation: 6,
    shadowColor: '#0E2C1B',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  imageWrapper: {
    height: 130,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  glossShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  depthEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  emoji: {
    fontSize: 54,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 31,
    height: 31,
    backgroundColor: COLORS.white,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  countText: {
    color: '#21864C',
    fontSize: 10,
    fontWeight: '900',
  },
  category: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
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
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  price: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  add: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1E7944',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
