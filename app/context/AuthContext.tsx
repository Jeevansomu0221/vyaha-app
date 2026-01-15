import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Address type
export interface Address {
  id: string;
  type: string;
  address: string;
}

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  guest?: boolean;
  addresses?: Address[];
  token?: string; // Add token field
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => Promise<void>;
  completeOnboarding: (name: string, address: string) => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (type: string, address: string) => void;
  deleteAddress: (id: string) => void;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempPhone, setTempPhone] = useState<string | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  // Check for existing auth on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // Check if token is still valid (you might want to add expiration check)
        if (parsedUser.token || parsedUser.guest) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Token missing, clear storage
          await clearAuthStorage();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthStorage = async () => {
    await AsyncStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const saveUserToStorage = async (userData: User) => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  // Step 1: login with phone (send OTP)
  const login = async (phone: string) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setTempPhone(phone);
    console.log("Mock OTP for", phone, "is:", generatedOtp);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Step 2: verify OTP
 const verifyOtp = async (otp: string): Promise<boolean> => {
  if (otp === mockOtp && tempPhone) {
    const mockToken = `mock_jwt_token_${Date.now()}`;
    const newUser: User = { 
      id: Date.now().toString(), 
      phone: tempPhone, 
      addresses: [],
      token: mockToken
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('userData', JSON.stringify(newUser)); // make sure this is called
    return true;
  }
  return false;
};


  // Guest mode
  const guestLogin = () => {
    const guestUser: User = { 
      id: "guest", 
      phone: "guest", 
      guest: true, 
      addresses: [] 
    };
    
    setUser(guestUser);
    setIsAuthenticated(true);
    saveUserToStorage(guestUser);
  };

  // Logout
  const logout = async () => {
    await clearAuthStorage();
  };

  // Save onboarding info (name + first address)
  const completeOnboarding = (name: string, address: string) => {
    if (user) {
      const firstAddress: Address = {
        id: Date.now().toString(),
        type: "Home",
        address,
      };
      const updatedUser = { ...user, name, addresses: [firstAddress] };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  // Update user info (name, phone, email, etc.)
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  // Add a new address
  const addAddress = (type: string, address: string) => {
    if (user) {
      const newAddress: Address = {
        id: Date.now().toString(),
        type,
        address,
      };
      const updatedUser = {
        ...user,
        addresses: [...(user.addresses || []), newAddress],
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  // Delete an address
  const deleteAddress = (id: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: (user.addresses || []).filter((addr) => addr.id !== id),
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  // Get auth token for API calls
  const getAuthToken = (): string | null => {
    return user?.token || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        verifyOtp,
        guestLogin,
        logout,
        completeOnboarding,
        updateUser,
        addAddress,
        deleteAddress,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};