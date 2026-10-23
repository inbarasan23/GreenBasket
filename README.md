# GreenBasket Grocery Shop — React Native / Expo

A complete, full-featured modern grocery shopping mobile application built with **React Native**, **Expo**, and **Google Fonts (Poppins)**.

---

## 🌟 Key Features

### 🛒 Shopper Experience
- **Cinematic Landing Page**: Real-time rotating announcement ticker, dual-direction streaming product marquee (flowing left & right), and 3D floating produce cards.
- **Catalogue & Shop Screen**: Filter by category (*Fruits, Vegetables, Dairy, Bakery*), live search, special discount banner carousel, and health celebration micro-animations.
- **Realistic 3D Product Visuals**: Working HD photography, subtle floating physics, 3D perspective tilt on touch, and gloss sheen reflections.
- **Product Details Page**: Full-screen 3D hero card, product specifications, pricing, and fast "Add to Cart" flow.
- **Cart & UPI QR Code Checkout**: Quantity adjustment (+ / -), automatic subtotal, free delivery threshold calculation, and scan-and-pay UPI QR code modal.
- **Favorites & Profile**: Save items with heart icons and edit customer profile credentials.

### 🛡️ Store Admin Management (New!)
- **Product Management (`AdminManageProductsScreen`)**:
  - Add new products with custom emojis, automatic HD photo matching, categories, price in ₹, packaging unit, and descriptions.
  - Edit or delete items directly from the live catalogue.
- **View Customers & CRM (`AdminCustomersScreen`)**:
  - Customer registry with status badges (`VIP`, `Active`, `New`).
  - Store analytics KPIs: **Total Orders**, **Total Revenue in ₹**, and **Average Basket Value**.
  - Interactive customer detail modal with simulated notification dispatch.
- **Role Isolation**: Admin accounts cannot access shopping carts, add-to-cart buttons, or customer favorites, keeping the admin experience dedicated to management.

---

## 🛠️ Technology Stack
- **Framework**: React Native + Expo (SDK 57)
- **Typography**: `@expo-google-fonts/poppins` (Poppins Regular, Medium, SemiBold, Bold, Black)
- **Navigation**:
  - `@react-navigation/native-stack`: Root stack navigation (Home, Auth, Main, Product Details, Admin Management).
  - `@react-navigation/bottom-tabs`: Role-based bottom navigation tabs.
  - `@react-navigation/drawer`: Sidebar drawer with quick links and sign-out.
- **State Management**: React Context (`ShopContext`) with dynamic products, customers, favorites, and cart state.
- **Icons & QR**: `@expo/vector-icons` (Ionicons) and `react-native-qrcode-svg`.

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/inbarasan23/GreenBasket.git
cd GreenBasket
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo development server
```bash
npm start
# or
npx expo start
```

### 4. Open the App
- **Android**: Press `a` in the terminal to open with an Android emulator or scan the QR code using **Expo Go** on your device.
- **iOS**: Scan the QR code with your Camera app to launch in **Expo Go**.
- **Web**: Press `w` in the terminal to open the web browser preview.

---

## 🔑 Demo Credentials

On the login screen, select your role and tap **"⚡ Quick Demo Fill"** to test immediately:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Store Admin** | `admin@greenbasket.com` | `admin123` |
| **Customer / Shopper** | `sneha@greenbasket.com` | `customer123` |

---

## 📂 Project Structure

```text
GreenBasket/
├── App.js                         # Root App, Poppins font loader & Stack Navigator
├── app.json                       # Expo configuration
├── package.json                   # Project dependencies
├── .gitignore                     # Git ignore rules (node_modules, .expo, etc.)
└── src/
    ├── components/
    │   ├── HealthCelebration.js   # Confetti and congratulatory celebration
    │   ├── OfferCarousel.js       # Promotional offer banner carousel
    │   ├── PrimaryButton.js       # Standardized primary button
    │   ├── ProductCard.js         # 3D interactive product card
    │   └── ScreenHeader.js        # Screen title header
    ├── context/
    │   └── ShopContext.js         # Global store state (products, cart, customers)
    ├── data/
    │   └── products.js            # Initial catalogue with verified HD photos
    ├── navigation/
    │   ├── MainDrawer.js          # Side drawer navigation
    │   ├── MainTabs.js            # Customer tabs
    │   └── ShopTabs.js            # Dynamic role-based tabs (Admin vs Customer)
    ├── screens/
    │   ├── AdminCustomersScreen.js       # Admin CRM & customer view
    │   ├── AdminManageProductsScreen.js  # Admin add/edit/delete product manager
    │   ├── AuthScreen.js                 # Sign In / Sign Up authentication
    │   ├── CartScreen.js                 # Basket & UPI QR checkout
    │   ├── FavoritesScreen.js            # Customer wishlist
    │   ├── HomeScreen.js                 # Cinematic landing page with dual marquee
    │   ├── ProductDetailsScreen.js       # 3D product showcase & details
    │   ├── ProfileScreen.js              # User profile
    │   └── ShopScreen.js                 # Grocery market catalogue
    └── theme.js                          # Theme colors and Poppins fonts
```
