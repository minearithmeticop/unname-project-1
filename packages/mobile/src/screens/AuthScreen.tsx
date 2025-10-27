import { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Typography } from '../components/atoms/Typography'
import { Button } from '../components/atoms/Button'
import { useAuth } from '../contexts/AuthContext'
import { SPACING, COLORS } from '../constants'

type AuthMode = 'signin' | 'signup' | 'reset'

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, resetPassword } = useAuth()

  const handleAuth = async () => {
    if (!email.trim() || (mode !== 'reset' && !password.trim())) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password)
        if (error) {
          Alert.alert('Sign In Failed', error.message)
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email.trim(), password)
        if (error) {
          Alert.alert('Sign Up Failed', error.message)
        } else {
          Alert.alert(
            'Success!',
            'Please check your email to verify your account.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setMode('signin')
                  setPassword('')
                },
              },
            ]
          )
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email.trim())
        if (error) {
          Alert.alert('Reset Failed', error.message)
        } else {
          Alert.alert(
            'Check Your Email',
            'Password reset instructions have been sent to your email.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setMode('signin')
                },
              },
            ]
          )
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Welcome Back!'
      case 'signup':
        return 'Create Account'
      case 'reset':
        return 'Reset Password'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'signin':
        return 'Sign in to continue'
      case 'signup':
        return 'Create a new account to get started'
      case 'reset':
        return 'Enter your email to reset password'
    }
  }

  const getButtonText = () => {
    switch (mode) {
      case 'signin':
        return 'Sign In'
      case 'signup':
        return 'Sign Up'
      case 'reset':
        return 'Send Reset Email'
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            {getTitle()}
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            {getSubtitle()}
          </Typography>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Typography variant="body" style={styles.label}>
              Email
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {mode !== 'reset' && (
            <View style={styles.inputContainer}>
              <Typography variant="body" style={styles.label}>
                Password
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          )}

          {mode === 'signin' && (
            <TouchableOpacity
              onPress={() => setMode('reset')}
              disabled={loading}
            >
              <Typography variant="caption" style={styles.forgotPassword}>
                Forgot password?
              </Typography>
            </TouchableOpacity>
          )}

          <Button
            title={loading ? '' : getButtonText()}
            onPress={handleAuth}
            variant="primary"
            disabled={loading}
            style={styles.button}
          >
            {loading && <ActivityIndicator color="#fff" />}
          </Button>

          <View style={styles.footer}>
            {mode === 'signin' && (
              <>
                <Typography variant="body" style={styles.footerText}>
                  Don't have an account?{' '}
                </Typography>
                <TouchableOpacity
                  onPress={() => setMode('signup')}
                  disabled={loading}
                >
                  <Typography
                    variant="body"
                    style={[styles.footerText, styles.link]}
                  >
                    Sign Up
                  </Typography>
                </TouchableOpacity>
              </>
            )}

            {mode === 'signup' && (
              <>
                <Typography variant="body" style={styles.footerText}>
                  Already have an account?{' '}
                </Typography>
                <TouchableOpacity
                  onPress={() => setMode('signin')}
                  disabled={loading}
                >
                  <Typography
                    variant="body"
                    style={[styles.footerText, styles.link]}
                  >
                    Sign In
                  </Typography>
                </TouchableOpacity>
              </>
            )}

            {mode === 'reset' && (
              <>
                <Typography variant="body" style={styles.footerText}>
                  Remember your password?{' '}
                </Typography>
                <TouchableOpacity
                  onPress={() => setMode('signin')}
                  disabled={loading}
                >
                  <Typography
                    variant="body"
                    style={[styles.footerText, styles.link]}
                  >
                    Sign In
                  </Typography>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <Typography variant="caption" style={styles.securityNote}>
          🔒 Your data is secured with Supabase
        </Typography>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  title: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  forgotPassword: {
    color: COLORS.primary,
    textAlign: 'right',
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
    minHeight: 48,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  securityNote: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: SPACING.xl,
  },
})
