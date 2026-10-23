
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const HEALTH_TIPS = {
  'Fresh Apples': 'Apples provide fiber and vitamin C. Enjoy one as part of a balanced diet! 🍎',
  Bananas: 'Bananas provide potassium and carbohydrates to help fuel your day! 🍌',
  'Fresh Broccoli': 'Broccoli contains fiber, vitamin C and vitamin K. A great addition to balanced meals! 🥦',
  Carrots: 'Carrots contain beta-carotene, which your body can convert into vitamin A! 🥕',
  'Whole Milk': 'Milk provides calcium and protein to support normal bone and muscle health! 🥛',
  'Brown Bread': 'Whole-grain bread can provide fiber for a balanced diet! 🍞',
  Eggs: 'Eggs provide high-quality protein and several important nutrients! 🥚',
  Avocado: 'Avocados provide unsaturated fats and fiber! 🥑',
};

export default function HealthCelebration({
  visible,
  product,
  onClose,
}) {
  const backdrop = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.65)).current;
  const characterY = useRef(new Animated.Value(100)).current;
  const characterScale = useRef(new Animated.Value(0.4)).current;
  const sparkle = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      backdrop.setValue(0);
      cardScale.setValue(0.65);
      characterY.setValue(100);
      characterScale.setValue(0.4);
      sparkle.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 75,
        useNativeDriver: true,
      }),
      Animated.spring(characterY, {
        toValue: 0,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(characterScale, {
        toValue: 1,
        friction: 4,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(sparkle, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!product) return null;

  const tip =
    HEALTH_TIPS[product.name] ||
    'Enjoy a variety of fresh foods as part of a balanced diet! 🌱';

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.94,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.backdrop, { opacity: backdrop }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: backdrop,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <View style={styles.topBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.topBadgeText}>ADDED TO YOUR CART</Text>
          </View>

          <View style={styles.sparkles}>
            <Animated.Text
              style={[
                styles.sparkleOne,
                {
                  opacity: sparkle,
                  transform: [
                    {
                      rotate: sparkle.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-40deg', '15deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              ✨
            </Animated.Text>

            <Animated.Text
              style={[
                styles.sparkleTwo,
                {
                  opacity: sparkle,
                  transform: [
                    {
                      scale: sparkle.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              ⭐
            </Animated.Text>

            <Animated.View
              style={[
                styles.characterCircle,
                {
                  transform: [
                    { translateY: characterY },
                    { scale: characterScale },
                  ],
                },
              ]}
            >
              <Text style={styles.character}>👩‍🌾</Text>
            </Animated.View>
          </View>

          <Text style={styles.hello}>YAY! GREAT CHOICE!</Text>
          <Text style={styles.heading}>Freshness added! 🌿</Text>

          <View style={styles.productPill}>
            <Text style={styles.productEmoji}>
              {product.emoji || '🛍️'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                ₹{Number(product.price).toFixed(2)} · {product.unit}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={25} color="#23844D" />
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>💚</Text>
              <Text style={styles.tipTitle}>A LITTLE HEALTH MAGIC</Text>
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>

          <Text style={styles.disclaimer}>
            One food cannot prevent every illness. Enjoy variety, balance,
            and healthy habits every day.
          </Text>

          <Animated.View
            style={{
              width: '100%',
              transform: [{ scale: buttonScale }],
            }}
          >
            <Pressable
              onPress={animateButton}
              style={({ pressed }) => [
                styles.continueButton,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={styles.continueText}>Continue shopping</Text>
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 30, 20, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    elevation: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    overflow: 'hidden',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: '#21864C',
  },
  topBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sparkles: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  characterCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#E3F7E8',
    borderWidth: 4,
    borderColor: '#BCEAC9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#22864D',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  character: {
    fontSize: 72,
  },
  sparkleOne: {
    position: 'absolute',
    left: 35,
    top: 20,
    fontSize: 30,
  },
  sparkleTwo: {
    position: 'absolute',
    right: 35,
    top: 30,
    fontSize: 25,
  },
  hello: {
    color: '#23844D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  heading: {
    color: '#183B2B',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 7,
    textAlign: 'center',
  },
  productPill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    backgroundColor: '#F5FAF5',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2EFE4',
    padding: 12,
    marginTop: 20,
  },
  productEmoji: {
    fontSize: 35,
  },
  productName: {
    color: '#183B2B',
    fontWeight: '800',
    fontSize: 14,
  },
  productPrice: {
    color: '#6B806F',
    fontSize: 12,
    marginTop: 4,
  },
  tipCard: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF7DF',
    borderRadius: 18,
    marginTop: 13,
    borderWidth: 1,
    borderColor: '#F5E6AE',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#81601B',
    letterSpacing: 1,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5F4B20',
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 10,
    color: '#77827A',
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 15,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#21864C',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#21864C',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
