import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { accentFor } from '@/lib/appTheme';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { LinearGradient } from 'expo-linear-gradient';

export default function LineSearch() {
  const router = useRouter();
  const [startLine, setStartLine] = useState('');
  const [endLine, setEndLine] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const isDark = useColorScheme() === 'dark';
  const accent = accentFor(isDark);

  const handleSearch = () => {
    Keyboard.dismiss();
  
    const start = parseInt(startLine);
    const end = parseInt(endLine);
  
    if (!isNaN(start)) {
      const endParam = !isNaN(end) && end > start ? end : start;
      
      router.push({
        pathname: "/line-details/[start]/[end]",
        params: {
          start: start.toString(),
          end: endParam.toString()
        }
      });
    } else {
      alert("Please enter a valid start line number");
    }
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: accent }]}>By line</Text>
        <Text style={styles.title}>Jump to text</Text>
        <Text style={styles.subtitle}>Enter a line or range of lines</Text>
        <LinearGradient
          colors={isDark ? ['#4CC9F0', '#4361EE'] : ['#4361EE', '#5B8DEF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />

        <GlassPanel isDark={isDark} padding={16}>
          <View style={styles.inputContainer}>
          <Feather name="hash" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder="Start Line"
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            keyboardType="number-pad"
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
            keyboardType="number-pad"
            value={endLine}
            onChangeText={setEndLine}
            style={styles.input}
            clearButtonMode="while-editing"
          />
          </View>

          <View style={styles.buttonsContainer}>
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
        </GlassPanel>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 44,
  },
  content: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    color: isDark ? '#E2E8F0' : '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 18,
    color: isDark ? '#94A3B8' : '#64748B',
    textAlign: 'center',
  },
  accentBar: {
    height: 4,
    width: 70,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#4CC9F0' : '#4361EE',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    flex: 1,
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
    fontWeight: '800',
  },
});