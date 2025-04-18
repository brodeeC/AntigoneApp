import { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, useColorScheme, Keyboard, ScrollView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

interface WordEntry {
  form: string;
  lemma: string;
  lemma_id: number;
  line_number: number;
  postag: string;
  speaker: string;
}

interface CaseInfo {
  [key: string]: string;
}

interface Definition {
  def_num: number;
  short_def: string;
}

interface WordDataEntry extends Array<unknown> {
  0: WordEntry;
  1?: { case?: CaseInfo };
  2?: { definitions?: Definition[] };
  length: 3;
}

export default function WordSearch() {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'definition'>('word');
  const [results, setResults] = useState<WordDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [collapsedEntries, setCollapsedEntries] = useState<Record<number, boolean>>({});

  const sanitizeInput = useCallback((text: string) => 
    text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, ''), []);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!query.trim()) return;

    const safeQuery = sanitizeInput(query.trim());
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `http://brodeeclontz.com/AntigoneApp/search?mode=${mode}&q=${encodeURIComponent(safeQuery)}`
      );
      const data: WordDataEntry[] = await res.json();
      setResults(data || []);
      
      // Initialize collapsed state
      const initialCollapsed: Record<number, boolean> = {};
      data?.forEach((_: WordDataEntry, index: number) => {
        initialCollapsed[index] = true;
      });
      setCollapsedEntries(initialCollapsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, mode, sanitizeInput]);

  const handleWordDetails = useCallback((form: string) => {
    router.push(`/word-details/${form}`);
  }, []);

  const handleLineDetails = useCallback((lineNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/line-details/[start]/[[end]]',
      params: { start: lineNumber.toString() }
    });
  }, []);

  const toggleDefinitionCollapse = useCallback((index: number) => {
    Haptics.selectionAsync();
    setCollapsedEntries(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Antigone Lexicon Search</Text>
        <Text style={styles.subtitle}>Search by {mode === 'word' ? 'Greek word forms' : 'English definitions'}</Text>

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

        <View style={styles.inputContainer}>
          <Feather name="search" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
          <TextInput
            placeholder={mode === 'word' ? "Search Greek words..." : "Search definitions..."}
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>

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

        {hasSearched && !loading && (
          <ScrollView
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {results.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="search" size={40} color={isDark ? '#94A3B8' : '#64748B'} />
                <Text style={styles.emptyText}>No results found</Text>
                <Text style={styles.emptySubtext}>Try a different search term</Text>
              </View>
            ) : (
              results.map((entry, index) => {
                if (!entry || !entry[0]) return null;

                const isCollapsed = collapsedEntries[index] !== false;
                const { form, lemma, line_number, postag, speaker } = entry[0];
                const definitions = entry[2]?.definitions || [];
                console.log(entry[0])

                return (
                  <View key={`${entry[0].lemma_id}-${index}`} style={styles.entryContainer}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{index + 1}</Text>
                      <Text style={styles.entryForm}>{form}</Text>
                    </View>

                    <View style={styles.entryRow}>
                      <Text style={styles.entryLabel}>Lemma:</Text>
                      <Text style={styles.entryValue}>{lemma}</Text>
                    </View>

                    <View style={styles.entryRow}>
                      <Text style={styles.entryLabel}>Line:</Text>
                      <Text style={styles.entryValue}>{line_number}</Text>
                      <TouchableOpacity 
                        style={styles.goButton}
                        onPress={() => handleLineDetails(line_number)}
                      >
                        <Text style={styles.goButtonText}>Go</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.entryRow}>
                      <Text style={styles.entryLabel}>Speaker:</Text>
                      <Text style={styles.entryValue}>{speaker}</Text>
                    </View>

                    {definitions.length > 0 && (
                      <View style={styles.definitionContainer}>
                        <Text style={styles.sectionTitle}>Definitions:</Text>
                        {definitions.slice(0, 3).map((def) => (
                          <Text key={def.def_num} style={styles.definitionText}>
                            {def.def_num}. {def.short_def}
                          </Text>
                        ))}
                        
                        {!isCollapsed && definitions.length > 3 && 
                          definitions.slice(3).map((def) => (
                            <Text key={def.def_num} style={styles.definitionText}>
                              {def.def_num}. {def.short_def}
                            </Text>
                          ))
                        }
                        
                        {definitions.length > 3 && (
                          <TouchableOpacity 
                            onPress={() => toggleDefinitionCollapse(index)}
                            style={styles.toggleButton}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.toggleButtonText}>
                              {isCollapsed
                                ? `Show ${definitions.length - 3} more definitions` 
                                : 'Show less'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    <View style={styles.actionButtonContainer}>
                      <TouchableOpacity
                        onPress={() => handleWordDetails(form)}
                        style={[styles.actionButton, styles.detailsButton]}
                      >
                        <Text style={styles.actionButtonText}>Word Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
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
    paddingBottom: 40,
  },
  entryContainer: {
    padding: 16,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#64B5F6' : '#1E88E5',
    marginRight: 12,
  },
  entryForm: {
    fontSize: 18,
    fontWeight: '700',
    color: isDark ? '#F8FAFC' : '#1E293B',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  entryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#94A3B8' : '#64748B',
    marginRight: 6,
  },
  entryValue: {
    fontSize: 14,
    color: isDark ? '#E2E8F0' : '#334155',
    marginRight: 12,
  },
  goButton: {
    backgroundColor: isDark ? '#4CAF50' : '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  goButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  definitionContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#CBD5E1' : '#475569',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 14,
    color: isDark ? '#E2E8F0' : '#334155',
    lineHeight: 20,
    marginBottom: 4,
  },
  toggleButtonText: {
    fontSize: 12,
    color: isDark ? '#64B5F6' : '#1E88E5',
    fontWeight: '600',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: isDark ? '#1E88E5' : '#1E88E5',
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