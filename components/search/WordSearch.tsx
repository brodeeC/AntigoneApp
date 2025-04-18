import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, useColorScheme, Keyboard, FlatList,
  ActivityIndicator, Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

type Definition = {
  def_num: number;
  short_def: string;
  queries: string;
};

type CaseInfo = {
  [key: string]: string;
};

type WordInfo = {
  form: string;
  lemma: string;
  lemma_id: number;
  line_number: number;
  postag: string;
  speaker: string;
};

// Each result item is an array with 3 elements:
// 0: WordInfo
// 1: { case: CaseInfo } 
// 2: { definitions: Definition[] }
type WordResultItem = [WordInfo, { case?: CaseInfo }, { definitions?: Definition[] }];

export default function WordSearch() {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'definition'>('word');
  const [results, setResults] = useState<WordResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sanitizeInput = (text: string) => text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, '');

  const handleSearch = async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!query.trim()) return;

    const safeQuery = sanitizeInput(query.trim());
    setLoading(true);
    setHasSearched(true);
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
    router.push(`/word-details/${form}`);
  };

  const handleLineDetails = (lineNumber: number) => {
    router.push({
      pathname: '/line-details/[start]/[[end]]',
      params: { start: lineNumber.toString() }
    });
  };

  const handleDictionaryLink = (queries: string) => {
    try {
      const parsedQueries = JSON.parse(queries.replace(/'/g, '"'));
      if (parsedQueries.length > 0) {
        Linking.openURL(parsedQueries[0].url);
      }
    } catch (err) {
      console.error('Failed to parse dictionary links', err);
    }
  };

  const renderResultItem = ({ item }: { item: WordResultItem }) => {
    // Destructure the array elements
    const [wordInfo, caseObj, definitionsObj] = item;
    const caseInfo = caseObj?.case;
    const definitions = definitionsObj?.definitions || [];
    
    console.log("WordInfo:", wordInfo); 
    console.log("Form:", wordInfo.form); 
    
    return (
      <View style={styles.resultItem}>
        {/* Header with word form and lemma */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultWord}>{wordInfo.form}</Text>
          <Text style={styles.resultLemma}>{wordInfo.lemma}</Text>
        </View>
        
        {/* Metadata row */}
        <View style={styles.resultMeta}>
          <Text style={styles.resultMetaText}>Line {wordInfo.line_number}</Text>
          <Text style={styles.resultMetaText}>•</Text>
          <Text style={styles.resultMetaText}>{wordInfo.speaker}</Text>
        </View>
        
        {/* Case information */}
        {caseInfo && (
          <View style={styles.caseContainer}>
            {Object.entries(caseInfo).map(([key, value]) => (
              value !== '-' && (
                <View key={key} style={styles.casePill}>
                  <Text style={styles.caseText}>{value}</Text>
                </View>
              )
            ))}
          </View>
        )}
        
        {/* Definitions */}
        {definitions.length > 0 && (
          <View style={styles.definitionsContainer}>
            <Text style={styles.sectionTitle}>Definitions:</Text>
            {definitions.slice(0, 3).map((def) => (
              <View key={def.def_num} style={styles.definitionItem}>
                <Text style={styles.definitionText}>
                  {def.def_num}. {def.short_def}
                </Text>
                <TouchableOpacity 
                  onPress={() => handleDictionaryLink(def.queries)}
                  style={styles.dictionaryLink}
                >
                  <Feather name="external-link" size={14} color={isDark ? '#64B5F6' : '#1E88E5'} />
                  <Text style={[styles.dictionaryLinkText, { color: isDark ? '#64B5F6' : '#1E88E5' }]}>
                    View in dictionary
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            {definitions.length > 3 && (
              <Text style={[styles.resultMetaText, { marginTop: 8 }]}>
                +{definitions.length - 3} more definitions...
              </Text>
            )}
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            onPress={() => handleWordDetails(wordInfo.form)}
            style={[styles.actionButton, styles.detailsButton]}
          >
            <Feather name="book-open" size={16} color="#FFF" />
            <Text style={styles.actionButtonText}>Word Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleLineDetails(wordInfo.line_number)}
            style={[styles.actionButton, styles.goButton]}
          >
            <Feather name="book" size={16} color="#FFF" />
            <Text style={styles.actionButtonText}>View Line</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Antigone Lexicon Search</Text>
        <Text style={styles.subtitle}>Search by {mode === 'word' ? 'Greek word forms' : 'English definitions'}</Text>

        {/* Search mode toggle */}
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
                {option === 'word' ? 'Greek Word' : 'Definition'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search input */}
        <View style={styles.inputContainer}>
          <Feather name="search" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder={mode === 'word' ? "Search Greek words..." : "Search definitions..."}
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            keyboardType="default"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>

        {/* Search button */}
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.8}
          style={styles.searchButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.searchButtonText}>Search</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Results section */}
        {hasSearched && !loading && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item[0].lemma_id}-${index}`}
            renderItem={renderResultItem}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="search" size={40} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={styles.emptyText}>No results found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </LinearGradient>
  );
}

// Keep your existing getStyles function

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: isDark ? '#E2E8F0' : '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    color: isDark ? '#94A3B8' : '#64748B',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  toggleButton: {
    paddingVertical: 10,
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
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  resultItem: {
    padding: 16,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    shadowColor: isDark ? '#000' : '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  resultWord: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? '#F8FAFC' : '#1E293B',
  },
  resultLemma: {
    fontSize: 16,
    color: isDark ? '#94A3B8' : '#64748B',
    fontStyle: 'italic',
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  resultMetaText: {
    fontSize: 14,
    color: isDark ? '#94A3B8' : '#64748B',
  },
  caseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  casePill: {
    backgroundColor: isDark ? 'rgba(100, 181, 246, 0.2)' : 'rgba(30, 136, 229, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  caseText: {
    fontSize: 12,
    color: isDark ? '#64B5F6' : '#1E88E5',
    fontWeight: '500',
  },
  definitionsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#CBD5E1' : '#475569',
    marginBottom: 8,
  },
  definitionItem: {
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 14,
    color: isDark ? '#E2E8F0' : '#334155',
    lineHeight: 20,
  },
  dictionaryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  dictionaryLinkText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  detailsButton: {
    backgroundColor: isDark ? '#1E88E5' : '#1E88E5',
  },
  goButton: {
    backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#E2E8F0' : '#1E293B',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: isDark ? '#94A3B8' : '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});