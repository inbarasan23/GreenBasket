
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 36;

const OFFERS = [
  {
    id: '1',
    eyebrow: 'FRESH PICKS',
    title: 'Freshness Delivered!',
    subtitle: 'Farm-fresh fruits and vegetables every day.',
    discount: 'UP TO 30% OFF',
    emoji: '🥑 🍎',
    background: '#174B32',
    accent: '#C8F36B',
  },
  {
    id: '2',
    eyebrow: 'WEEKEND SPECIAL',
    title: 'Fill Your Basket!',
    subtitle: 'Save more on your everyday groceries.',
    discount: 'UP TO 40% OFF',
    emoji: '🥦 🥕',
    background: '#285B31',
    accent: '#FFE082',
  },
  {
    id: '3',
    eyebrow: 'HEALTHY CHOICES',
    title: 'Eat Fresh, Feel Good!',
    subtitle: 'Discover delicious and healthy essentials.',
    discount: 'UP TO 25% OFF',
    emoji: '🍊 🍇',
    background: '#326C48',
    accent: '#A7F3D0',
  },
];

export default function OfferCarousel({ onShopNow }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();

    return () => {
      floating.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [floatAnim]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex(current => {
        const next = (current + 1) % OFFERS.length;

        scrollRef.current?.scrollTo({
          x: next * BANNER_WIDTH,
          animated: true,
        });

        return next;
      });
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleScroll = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / BANNER_WIDTH);

    if (index >= 0 && index < OFFERS.length) {
      setActiveIndex(index);
    }
  };

  const offer = OFFERS[activeIndex];

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.sectionTitle}>Today's Fresh Deals ✨</Text>
          <Text style={styles.sectionSubtitle}>
            Good food. Great savings.
          </Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>OFFERS LIVE</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH}
        contentContainerStyle={styles.carouselContent}
      >
        {OFFERS.map(item => (
          <View
            key={item.id}
            style={[
              styles.banner,
              {
                width: BANNER_WIDTH,
                backgroundColor: item.background,
              },
            ]}
          >
            <View style={styles.decorCircleOne} />
            <View style={styles.decorCircleTwo} />

            <View style={styles.bannerContent}>
              <Text style={[styles.eyebrow, { color: item.accent }]}>
                {item.eyebrow}
              </Text>

              <Text style={styles.bannerTitle}>{item.title}</Text>

              <Text style={styles.bannerSubtitle}>
                {item.subtitle}
              </Text>

              <View
                style={[
                  styles.discountBadge,
                  { backgroundColor: item.accent },
                ]}
              >
                <Text style={styles.discountText}>
                  {item.discount}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.shopButton}
                onPress={() => onShopNow?.(item)}
              >
                <Text style={styles.shopButtonText}>Shop Now</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="#174B32"
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.emojiArt,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <Text style={styles.emojiText}>{item.emoji}</Text>
              <View style={styles.freshStamp}>
                <Ionicons name="leaf" size={15} color="#174B32" />
                <Text style={styles.freshStampText}>100% FRESH</Text>
              </View>
            </Animated.View>

            <View style={styles.bannerNumber}>
              <Text style={styles.bannerNumberText}>
                0{item.id} / 0{OFFERS.length}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {OFFERS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => {
              setActiveIndex(index);
              scrollRef.current?.scrollTo({
                x: index * BANNER_WIDTH,
                animated: true,
              });
            }}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 10,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#172117',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#778177',
    fontSize: 12,
    marginTop: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5E8',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2F7D32',
    marginRight: 5,
  },
  liveText: {
    color: '#2F7D32',
    fontSize: 9,
    fontWeight: '900',
  },
  carouselContent: {
    paddingHorizontal: 18,
  },
  banner: {
    minHeight: 245,
    borderRadius: 25,
    overflow: 'hidden',
    padding: 20,
    justifyContent: 'center',
  },
  decorCircleOne: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    right: -90,
    top: -90,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorCircleTwo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    right: -35,
    bottom: -105,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bannerContent: {
    width: '65%',
    zIndex: 2,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 9,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#E0EDE3',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 13,
  },
  discountText: {
    color: '#174B32',
    fontSize: 10,
    fontWeight: '900',
  },
  shopButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginTop: 13,
  },
  shopButtonText: {
    color: '#174B32',
    fontSize: 11,
    fontWeight: '900',
  },
  emojiArt: {
    position: 'absolute',
    right: 7,
    top: 62,
    width: '37%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 43,
    textAlign: 'center',
    lineHeight: 64,
  },
  freshStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 8,
  },
  freshStampText: {
    color: '#174B32',
    fontSize: 8,
    fontWeight: '900',
  },
  bannerNumber: {
    position: 'absolute',
    right: 15,
    bottom: 13,
  },
  bannerNumberText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 13,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#CAD5CB',
  },
  activeDot: {
    width: 22,
    backgroundColor: '#2F7D32',
  },
});
