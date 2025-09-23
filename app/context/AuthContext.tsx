import React, { createContext, ReactNode, useContext, useState } from "react";

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
}

interface AuthContextType {
  user: User | null;
  login: (phone: string) => void;
  verifyOtp: (otp: string) => boolean;
  guestLogin: () => void;
  logout: () => void;
  completeOnboarding: (name: string, address: string) => void;
  updateUser: (updates: Partial<User>) => void;
  addAddress: (type: string, address: string) => void;
  deleteAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tempPhone, setTempPhone] = useState<string | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  // Step 1: login with phone (send OTP)
  const login = (phone: string) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setTempPhone(phone);
    console.log("Mock OTP for", phone, "is:", generatedOtp);
  };

  // Step 2: verify OTP
  const verifyOtp = (otp: string) => {
    if (otp === mockOtp && tempPhone) {
      setUser({ id: Date.now().toString(), phone: tempPhone, addresses: [] });
      setTempPhone(null);
      setMockOtp(null);
      return true;
    }
    return false;
  };

  // Guest mode - CORRECTED VERSION
  const guestLogin = () => {
    setUser({ 
      id: "guest", 
      phone: "guest", 
      guest: true, 
      addresses: [] 
    });
  };

  // Logout
  const logout = () => setUser(null);

  // Save onboarding info (name + first address)
  const completeOnboarding = (name: string, address: string) => {
    if (user) {
      const firstAddress: Address = {
        id: Date.now().toString(),
        type: "Home",
        address,
      };
      setUser({ ...user, name, addresses: [firstAddress] });
    }
  };

  // Update user info (name, phone, email, etc.)
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
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
      setUser({
        ...user,
        addresses: [...(user.addresses || []), newAddress],
      });
    }
  };

  // Delete an address
  const deleteAddress = (id: string) => {
    if (user) {
      setUser({
        ...user,
        addresses: (user.addresses || []).filter((addr) => addr.id !== id),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        verifyOtp,
        guestLogin,
        logout,
        completeOnboarding,
        updateUser,
        addAddress,
        deleteAddress,
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