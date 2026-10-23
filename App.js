import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { ShopProvider } from './src/context/ShopContext';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import AdminManageProductsScreen from './src/screens/AdminManageProductsScreen';
import AdminCustomersScreen from './src/screens/AdminCustomersScreen';
import MainDrawer from './src/navigation/MainDrawer';
import { COLORS } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  // Automatically apply Poppins as default font for all Text and TextInput components
  if (fontsLoaded) {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.style = [{ fontFamily: 'Poppins_400Regular' }, Text.defaultProps.style];

    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.style = [{ fontFamily: 'Poppins_400Regular' }, TextInput.defaultProps.style];
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  return (
    <ShopProvider>
        <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="AdminProducts" component={AdminManageProductsScreen} />
          <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    </ShopProvider>
  );
}
