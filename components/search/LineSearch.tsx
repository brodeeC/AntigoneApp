import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LineSearch() {
  const router = useRouter();
  const [startLine, setStartLine] = useState('');
  const [endLine, setEndLine] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const isDark = useColorScheme() === 'dark';

  const handleSearch = () => {
    Keyboard.dismiss(); 
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const start = parseInt(startLine);
    const end = parseInt(endLine);
    console.log(end.toString())
  
    if (!isNaN(start)) {
      router.push({
        pathname: '/line-details/[start]/[[end]]',
        params: end > start ? { 
          start: start.toString(),
          end: end.toString()
        } : {
          start: start.toString()
        }
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('Please enter a valid start line number');
    }
  };

  const styles = getStyles(isDark);

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Search by Line Number</Text>
        <Text style={styles.subtitle}>Enter a line or range from Antigone</Text>
        
        <View style={styles.inputContainer}>
          <Feather name="hash" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder="Start Line"
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            keyboardType="numeric"
            value={startLine}
            onChangeText={setStartLine}
            style={styles.input}
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="hash" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder="End Line (optional)"
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            keyboardType="numeric"
            value={endLine}
            onChangeText={setEndLine}
            style={styles.input}
            clearButtonMode="while-editing"
          />
        </View>

        <TouchableOpacity
          onPress={handleSearch}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={0.8}
          style={[
            styles.searchButton,
            isPressed && styles.searchButtonPressed,
            (!startLine) && styles.disabledButton
          ]}
          disabled={!startLine}
        >
          <Text style={styles.searchButtonText}>
            {startLine && endLine ? `View Lines ${startLine}-${endLine}` : 
             startLine ? `View Line ${startLine}` : 'Enter Line Number'}
          </Text>
          <Feather 
            name="arrow-right" 
            size={20} 
            color={isDark ? '#E2E8F0' : '#F8FAFC'} 
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -300, 
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: isDark ? '#E2E8F0' : '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: isDark ? '#94A3B8' : '#64748B',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: isDark ? '#F8FAFC' : '#1E293B',
    fontSize: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  searchButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    backgroundColor: isDark ? '#334155' : '#CBD5E1',
  },
  searchButtonText: {
    color: isDark ? '#E2E8F0' : '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});