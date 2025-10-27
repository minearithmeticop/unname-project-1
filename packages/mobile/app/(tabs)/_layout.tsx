import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Loading } from '../../src/components/atoms/Loading';
import { AuthScreen } from '../../src/screens/AuthScreen';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // กำหนดสีตาม theme
  const isDark = theme === 'dark';
  const headerBg = isDark ? '#1a1a1a' : '#ffffff';
  const tabBarBg = isDark ? '#1a1a1a' : '#f8f8f8';
  const tabBarBorder = isDark ? '#2a2a2a' : '#e5e5e5';
  const activeColor = '#007AFF';
  const inactiveColor = isDark ? '#8E8E93' : '#999999';

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

  // ถ้ายังไม่ได้ login → แสดงหน้า login (ไม่มี tabs)
  if (!user) {
    console.log('🚫 No user found, showing AuthScreen');
    return <AuthScreen />;
  }

  // ถ้า login แล้ว → แสดง tabs ปกติ
  console.log('✅ User authenticated, showing tabs');
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: '', // ซ่อนชื่อใน header
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerShadowVisible: false, // ไม่แสดงเงาใต้ header
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
        },
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
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
