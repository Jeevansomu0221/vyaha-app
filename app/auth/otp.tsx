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

export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const { verifyOtp } = useAuth();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
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

    // Pulse animation for OTP inputs
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
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

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
  if (!otp || otp.length !== 6) {
    Alert.alert("Invalid OTP", "Please enter a 6-digit OTP");
    return;
  }

  setIsLoading(true);

  try {
    // Wait for verification result
    const isValid = await verifyOtp(otp);

    if (isValid) {
      router.replace("/auth/onboarding");
    } else {
      Alert.alert("Invalid OTP", "Please try again.");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to verify OTP. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  const handleResendOtp = async () => {
    setCanResend(false);
    setTimer(30);
    setOtp("");
    
    // Restart timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Alert.alert("OTP Sent", "A new OTP has been sent to your phone");
  };

  const handleBack = () => {
    router.back();
  };

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
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.pizza,
                { transform: [{ translateY: float1Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍕</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.burger,
                { transform: [{ translateY: float2Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍔</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.curry,
                { transform: [{ translateY: float3Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍛</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.noodles,
                { transform: [{ translateY: float1Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍜</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.ice_cream,
                { transform: [{ translateY: float2Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>🍦</Text>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.foodItem, 
                styles.coffee,
                { transform: [{ translateY: float3Y }] }
              ]}
            >
              <Text style={styles.foodEmoji}>☕</Text>
            </Animated.View>
          </View>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

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
              {/* OTP Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#ffffff', '#fff8f0']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="mail-open" size={36} color="#ff6b35" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Verify Your Number</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit verification code to your phone number
              </Text>
            </Animated.View>

            {/* OTP Form Section */}
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
                <Text style={styles.otpLabel}>Enter OTP Code</Text>
                
                {/* OTP Input */}
                <Animated.View 
                  style={[
                    styles.otpInputContainer,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="000000"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.otpInput}
                    editable={!isLoading}
                    autoFocus={true}
                  />
                  <View style={styles.otpUnderline} />
                </Animated.View>

                {/* Timer and Resend */}
                <View style={styles.timerContainer}>
                  {!canResend ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {timer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    isLoading && styles.verifyButtonDisabled,
                    (!otp || otp.length !== 6) && styles.verifyButtonDisabled
                  ]}
                  onPress={handleVerify}
                  disabled={isLoading || !otp || otp.length !== 6}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isLoading || (!otp || otp.length !== 6)
                        ? ['#9ca3af', '#6b7280'] 
                        : ['#ff6b35', '#ff8c42']
                    }
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    )}
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Security Note */}
            <Animated.View
              style={[
                styles.securityNote,
                { opacity: fadeAnim }
              ]}
            >
              <Ionicons name="shield-checkmark" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.securityText}>
                Your information is secure and encrypted
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
    fontSize: 35,
  },
  pizza: {
    top: height * 0.15,
    left: width * 0.1,
  },
  burger: {
    top: height * 0.25,
    right: width * 0.15,
  },
  curry: {
    top: height * 0.45,
    left: width * 0.05,
  },
  noodles: {
    top: height * 0.65,
    right: width * 0.1,
  },
  ice_cream: {
    top: height * 0.75,
    left: width * 0.2,
  },
  coffee: {
    top: height * 0.35,
    right: width * 0.7,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    zIndex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    backdropFilter: 'blur(10px)',
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpInputContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    textAlign: 'center',
    letterSpacing: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: 200,
  },
  otpUnderline: {
    height: 3,
    width: 180,
    backgroundColor: '#ff6b35',
    borderRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  resendText: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  verifyButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
    fontWeight: '500',
  },
});