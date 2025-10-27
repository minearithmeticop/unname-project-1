import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Button Atom Component
 * Base button with variants
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;  // For compatibility with React Native Button API
  variant?: ButtonVariant;
  loading?: boolean;
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Button({ 
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  children,
  onPress,
  icon,
  ...props 
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const content = title || children;

  const handlePress = (event: any) => {
    console.log('🟢 Button pressed!', { title, content });
    if (onPress) {
      onPress(event);
    }
  };

  const getIconColor = () => {
    if (variant === 'primary' || variant === 'secondary') return '#fff';
    if (variant === 'ghost') return '#007AFF';
    return '#007AFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={getIconColor()} 
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, styles[`${variant}Text`]]}>
            {content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#007AFF',
  },
  ghostText: {
    color: '#007AFF',
  },
});
