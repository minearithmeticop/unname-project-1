import { Tabs } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Loading } from '../../src/components/atoms/Loading';
import { AuthScreen } from '../../src/screens/AuthScreen';

export default function TabLayout() {
  const { user, loading } = useAuth();

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
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
