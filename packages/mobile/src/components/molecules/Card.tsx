import { View, StyleSheet } from 'react-native';
import { Button, Typography } from '../atoms';

/**
 * Card Molecule Component
 * Combines Typography and Button atoms
 */

interface CardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function Card({ 
  title, 
  description, 
  onPress, 
  buttonText,
  variant = 'primary'
}: CardProps) {
  return (
    <View style={styles.container}>
      <Typography variant="h3" style={styles.title}>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body" style={styles.description}>
          {description}
        </Typography>
      )}
      
      {onPress && buttonText && (
        <Button 
          variant={variant}
          onPress={onPress}
          style={styles.button}
          title={buttonText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
});
