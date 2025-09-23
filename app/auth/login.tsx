import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  
  const { login, guestLogin } = useAuth();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const foodFloat1 = useRef(new Animated.Value(0)).current;
  const foodFloat2 = useRef(new Animated.Value(0)).current;
  const foodFloat3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle logo rotation animation
    Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Floating food animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(foodFloat1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(foodFloat1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(foodFloat2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(foodFloat2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(foodFloat3, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(foodFloat3, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Phone number validation
  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phoneNumber.trim());
  };

  const handleLogin = async () => {
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setPhoneError("");
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      login(phone);
      router.push("/auth/otp");
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    // Mark user as guest
    guestLogin(); // Call the guest login function from your auth context
    
    // Navigate directly to the food tab
    router.replace("/(tabs)/food");
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float1Y = foodFloat1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const float2Y = foodFloat2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float3Y = foodFloat3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#ff6b35" />
      <LinearGradient
        colors={['#ff6b35', '#ff8c42', '#ffa726']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Animated Food Background */}
          <View style={styles.foodBackground}>
            {/* Indian Food Items */}
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.dosa,
                { transform: [{ translateY: float1Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🥞</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.curry,
                { transform: [{ translateY: float2Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍛</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.biryani,
                { transform: [{ translateY: float3Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍚</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.samosa,
                { transform: [{ translateY: float1Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🥟</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.naan,
                { transform: [{ translateY: float2Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🫓</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.pizza,
                { transform: [{ translateY: float3Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍕</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.burger,
                { transform: [{ translateY: float1Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍔</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.tea,
                { transform: [{ translateY: float2Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍵</Text>
            </Animated.View>
          </View>

          <View style={styles.content}>
            {/* Header Section */}
            <Animated.View
              style={[
                styles.headerSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ],
                },
              ]}
            >
              {/* App Logo */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ rotate: logoRotate }] }
                ]}
              >
                <LinearGradient
                  colors={['#ffffff', '#fff8f0']}
                  style={styles.logoGradient}
                >
                  <Ionicons name="restaurant" size={36} color="#ff6b35" />
                </LinearGradient>
              </Animated.View>

              {/* App Name */}
              <Text style={styles.appName}>Vyaha</Text>
              <Text style={styles.appTagline}>Get your local food and home made food within minutes !!</Text>
            </Animated.View>

            {/* Login Form Section */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.formCard}>
                <Text style={styles.welcomeText}>Welcome to Vyaha!</Text>
                <Text style={styles.subtitleText}>
                  Enter your phone number to order delicious food
                </Text>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons 
                      name="call" 
                      size={20} 
                      color="#ff6b35" 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter phone number"
                      placeholderTextColor="#9ca3af"
                      value={phone}
                      onChangeText={(text) => {
                        setPhone(text);
                        if (phoneError) setPhoneError("");
                      }}
                      keyboardType="phone-pad"
                      style={styles.textInput}
                      editable={!isLoading}
                    />
                  </View>
                  {phoneError ? (
                    <Text style={styles.errorText}>{phoneError}</Text>
                  ) : null}
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isLoading ? ['#9ca3af', '#6b7280'] : ['#ff6b35', '#ff8c42']}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Ionicons name="paper-plane" size={20} color="#ffffff" />
                    )}
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Guest Login Button */}
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={handleGuestContinue}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="fast-food-outline" size={20} color="#ff6b35" />
                  <Text style={styles.guestButtonText}>Browse Menu as Guest</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Features Section */}
            <Animated.View
              style={[
                styles.featuresSection,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.featureRow}>
                <View style={styles.feature}>
                  <Ionicons name="time-outline" size={20} color="#ffffff" />
                  <Text style={styles.featureText}>30min Delivery</Text>
                </View>
                <View style={styles.feature}>
                  <Ionicons name="star-outline" size={20} color="#ffffff" />
                  <Text style={styles.featureText}>5-Star Rated</Text>
                </View>
                <View style={styles.feature}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#ffffff" />
                  <Text style={styles.featureText}>Safe & Fresh</Text>
                </View>
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View
              style={[
                styles.footer,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  foodBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  foodItem: {
    position: 'absolute',
    opacity: 0.15,
  },
  foodEmoji: {
    fontSize: 32,
  },
  dosa: {
    top: height * 0.1,
    left: width * 0.1,
  },
  curry: {
    top: height * 0.2,
    right: width * 0.15,
  },
  biryani: {
    top: height * 0.35,
    left: width * 0.05,
  },
  samosa: {
    top: height * 0.5,
    right: width * 0.1,
  },
  naan: {
    top: height * 0.65,
    left: width * 0.2,
  },
  pizza: {
    top: height * 0.75,
    right: width * 0.25,
  },
  burger: {
    top: height * 0.15,
    left: width * 0.7,
  },
  tea: {
    top: height * 0.45,
    right: width * 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 15,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#ffe8d6',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    marginHorizontal: 14,
    fontSize: 13,
    fontWeight: '500',
  },
  guestButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ffe8d6',
    backgroundColor: '#fff8f0',
  },
  guestButtonText: {
    color: '#ff6b35',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresSection: {
    marginBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#ffffff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});