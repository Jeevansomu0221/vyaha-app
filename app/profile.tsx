import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

const { width } = Dimensions.get("window");

export default function Profile() {
  const { user, updateUser, addAddress, deleteAddress, logout } = useAuth();
  
  // Local state
  const [newName, setNewName] = useState(user?.name || "");
  const [newAddress, setNewAddress] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  // Mock data for demonstration
  const recentOrders = [
    { id: "#12345", restaurant: "Spice Kitchen", amount: "₹450", status: "Delivered", date: "Today" },
    { id: "#12344", restaurant: "Pizza Palace", amount: "₹650", status: "Delivered", date: "Yesterday" },
    { id: "#12343", restaurant: "Burger Hub", amount: "₹320", status: "Cancelled", date: "2 days ago" },
  ];

  if (!user) {
    return (
      <View style={styles.noUserContainer}>
        <Ionicons name="person-outline" size={64} color="#9ca3af" />
        <Text style={styles.noUserText}>No user logged in</Text>
      </View>
    );
  }

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ name: newName });
      setEditModalVisible(false);
      Alert.alert("Success", "Name updated successfully!");
    } else {
      Alert.alert("Error", "Please enter a valid name");
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      addAddress(addressType, newAddress);
      setNewAddress("");
      setAddressModalVisible(false);
      Alert.alert("Success", "Address added successfully!");
    } else {
      Alert.alert("Error", "Please enter a valid address");
    }
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteAddress(addressId) 
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  const handleCustomerCare = () => {
    Alert.alert(
      "Customer Care",
      "Choose how you'd like to contact us:",
      [
        { text: "Call Now", onPress: () => Alert.alert("Calling", "1800-123-4567") },
        { text: "Chat Support", onPress: () => Alert.alert("Chat", "Redirecting to chat support...") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const ProfileMenuItem = ({ icon, title, subtitle, onPress, showArrow = true, iconColor = "#ff6b35" }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
    </TouchableOpacity>
  );

  const EditProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                style={styles.input}
                placeholder="Enter your name"
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
              <LinearGradient
                colors={['#ff6b35', '#ff8c42']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const AddressModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addressModalVisible}
      onRequestClose={() => setAddressModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address Type</Text>
              <View style={styles.addressTypeContainer}>
                {['Home', 'Office', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.addressTypeButton,
                      addressType === type && styles.addressTypeButtonSelected
                    ]}
                    onPress={() => setAddressType(type)}
                  >
                    <Text style={[
                      styles.addressTypeText,
                      addressType === type && styles.addressTypeTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                style={[styles.input, styles.addressInput]}
                placeholder="Enter complete address"
                multiline={true}
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleAddAddress}>
              <LinearGradient
                colors={['#ff6b35', '#ff8c42']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Add Address</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <View style={styles.addressLeft}>
        <View style={styles.addressTypeTag}>
          <Ionicons 
            name={item.type === 'Home' ? 'home' : item.type === 'Office' ? 'business' : 'location'} 
            size={16} 
            color="#ff6b35" 
          />
          <Text style={styles.addressTypeTagText}>{item.type}</Text>
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteAddress(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#ff6b35" />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={['#ff6b35', '#ff8c42']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.profileImageContainer}>
                <LinearGradient
                  colors={['#ffffff', '#fff8f0']}
                  style={styles.profileImage}
                >
                  <Ionicons name="person" size={32} color="#ff6b35" />
                </LinearGradient>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user?.name || "Food Lover"}
                </Text>
                <Text style={styles.profilePhone}>
                  {user?.phone || "+91 XXXXXXXXXX"}
                </Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Ionicons name="create-outline" size={16} color="#ff6b35" />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.addresses?.length || 0}</Text>
              <Text style={styles.statLabel}>Addresses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Saved Addresses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Addresses</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
                <Text style={styles.addNew}>+ Add New</Text>
              </TouchableOpacity>
            </View>
            
            {user?.addresses && user.addresses.length > 0 ? (
              <View style={styles.addressesContainer}>
                <FlatList
                  data={user.addresses}
                  keyExtractor={(item) => item.id}
                  renderItem={renderAddressItem}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <View style={styles.noAddressContainer}>
                <Ionicons name="location-outline" size={48} color="#9ca3af" />
                <Text style={styles.noAddressText}>No addresses saved yet</Text>
                <TouchableOpacity 
                  style={styles.addFirstAddress}
                  onPress={() => setAddressModalVisible(true)}
                >
                  <Text style={styles.addFirstAddressText}>Add Your First Address</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Recent Orders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ordersContainer}>
              {recentOrders.map((order, index) => (
                <View key={index} style={styles.orderItem}>
                  <View style={styles.orderLeft}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderRestaurant}>{order.restaurant}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>{order.amount}</Text>
                    <View style={[
                      styles.orderStatus,
                      order.status === 'Delivered' && styles.delivered,
                      order.status === 'Cancelled' && styles.cancelled
                    ]}>
                      <Text style={[
                        styles.orderStatusText,
                        order.status === 'Delivered' && styles.deliveredText,
                        order.status === 'Cancelled' && styles.cancelledText
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account & Settings</Text>
            
            <ProfileMenuItem
              icon="receipt-outline"
              title="Order History"
              subtitle="View all your past orders"
              onPress={() => Alert.alert("Order History", "Redirecting to order history...")}
            />
            
            <ProfileMenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => Alert.alert("Payment Methods", "Redirecting to payment methods...")}
            />
            
            <ProfileMenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Order updates and offers"
              onPress={() => Alert.alert("Notifications", "Redirecting to notification settings...")}
            />
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support & Help</Text>
            
            <ProfileMenuItem
              icon="headset-outline"
              title="Customer Care"
              subtitle="24/7 support available"
              onPress={handleCustomerCare}
              iconColor="#10b981"
            />
            
            <ProfileMenuItem
              icon="call-outline"
              title="Emergency Hotline"
              subtitle="1800-123-4567"
              onPress={() => Alert.alert("Emergency", "Calling emergency hotline...")}
              iconColor="#ef4444"
            />
            
            <ProfileMenuItem
              icon="help-circle-outline"
              title="Help & FAQ"
              subtitle="Get answers to common questions"
              onPress={() => Alert.alert("Help", "Redirecting to help section...")}
              iconColor="#6366f1"
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
        
        <EditProfileModal />
        <AddressModal />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  noUserText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addNew: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
  addressesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  addressLeft: {
    flex: 1,
    marginRight: 12,
  },
  addressTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  addressTypeTagText: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: '600',
    marginLeft: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
  },
  noAddressContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noAddressText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 16,
  },
  addFirstAddress: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addFirstAddressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ordersContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  orderRestaurant: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  delivered: {
    backgroundColor: '#d1fae5',
  },
  cancelled: {
    backgroundColor: '#fee2e2',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  deliveredText: {
    color: '#059669',
  },
  cancelledText: {
    color: '#dc2626',
  },
  menuItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalForm: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  addressTypeButtonSelected: {
    backgroundColor: '#ff6b35',
  },
  addressTypeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  addressTypeTextSelected: {
    color: 'white',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});