import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { COLORS, FONTS } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AuthScreen({ route, navigation }) {
  const { signIn } = useShop();

  const params = route?.params ?? {};
  const [role, setRole] = useState(params.role || 'Customer');
  const [isSignup, setIsSignup] = useState(
    (params.mode || 'Sign In').toLowerCase() === 'sign up'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toggleSlide = useRef(new Animated.Value(isSignup ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const toggleAuthMode = (signupMode) => {
    setIsSignup(signupMode);
    Animated.spring(toggleSlide, {
      toValue: signupMode ? 1 : 0,
      friction: 6,
      tension: 65,
      useNativeDriver: true,
    }).start();
  };

  const sliderX = toggleSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [3, (SCREEN_WIDTH - 64) / 2 - 3],
  });

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10
      ? 2
      : 3;

  function submit() {
    if (loading) return;

    if (isSignup && !name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name to create an account.');
      return;
    }

    if (!email.trim() || !password) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }),
    ]).start(() => {
      try {
        signIn({
          name: name.trim() || email.trim().split('@')[0],
          email: email.trim(),
          role,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } catch (err) {
        Alert.alert('Unable to continue', 'Please try again.');
        setLoading(false);
      }
    });
  }

  function quickFillDemo() {
    if (role === 'Admin') {
      setName('Store Admin');
      setEmail('admin@greenbasket.com');
      setPassword('admin123');
    } else {
      setName('Sneha Sharma');
      setEmail('sneha@greenbasket.com');
      setPassword('customer123');
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Cinematic Organic Grocery Wallpaper Header */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=85' }}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />

        <SafeAreaView style={styles.safeHeader} edges={['top', 'left', 'right']}>
          {/* Top Bar with Back and Role Indicator */}
          <View style={styles.topNavRow}>
            <TouchableOpacity style={styles.glassBackBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[styles.roleBadge, role === 'Admin' && styles.roleBadgeAdmin]}>
              <Ionicons
                name={role === 'Admin' ? 'shield-checkmark' : 'person'}
                size={14}
                color={role === 'Admin' ? '#FBBF24' : '#86EFAC'}
              />
              <Text style={[styles.roleBadgeText, role === 'Admin' && styles.roleBadgeTextAdmin]}>
                {role.toUpperCase()} PORTAL
              </Text>
            </View>
          </View>

          {/* Hero Branding Info */}
          <View style={styles.heroHeadlineBlock}>
            <View style={styles.brandLeafWrap}>
              <Ionicons name="leaf" size={16} color="#4ADE80" />
              <Text style={styles.brandNameTag}>GREENBASKET</Text>
            </View>
            <Text style={styles.heroMainTitle}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.heroSubText}>
              {isSignup
                ? 'Join our fresh organic farm marketplace today'
                : 'Sign in to access your fresh groceries & basket'}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Main Glassmorphic Form Card */}
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.cardDeck,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* 1. Animated Segmented Sign In / Sign Up Mode Switcher */}
            <View style={styles.segmentTrack}>
              <Animated.View
                style={[
                  styles.segmentSlider,
                  role === 'Admin' && styles.segmentSliderAdmin,
                  { transform: [{ translateX: sliderX }] },
                ]}
              />

              <TouchableOpacity
                style={styles.segmentBtn}
                activeOpacity={0.88}
                onPress={() => toggleAuthMode(false)}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    !isSignup && styles.segmentBtnTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.segmentBtn}
                activeOpacity={0.88}
                onPress={() => toggleAuthMode(true)}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    isSignup && styles.segmentBtnTextActive,
                  ]}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Full Name Input (Registration Mode) */}
            {isSignup && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL NAME</Text>
                <View
                  style={[
                    styles.inputFieldWrap,
                    focusedInput === 'name' && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={19}
                    color={focusedInput === 'name' ? '#167747' : '#8A998E'}
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Sneha Sharma"
                    placeholderTextColor="#A1AEA5"
                    style={styles.textInput}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput('')}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>
            )}

            {/* 3. Email Address Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View
                style={[
                  styles.inputFieldWrap,
                  focusedInput === 'email' && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={focusedInput === 'email' ? '#167747' : '#8A998E'}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor="#A1AEA5"
                  style={styles.textInput}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput('')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* 4. Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View
                style={[
                  styles.inputFieldWrap,
                  focusedInput === 'password' && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={focusedInput === 'password' ? '#167747' : '#8A998E'}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#A1AEA5"
                  style={styles.textInput}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={submit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8A998E"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3].map((lvl) => (
                    <View
                      key={lvl}
                      style={[
                        styles.strengthBar,
                        strength >= lvl && {
                          backgroundColor:
                            strength === 1 ? '#F59E0B' : '#167747',
                        },
                      ]}
                    />
                  ))}
                  <Text style={styles.strengthText}>
                    {['', 'Weak', 'Good', 'Strong'][strength]}
                  </Text>
                </View>
              )}
            </View>

            {/* 5. Main Submit Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  role === 'Admin' ? styles.submitBtnAdmin : styles.submitBtnCustomer,
                  loading && { opacity: 0.7 },
                ]}
                activeOpacity={0.88}
                onPress={submit}
                disabled={loading}
              >
                <Text style={styles.submitBtnText}>
                  {loading
                    ? 'Authenticating...'
                    : isSignup
                    ? `Create ${role} Account`
                    : `Sign In as ${role}`}
                </Text>
                <View style={styles.submitArrowWrap}>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={role === 'Admin' ? '#92400E' : '#167747'}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* 6. Quick Demo Autofill Pill */}
            <View style={styles.quickFillWrap}>
              <TouchableOpacity style={styles.quickFillPill} onPress={quickFillDemo}>
                <Ionicons name="flash" size={14} color="#167747" />
                <Text style={styles.quickFillText}>
                  Quick Demo Fill ({role})
                </Text>
              </TouchableOpacity>
            </View>

            {/* 7. Bottom Mode Flip */}
            <TouchableOpacity
              style={styles.switchModeWrap}
              onPress={() => toggleAuthMode(!isSignup)}
            >
              <Text style={styles.switchModeText}>
                {isSignup
                  ? 'Already have an account? '
                  : 'New to GreenBasket? '}
                <Text style={styles.switchModeBold}>
                  {isSignup ? 'Sign In' : 'Create Account'}
                </Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: 250,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 17, 10, 0.78)',
  },
  safeHeader: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  glassBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  roleBadgeAdmin: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  roleBadgeText: {
    color: '#86EFAC',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  roleBadgeTextAdmin: {
    color: '#FCD34D',
  },
  heroHeadlineBlock: {
    paddingBottom: 4,
  },
  brandLeafWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  brandNameTag: {
    color: '#86EFAC',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  heroMainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  heroSubText: {
    color: '#B2D0BF',
    fontSize: 12,
    marginTop: 3,
  },

  /* Form Container & Card */
  formContainer: {
    flex: 1,
    backgroundColor: '#F7FAF6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  cardDeck: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E6EEE5',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  /* Segmented Toggle */
  segmentTrack: {
    height: 48,
    backgroundColor: '#EDF4EC',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    padding: 3,
    marginBottom: 20,
  },
  segmentSlider: {
    position: 'absolute',
    width: (SCREEN_WIDTH - 64) / 2 - 3,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#167747',
    elevation: 3,
    shadowColor: '#167747',
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  segmentSliderAdmin: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: '100%',
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#657B6D',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  /* Input Fields */
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#718579',
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  inputFieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FBF8',
    borderWidth: 1.5,
    borderColor: '#E2ECE0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputFocused: {
    borderColor: '#167747',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#16281E',
    fontWeight: '600',
    height: '100%',
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5EDE3',
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#76887D',
    marginLeft: 6,
  },

  /* Buttons */
  submitBtn: {
    height: 54,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 22,
    paddingRight: 10,
    marginTop: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnCustomer: {
    backgroundColor: '#167747',
  },
  submitBtnAdmin: {
    backgroundColor: '#D97706',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  submitArrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Quick Demo */
  quickFillWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  quickFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF6E8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C6E8C1',
  },
  quickFillText: {
    color: '#167747',
    fontSize: 12,
    fontWeight: '800',
  },

  /* Switch Mode */
  switchModeWrap: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 6,
  },
  switchModeText: {
    color: '#657B6D',
    fontSize: 13,
  },
  switchModeBold: {
    color: '#167747',
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});