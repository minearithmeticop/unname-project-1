import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Loading } from '../../src/components/atoms/Loading';
import { AuthScreen } from '../../src/screens/AuthScreen';
import { ProfileDrawer } from '../../src/components/organisms/ProfileDrawer';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // กำหนดสีตาม theme
  const isDark = theme === 'dark';
  const headerBg = isDark ? '#1a1a1a' : '#ffffff';
  const iconColor = isDark ? '#ffffff' : '#000000';
  const tabBarBg = isDark ? '#1a1a1a' : '#ffffff';
  const tabBarActiveTint = '#2196F3';
  const tabBarInactiveTint = isDark ? '#888' : '#999';

  console.log('🔐 TabLayout - Auth state:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    loading 
  });

  // แสดง Loading ขณะกำลังตรวจสอบ authentication
  if (loading) {
    console.log('⏳ Still loading authentication...');
    return <Loading message="Loading..." fullScreen />;
  }

  // ถ้ายังไม่ได้ login → แสดงหน้า login
  if (!user) {
    console.log('🚫 No user found, showing AuthScreen');
    return <AuthScreen />;
  }

  // ถ้า login แล้ว → แสดง Tabs with header
  console.log('✅ User authenticated, showing app');
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: headerBg,
          },
          headerShadowVisible: false,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons name="menu" size={28} color={iconColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeToggle}
            >
              <View style={[
                styles.toggleContainer,
                { backgroundColor: isDark ? '#333' : '#ccc' }
              ]}>
                <View style={styles.iconWrapper}>
                  <Ionicons 
                    name="sunny" 
                    size={16} 
                    color={!isDark ? '#FFB000' : '#666'} 
                  />
                </View>
                <View style={[
                  styles.toggleSwitch,
                  {
                    backgroundColor: '#fff',
                    transform: [{ translateX: isDark ? 34 : 0 }]
                  }
                ]} />
                <View style={styles.iconWrapper}>
                  <Ionicons 
                    name="moon" 
                    size={16} 
                    color={isDark ? '#FFD700' : '#666'} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopColor: isDark ? '#333' : '#e0e0e0',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: tabBarActiveTint,
          tabBarInactiveTintColor: tabBarInactiveTint,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="todo" 
          options={{ 
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-circle" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="dreams" 
          options={{ 
            title: 'Dreams',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="moon" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="calendar" 
          options={{ 
            title: 'Calendar',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }} 
        />
      </Tabs>

      <ProfileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 16,
  },
  themeToggle: {
    marginRight: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 64,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 2,
    position: 'relative',
  },
  iconWrapper: {
    zIndex: 2,
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleSwitch: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    left: 2,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
