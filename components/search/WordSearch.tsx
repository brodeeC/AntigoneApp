import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, useColorScheme, Keyboard, FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

type Definition = {
  def_num: number;
  short_def: string;
  queries: string;
};

type WordInfo = {
  form: string;
  lemma: string;
  lemma_id: number;
  line_number: number;
  postag: string;
  speaker: string;
};

type WordResult = [WordInfo, any?, { definitions: Definition[] }?];

export default function WordSearch() {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'definition'>('word');
  const [results, setResults] = useState<WordResult[]>([]);
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (text: string) => text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, '');

  const handleSearch = async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!query.trim()) return;

    const safeQuery = sanitizeInput(query.trim());
    setLoading(true);
    try {
      const res = await fetch(`http://brodeeclontz.com/AntigoneApp/search?mode=${mode}&q=${encodeURIComponent(safeQuery)}`);
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const handleWordDetails = (form: string) => {
    router.push(`/word-details/${form}`)
  };

  const handleLineDetails = (lineNumber: number) => {
    router.push({
      pathname: '/line-details/[start]/[[end]]',
      params: { start: lineNumber.toString() }
    });
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Search Words</Text>
        <Text style={styles.subtitle}>Search by word or definition</Text>

        {/* Toggle for word vs definition search */}
        <View style={styles.toggleContainer}>
          {['word', 'definition'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.toggleButton,
                mode === option && styles.toggleButtonActive,
              ]}
              onPress={() => setMode(option as 'word' | 'definition')}
            >
              <Text style={[
                styles.toggleText,
                mode === option && styles.toggleTextActive
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search input */}
        <View style={styles.inputContainer}>
          <Feather name="search" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            keyboardType="default"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Search button */}
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.8}
          style={styles.searchButton}
        >
          <Text style={styles.searchButtonText}>Search</Text>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Results */}
        {loading ? (
          <Text style={styles.subtitle}>Searching...</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const wordInfo = item[0];
              const defs = item[2]?.definitions?.[0];
              return (
                <View style={styles.resultItem}>
                  <Text style={styles.resultWord}>Lemma: {wordInfo.lemma}</Text>
                  <Text style={styles.resultDefinition}>Line: {wordInfo.line_number} (Speaker: {wordInfo.speaker})</Text>
                  <Text style={styles.resultDefinition}>Definition: {defs?.short_def || 'No definition found'}</Text>
            
                  <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => handleWordDetails(wordInfo.form)}
                      style={[styles.actionButton, { backgroundColor: '#1E88E5' }]}
                    >
                      <Text style={styles.actionButtonText}>More Details</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity
                      onPress={() => handleLineDetails(wordInfo.line_number)}
                      style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                    >
                      <Text style={styles.actionButtonText}>Go</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            style={{ marginTop: 20 }}
            ListEmptyComponent={<Text style={styles.subtitle}>No results found</Text>}
          />
        )}
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
    marginTop: 12,
    color: isDark ? '#94A3B8' : '#64748B',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
  },
  toggleButtonActive: {
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
  },
  toggleText: {
    fontSize: 14,
    color: isDark ? '#CBD5E1' : '#475569',
  },
  toggleTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
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
    justifyContent: 'center',
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
    borderRadius: 10,
    marginBottom: 10,
  },
  resultWord: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#F8FAFC' : '#1E293B',
  },
  resultDefinition: {
    fontSize: 14,
    color: isDark ? '#CBD5E1' : '#475569',
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});