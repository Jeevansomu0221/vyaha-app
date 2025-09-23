import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
const { width, height } = Dimensions.get("window");

// Define types for our form data and errors
type FormData = {
  name: string;
  houseNo: string;
  colony: string;
  locality: string;
  nearbyPlace: string;
  city: string;
  pincode: string;
};

type FormErrors = {
  name?: string;
  houseNo?: string;
  colony?: string;
  locality?: string;
  city?: string;
  pincode?: string;
  [key: string]: string | undefined;
};

export default function OnboardingScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    houseNo: "",
    colony: "",
    locality: "",
    nearbyPlace: "",
    city: "",
    pincode: "",
  });
  const { completeOnboarding } = useAuth();

const handleSubmit = async () => {
  if (!validateInputs()) return;
  setLoading(true);

  const formattedAddress = `${formData.houseNo}, ${formData.colony}, ${formData.locality}, ${formData.nearbyPlace ? formData.nearbyPlace + "," : ""} ${formData.city} - ${formData.pincode}`;

  completeOnboarding(formData.name, formattedAddress);


  router.replace("/(tabs)/food");
  setLoading(false);
};

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
  }, []);

  const validateInputs = (): boolean => {
    let newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.houseNo.trim()) {
      newErrors.houseNo = "House/Flat number is required";
      isValid = false;
    }

    if (!formData.colony.trim()) {
      newErrors.colony = "Colony/Street is required";
      isValid = false;
    }

    if (!formData.locality.trim()) {
      newErrors.locality = "Locality/Area is required";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  

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
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
              {/* Profile Icon */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#ffffff', '#fff8f0']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="person-add" size={24} color="#ff6b35" />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us deliver delicious food to your doorstep
              </Text>
            </Animated.View>

            {/* Form Section */}
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
                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                    <Ionicons 
                      name="person-outline" 
                      size={16} 
                      color={errors.name ? "#ef4444" : "#ff6b35"} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Enter your full name"
                      placeholderTextColor="#9ca3af"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange('name', text)}
                      style={styles.textInput}
                      editable={!loading}
                    />
                  </View>
                  {errors.name ? (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  ) : null}
                </View>

                {/* House/Flat Number */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>House/Flat Number *</Text>
                  <View style={[styles.inputWrapper, errors.houseNo && styles.inputError]}>
                    <Ionicons 
                      name="home-outline" 
                      size={16} 
                      color={errors.houseNo ? "#ef4444" : "#ff6b35"} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="e.g., 123, A-45, Flat 202"
                      placeholderTextColor="#9ca3af"
                      value={formData.houseNo}
                      onChangeText={(text) => handleInputChange('houseNo', text)}
                      style={styles.textInput}
                      editable={!loading}
                    />
                  </View>
                  {errors.houseNo ? (
                    <Text style={styles.errorText}>{errors.houseNo}</Text>
                  ) : null}
                </View>

                {/* Colony/Street */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Colony/Street *</Text>
                  <View style={[styles.inputWrapper, errors.colony && styles.inputError]}>
                    <Ionicons 
                      name="trail-sign-outline" 
                      size={16} 
                      color={errors.colony ? "#ef4444" : "#ff6b35"} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="e.g., MG Road, Koramangala"
                      placeholderTextColor="#9ca3af"
                      value={formData.colony}
                      onChangeText={(text) => handleInputChange('colony', text)}
                      style={styles.textInput}
                      editable={!loading}
                    />
                  </View>
                  {errors.colony ? (
                    <Text style={styles.errorText}>{errors.colony}</Text>
                  ) : null}
                </View>

                {/* Locality/Area */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Locality/Area *</Text>
                  <View style={[styles.inputWrapper, errors.locality && styles.inputError]}>
                    <Ionicons 
                      name="location-outline" 
                      size={16} 
                      color={errors.locality ? "#ef4444" : "#ff6b35"} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="e.g., Indira Nagar, Whitefield"
                      placeholderTextColor="#9ca3af"
                      value={formData.locality}
                      onChangeText={(text) => handleInputChange('locality', text)}
                      style={styles.textInput}
                      editable={!loading}
                    />
                  </View>
                  {errors.locality ? (
                    <Text style={styles.errorText}>{errors.locality}</Text>
                  ) : null}
                </View>

                {/* Nearby Place (Optional) */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nearby Place (Optional)</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons 
                      name="navigate-outline" 
                      size={16} 
                      color="#ff6b35" 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="e.g., Near Metro Station, Behind Mall"
                      placeholderTextColor="#9ca3af"
                      value={formData.nearbyPlace}
                      onChangeText={(text) => handleInputChange('nearbyPlace', text)}
                      style={styles.textInput}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* City and Pincode Row */}
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>City *</Text>
                    <View style={[styles.inputWrapper, errors.city && styles.inputError]}>
                      <Ionicons 
                        name="business-outline" 
                        size={16} 
                        color={errors.city ? "#ef4444" : "#ff6b35"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="e.g., Bangalore"
                        placeholderTextColor="#9ca3af"
                        value={formData.city}
                        onChangeText={(text) => handleInputChange('city', text)}
                        style={styles.textInput}
                        editable={!loading}
                      />
                    </View>
                    {errors.city ? (
                      <Text style={styles.errorText}>{errors.city}</Text>
                    ) : null}
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Pincode *</Text>
                    <View style={[styles.inputWrapper, errors.pincode && styles.inputError]}>
                      <Ionicons 
                        name="pin-outline" 
                        size={16} 
                        color={errors.pincode ? "#ef4444" : "#ff6b35"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="e.g., 560001"
                        placeholderTextColor="#9ca3af"
                        value={formData.pincode}
                        onChangeText={(text) => handleInputChange('pincode', text)}
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.textInput}
                        editable={!loading}
                      />
                    </View>
                    {errors.pincode ? (
                      <Text style={styles.errorText}>{errors.pincode}</Text>
                    ) : null}
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#9ca3af', '#6b7280'] : ['#ff6b35', '#ff8c42']}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
                    )}
                    <Text style={styles.buttonText}>
                      {loading ? 'Saving...' : 'Save & Start Ordering'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  formContainer: {
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: '#ffe8d6',
    minHeight: 44,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    color: '#1f2937',
    paddingVertical: 8,
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 10,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginTop: 8,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});