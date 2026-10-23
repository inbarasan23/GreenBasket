import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS } from '../data/products';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Duplicate array to achieve seamless infinite looping marquee
const MARQUEE_ROW_ONE = [...PRODUCTS, ...PRODUCTS];
const MARQUEE_ROW_TWO = [...PRODUCTS.slice().reverse(), ...PRODUCTS.slice().reverse()];

export default function HomeScreen({ navigation }) {
  const [role, setRole] = useState('Customer');

  // Animations
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const marqueeLeft = useRef(new Animated.Value(0)).current;
  const marqueeRight = useRef(new Animated.Value(0)).current;
  const roleSlideAnim = useRef(new Animated.Value(0)).current;
  const pulseButton = useRef(new Animated.Value(1)).current;

  // Approximate loop width for 8 items * 135px item width + gap
  const LOOP_DISTANCE = PRODUCTS.length * 145;

  useEffect(() => {
    // Entrance
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 1. Continuous Marquee: Right -> Left (Direction Left)
    const animLeft = Animated.loop(
      Animated.timing(marqueeLeft, {
        toValue: -LOOP_DISTANCE,
        duration: 18000,
        useNativeDriver: true,
      })
    );

    // 2. Continuous Marquee: Left -> Right (Direction Right)
    const animRight = Animated.loop(
      Animated.timing(marqueeRight, {
        toValue: LOOP_DISTANCE,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    // Button pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseButton, { toValue: 1.02, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulseButton, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    );

    animLeft.start();
    animRight.start();
    pulse.start();

    return () => {
      animLeft.stop();
      animRight.stop();
      pulse.stop();
    };
  }, [entranceAnim, marqueeLeft, marqueeRight, pulseButton, LOOP_DISTANCE]);

  const switchRole = (selectedRole) => {
    Animated.spring(roleSlideAnim, {
      toValue: selectedRole === 'Admin' ? 1 : 0,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();
    setRole(selectedRole);
  };

  const sliderX = roleSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, (SCREEN_WIDTH - 44) / 2 - 3],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Atmospheric Background */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85' }}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <View style={styles.topVignette} />
        <View style={styles.bottomVignette} />

        <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>

          {/* Top Brand Bar */}
          <Animated.View style={[styles.topBar, { opacity: entranceAnim }]}>
            <View style={styles.brandGroup}>
              <View style={styles.logoBadge}>
                <Ionicons name="leaf" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.brandTitle}>GREENBASKET</Text>
                <Text style={styles.brandSub}>ORGANIC SUPERMARKET</Text>
              </View>
            </View>

            <View style={styles.liveTag}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveTagText}>LIVE STORE</Text>
            </View>
          </Animated.View>

          {/* Editorial Headline */}
          <Animated.View style={[styles.headlineWrap, { opacity: entranceAnim }]}>
            <View style={styles.badgePill}>
              <Ionicons name="sparkles" size={11} color="#4ADE80" />
              <Text style={styles.badgePillText}>NOW STREAMING FRESH CATALOGUE</Text>
            </View>
            <Text style={styles.headline}>
              Farm-Fresh Picks,{'\n'}
              <Text style={styles.headlineAccent}>Delivered to You.</Text>
            </Text>
          </Animated.View>

          {/* DUAL DIRECTION MARQUEE SECTION */}
          <View style={styles.marqueeSection}>
            {/* Direction Indicator Row */}
            <View style={styles.marqueeLabelRow}>
              <View style={styles.marqueeDirectTag}>
                <Ionicons name="arrow-back" size={12} color="#86EFAC" />
                <Text style={styles.marqueeDirectText}>STREAMING LEFT</Text>
              </View>
              <View style={styles.marqueeDirectTag}>
                <Text style={styles.marqueeDirectText}>STREAMING RIGHT</Text>
                <Ionicons name="arrow-forward" size={12} color="#86EFAC" />
              </View>
            </View>

            {/* Row 1: Flowing Left (Right to Left) */}
            <View style={styles.marqueeTrackWrap}>
              <Animated.View
                style={[
                  styles.marqueeRow,
                  { transform: [{ translateX: marqueeLeft }] },
                ]}
              >
                {MARQUEE_ROW_ONE.map((product, idx) => (
                  <View key={`row1-${idx}`} style={styles.marqueeCard}>
                    <View style={styles.cardPhotoWrapper}>
                      <Image source={{ uri: product.image }} style={styles.cardPhoto} resizeMode="cover" />
                      <View style={styles.cardEmojiBadge}>
                        <Text style={{ fontSize: 13 }}>{product.emoji}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardPrice}>₹{product.price}</Text>
                      <Text style={styles.cardUnit}>{product.unit}</Text>
                    </View>
                  </View>
                ))}
              </Animated.View>
            </View>

            {/* Row 2: Flowing Right (Left to Right) */}
            <View style={[styles.marqueeTrackWrap, { marginTop: 10 }]}>
              <Animated.View
                style={[
                  styles.marqueeRow,
                  { transform: [{ translateX: marqueeRight }] },
                ]}
              >
                {MARQUEE_ROW_TWO.map((product, idx) => (
                  <View key={`row2-${idx}`} style={[styles.marqueeCard, styles.marqueeCardDark]}>
                    <View style={styles.cardPhotoWrapper}>
                      <Image source={{ uri: product.image }} style={styles.cardPhoto} resizeMode="cover" />
                      <View style={styles.cardEmojiBadge}>
                        <Text style={{ fontSize: 13 }}>{product.emoji}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardPrice}>₹{product.price}</Text>
                      <Text style={styles.cardUnit}>{product.category}</Text>
                    </View>
                  </View>
                ))}
              </Animated.View>
            </View>
          </View>

          {/* Bottom Interactive Glass Deck */}
          <Animated.View style={[styles.bottomDeck, { opacity: entranceAnim }]}>

            {/* Segmented Switcher */}
            <View style={styles.segmentedTrack}>
              <Animated.View
                style={[
                  styles.activeThumb,
                  role === 'Admin' && styles.activeThumbAdmin,
                  { transform: [{ translateX: sliderX }] },
                ]}
              />

              <TouchableOpacity
                style={styles.segmentedBtn}
                activeOpacity={0.9}
                onPress={() => switchRole('Customer')}
              >
                <Ionicons
                  name="basket-outline"
                  size={16}
                  color={role === 'Customer' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.segmentedBtnText, role === 'Customer' && styles.segmentedBtnTextActive]}>
                  Shopper
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.segmentedBtn}
                activeOpacity={0.9}
                onPress={() => switchRole('Admin')}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={role === 'Admin' ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.segmentedBtnText, role === 'Admin' && styles.segmentedBtnTextActive]}>
                  Store Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action Button */}
            <Animated.View style={{ transform: [{ scale: pulseButton }] }}>
              <TouchableOpacity
                style={[
                  styles.primaryCta,
                  role === 'Admin' ? styles.primaryCtaAdmin : styles.primaryCtaCustomer,
                ]}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('Auth', { mode: 'Sign In', role })}
              >
                <View style={styles.ctaTextCol}>
                  <Text style={styles.ctaTitle}>
                    {role === 'Admin' ? 'Enter Admin Control' : 'Enter GreenBasket'}
                  </Text>
                  <Text style={styles.ctaSub}>
                    {role === 'Admin' ? 'Manage products, edit & view CRM' : 'Browse full catalogue & order'}
                  </Text>
                </View>

                <View style={styles.ctaArrowCircle}>
                  <Ionicons name="arrow-forward" size={18} color="#07180D" />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerRow}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Auth', { mode: 'Sign Up', role })}
            >
              <Text style={styles.registerPrompt}>
                Don’t have an account? <Text style={styles.registerAction}>Create Account</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#07160D',
  },
  heroBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(6, 20, 12, 0.78)',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    backgroundColor: 'rgba(4, 15, 8, 0.95)',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#167747',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  brandSub: {
    color: '#86EFAC',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveTagText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Headline */
  headlineWrap: {
    marginTop: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: 'rgba(74, 222, 128, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.28)',
    marginBottom: 6,
  },
  badgePillText: {
    color: '#86EFAC',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 33,
    letterSpacing: -0.6,
  },
  headlineAccent: {
    color: '#4ADE80',
  },

  /* Marquee Section */
  marqueeSection: {
    marginVertical: 8,
  },
  marqueeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  marqueeDirectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marqueeDirectText: {
    color: '#86EFAC',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  marqueeTrackWrap: {
    overflow: 'hidden',
    width: '100%',
  },
  marqueeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  marqueeCard: {
    width: 135,
    backgroundColor: 'rgba(16, 42, 27, 0.9)',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  marqueeCardDark: {
    backgroundColor: 'rgba(9, 28, 17, 0.94)',
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  cardPhotoWrapper: {
    width: '100%',
    height: 75,
    borderRadius: 11,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 7,
  },
  cardPhoto: {
    width: '100%',
    height: '100%',
  },
  cardEmojiBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '900',
  },
  cardUnit: {
    color: '#A1BCAF',
    fontSize: 10,
    fontWeight: '600',
  },

  /* Bottom Deck */
  bottomDeck: {
    backgroundColor: 'rgba(8, 26, 15, 0.94)',
    borderRadius: 26,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    elevation: 8,
  },
  segmentedTrack: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeThumb: {
    position: 'absolute',
    width: (SCREEN_WIDTH - 44) / 2 - 3,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#167747',
    elevation: 4,
    shadowColor: '#167747',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  activeThumbAdmin: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
  },
  segmentedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: '100%',
  },
  segmentedBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  segmentedBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  primaryCta: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    elevation: 6,
  },
  primaryCtaCustomer: {
    backgroundColor: '#22C55E',
  },
  primaryCtaAdmin: {
    backgroundColor: '#F59E0B',
  },
  ctaTextCol: {
    flex: 1,
  },
  ctaTitle: {
    color: '#07160D',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  ctaSub: {
    color: 'rgba(7, 22, 13, 0.75)',
    fontSize: 11,
    fontWeight: '700',
  },
  ctaArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  registerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 2,
  },
  registerPrompt: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
  },
  registerAction: {
    color: '#6EE7B7',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});