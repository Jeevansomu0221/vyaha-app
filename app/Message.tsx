import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Type definitions
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'delivery' | 'support';
  timestamp: string;
  delivered: boolean;
  read: boolean;
}

interface Chat {
  id: string;
  type: 'delivery' | 'support';
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

interface ChatItemProps {
  chat: Chat;
  onPress: () => void;
}

interface MessageBubbleProps {
  message: Message;
}

const MessagingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'chat'>('list');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'delivery_1',
      type: 'delivery',
      name: 'Raj Kumar',
      avatar: '🚚',
      status: 'online',
      lastMessage: 'I\'m 5 minutes away from your location',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          text: 'Hello! I\'m your delivery partner for today',
          sender: 'delivery',
          timestamp: '10:30 AM',
          delivered: true,
          read: true
        },
        {
          id: 2,
          text: 'Your order is on the way!',
          sender: 'delivery',
          timestamp: '10:32 AM',
          delivered: true,
          read: true
        },
        {
          id: 3,
          text: 'Great! How long will it take?',
          sender: 'user',
          timestamp: '10:33 AM',
          delivered: true,
          read: true
        },
        {
          id: 4,
          text: 'I\'m 5 minutes away from your location',
          sender: 'delivery',
          timestamp: '10:35 AM',
          delivered: true,
          read: false
        }
      ]
    },
    {
      id: 'support_1',
      type: 'support',
      name: 'Support Team',
      avatar: '🎧',
      status: 'online',
      lastMessage: 'How can I help you today?',
      lastMessageTime: '1h ago',
      unreadCount: 0,
      messages: [
        {
          id: 1,
          text: 'Hi! I need help with my recent order',
          sender: 'user',
          timestamp: '9:15 AM',
          delivered: true,
          read: true
        },
        {
          id: 2,
          text: 'I\'d be happy to help! What seems to be the issue?',
          sender: 'support',
          timestamp: '9:16 AM',
          delivered: true,
          read: true
        },
        {
          id: 3,
          text: 'How can I help you today?',
          sender: 'support',
          timestamp: '9:30 AM',
          delivered: true,
          read: true
        }
      ]
    },
    {
      id: 'delivery_2',
      type: 'delivery',
      name: 'Amit Singh',
      avatar: '🛵',
      status: 'busy',
      lastMessage: 'Order delivered successfully!',
      lastMessageTime: '2h ago',
      unreadCount: 0,
      messages: [
        {
          id: 1,
          text: 'Your order has been picked up',
          sender: 'delivery',
          timestamp: '8:00 AM',
          delivered: true,
          read: true
        },
        {
          id: 2,
          text: 'Order delivered successfully!',
          sender: 'delivery',
          timestamp: '8:45 AM',
          delivered: true,
          read: true
        }
      ]
    }
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (selectedChat && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedChat?.messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = (): void => {
    if (!inputText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      delivered: true,
      read: false
    };

    // Update chat with new message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage.text,
              lastMessageTime: 'now'
            }
          : chat
      )
    );

    // Update selected chat
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: newMessage.text,
      lastMessageTime: 'now'
    } : null);

    setInputText('');
    
    // Simulate response after 2 seconds
    setTimeout(() => {
      simulateResponse();
    }, 2000);
  };

  const simulateResponse = (): void => {
    if (!selectedChat) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const responses = {
        delivery: [
          'Thank you for the update!',
          'I\'ll be there in a few minutes',
          'Please have your payment ready',
          'Call me if you need any help finding me'
        ],
        support: [
          'Thank you for contacting us!',
          'I\'ll look into that right away',
          'Is there anything else I can help you with?',
          'Let me transfer you to a specialist'
        ]
      };

      const responseTexts = responses[selectedChat.type];
      const randomResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)];

      const responseMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: selectedChat.type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        delivered: true,
        read: false
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat.id 
            ? { 
                ...chat, 
                messages: [...chat.messages, responseMessage],
                lastMessage: responseMessage.text,
                lastMessageTime: 'now'
              }
            : chat
        )
      );

      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, responseMessage],
        lastMessage: responseMessage.text,
        lastMessageTime: 'now'
      } : null);

      setIsTyping(false);
    }, 1500);
  };

  const openChat = (chat: Chat): void => {
    // Mark messages as read
    const updatedChat = {
      ...chat,
      unreadCount: 0,
      messages: chat.messages.map(msg => ({ ...msg, read: true }))
    };

    setChats(prevChats => 
      prevChats.map(c => c.id === chat.id ? updatedChat : c)
    );

    setSelectedChat(updatedChat);
    setActiveTab('chat');
  };

  const goBack = (): void => {
    setSelectedChat(null);
    setActiveTab('list');
    setInputText('');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return '#16a34a';
      case 'busy': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getChatTypeColor = (type: string): string => {
    return type === 'delivery' ? '#dc2626' : '#2563eb';
  };

  const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => (
    <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.chatAvatar}>
        <Text style={styles.avatarText}>{chat.avatar}</Text>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(chat.status) }]} />
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <View style={styles.chatMeta}>
            <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
            {chat.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: getChatTypeColor(chat.type) }]}>
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.chatPreview}>
          <View style={[styles.typeIndicator, { backgroundColor: getChatTypeColor(chat.type) }]} />
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user';
    const bubbleColor = isUser ? '#2563eb' : 
                       message.sender === 'delivery' ? '#dc2626' : '#16a34a';
    
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
        <View style={[styles.messageContent, { backgroundColor: isUser ? bubbleColor : '#f1f5f9' }]}>
          <Text style={[styles.messageText, { color: isUser ? 'white' : '#1f2937' }]}>
            {message.text}
          </Text>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{message.timestamp}</Text>
          {isUser && (
            <Text style={styles.messageStatus}>
              {message.read ? '✓✓' : message.delivered ? '✓' : '○'}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  if (activeTab === 'chat' && selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
        
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatHeaderAvatar}>
              <Text style={styles.headerAvatarText}>{selectedChat.avatar}</Text>
              <View style={[styles.headerStatusDot, { backgroundColor: getStatusColor(selectedChat.status) }]} />
            </View>
            <View>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedChat.status === 'online' ? 'Online' : 
                 selectedChat.status === 'busy' ? 'Busy' : 'Offline'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.chatContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={selectedChat.messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>{selectedChat.name} is typing...</Text>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#94a3b8"
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#16a34a' : '#d1d5db' }]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Text style={styles.sendIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Chat with delivery & support</Text>
      </View>

      {/* Chat Types Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <View style={styles.filterButton}>
            <View style={[styles.filterDot, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.filterText}>Delivery</Text>
          </View>
          <View style={styles.filterButton}>
            <View style={[styles.filterDot, { backgroundColor: '#2563eb' }]} />
            <Text style={styles.filterText}>Support</Text>
          </View>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => openChat(item)} />
        )}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: '#2563eb' }]}
          onPress={() => Alert.alert('Support', 'Starting new support chat...')}
        >
          <Text style={styles.quickActionIcon}>🎧</Text>
          <Text style={styles.quickActionText}>New Support Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  filterText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  chatAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    textAlign: 'center',
    lineHeight: 40,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTime: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  unreadBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  quickActions: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  quickActionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Chat Screen Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatHeaderAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 32,
  },
  headerStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#bfdbfe',
  },
  callButton: {
    padding: 8,
  },
  callIcon: {
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesContent: {
    paddingVertical: 12,
  },
  messageBubble: {
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  userBubble: {
    alignItems: 'flex-end',
  },
  otherBubble: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginRight: 4,
  },
  messageStatus: {
    fontSize: 10,
    color: '#16a34a',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748b',
    marginHorizontal: 1,
  },
  dot1: { opacity: 1 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 0.3 },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    maxHeight: 80,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendIcon: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MessagingPage;