import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, SPACING } from '../constants';
import { 
  generateInvitationCode, 
  getMyInvitationCodes 
} from '../services/invitationService';
import { InvitationCode } from '../types/invitation';

export function InviteScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const cardBg = isDark ? '#1e1e1e' : '#fff';

  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [myInvitationCodes, setMyInvitationCodes] = useState<InvitationCode[]>([]);

  useEffect(() => {
    loadMyInvitationCodes();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        setCurrentCode(null);
        setExpiresAt(null);
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const loadMyInvitationCodes = async () => {
    const { data, error } = await getMyInvitationCodes();
    if (data) {
      setMyInvitationCodes(data);
    }
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    const { data, error } = await generateInvitationCode();
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data) {
      setCurrentCode(data.code);
      setExpiresAt(data.expires_at);
      loadMyInvitationCodes();
    }
  };

  const handleCopyCode = () => {
    if (!currentCode) return;
    // TODO: Implement clipboard copy
    Alert.alert('Copied!', `Code ${currentCode} copied to clipboard`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1" style={{ color: textColor }}>
          Invite Friends
        </Typography>
        <Typography variant="body" style={{ color: '#999', marginTop: 4 }}>
          Generate invitation codes for your friends
        </Typography>
      </View>

      {/* Current Active Code */}
      {currentCode && (
        <View style={[styles.activeCodeCard, { backgroundColor: cardBg }]}>
          <View style={styles.codeHeader}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Typography variant="caption" style={{ color: '#999', marginLeft: 8 }}>
              Expires in {timeRemaining}
            </Typography>
          </View>
          
          <View style={styles.codeDisplay}>
            <Typography variant="h1" style={{ color: COLORS.primary, letterSpacing: 4 }}>
              {currentCode}
            </Typography>
          </View>

          <Button
            title="Copy Code"
            onPress={handleCopyCode}
            variant="primary"
            icon="copy-outline"
          />
        </View>
      )}

      {/* Generate Button */}
      <View style={styles.section}>
        <Button
          title={currentCode ? "Generate New Code" : "Generate Invitation Code"}
          onPress={handleGenerateCode}
          variant="primary"
          icon="add-circle-outline"
          disabled={loading}
        />
        
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Typography variant="caption" style={{ color: '#666', marginLeft: 8, flex: 1 }}>
            Each code is valid for 5 minutes and can only be used once
          </Typography>
        </View>
      </View>

      {/* History */}
      <View style={styles.section}>
        <Typography variant="h3" style={{ color: textColor, marginBottom: SPACING.md }}>
          Invitation History
        </Typography>
        
        {myInvitationCodes.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Typography variant="body" style={{ color: '#999', marginTop: 12 }}>
              No invitations yet
            </Typography>
          </View>
        ) : (
          myInvitationCodes.map((invite) => (
            <View key={invite.id} style={[styles.historyCard, { backgroundColor: cardBg }]}>
              <View style={styles.historyHeader}>
                <Typography variant="body" style={{ color: textColor, fontWeight: '600', letterSpacing: 2 }}>
                  {invite.code}
                </Typography>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: invite.is_used ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Typography variant="caption" style={{ color: '#fff' }}>
                    {invite.is_used ? 'Used' : 'Unused'}
                  </Typography>
                </View>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#999" />
                  <Typography variant="caption" style={{ color: '#999', marginLeft: 4 }}>
                    Created: {formatDate(invite.created_at)}
                  </Typography>
                </View>
                
                {invite.is_used && invite.used_at && (
                  <View style={styles.detailRow}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
                    <Typography variant="caption" style={{ color: '#4CAF50', marginLeft: 4 }}>
                      Used: {formatDate(invite.used_at)}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  section: {
    padding: SPACING.lg,
  },
  activeCodeCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  codeDisplay: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
    borderRadius: 12,
  },
  historyCard: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  historyDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
