import { useState, useCallback, useEffect } from 'react';
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

interface Definition {
  def_num: number;
  short_def: string;
}

interface WordDataEntry extends Array<unknown> {
  0: WordEntry;
  1?: any;
  2?: { definitions?: Definition[] };
  length: 3;
}

export default function SpeakerSearch() {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WordDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [allSpeakers, setAllSpeakers] = useState<string[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [speakersLoading, setSpeakersLoading] = useState(true);

  const displayedResults = showAllResults ? results : results.slice(0, 5);

  // Fetch all speakers on component mount
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('http://brodeeclontz.com/AntigoneApp/get_all_speakers');
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllSpeakers(data);
        }
      } catch (err) {
        console.error('Failed to fetch speakers:', err);
      } finally {
        setSpeakersLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const sanitizeInput = useCallback((text: string) => 
    text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, ''), []);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Use selected speaker if available, otherwise use text query
    const searchTerm = selectedSpeaker || query.trim();
    if (!searchTerm) return;

    const safeQuery = sanitizeInput(searchTerm);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(
        `http://brodeeclontz.com/AntigoneApp/search?mode=word&q=${encodeURIComponent(safeQuery)}`
      );

      const responseText = await response.text();
      try {
        const data = JSON.parse(responseText);
        if (data.error) throw new Error(data.error);
        if (!Array.isArray(data)) throw new Error('Unexpected response format');
        
        // Filter results by speaker if a speaker is selected
        const filteredResults = selectedSpeaker 
          ? data.filter((entry: WordDataEntry) => 
              entry[0]?.speaker?.toLowerCase() === selectedSpeaker.toLowerCase())
          : data;
        
        setResults(filteredResults);
      } catch (parseError) {
        console.error('Parse error:', parseError, 'Response:', responseText);
        throw new Error('Failed to parse server response');
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      alert(`Search failed: ${err instanceof Error ? err.message : 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  }, [query, selectedSpeaker, sanitizeInput]);

  const handleWordDetails = useCallback((form: string) => {
    router.push(`/word-details/${form}`);
  }, []);

  const handleLineDetails = useCallback((lineNumber: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/line-details/[start]/[end]',
      params: { start: lineNumber.toString(), end: lineNumber.toString() }
    });
  }, []);

  const handleSpeakerSelect = useCallback((speaker: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSpeaker(speaker === selectedSpeaker ? null : speaker);
    setQuery(''); // Clear text input when selecting a speaker
  }, [selectedSpeaker]);

  const clearFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSpeaker(null);
    setQuery('');
    setResults([]);
    setHasSearched(false);
  }, []);

  return (
    <LinearGradient
      colors={isDark ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Speaker Search</Text>
          <Text style={styles.subtitle}>
            {selectedSpeaker 
              ? `Showing results for speaker: ${selectedSpeaker}` 
              : 'Search by speaker or word'}
          </Text>

          {/* Speaker Filter Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Speaker</Text>
            {speakersLoading ? (
              <ActivityIndicator size="small" color={isDark ? '#64B5F6' : '#1E88E5'} />
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.speakersContainer}
              >
                {allSpeakers.map((speaker) => (
                  <TouchableOpacity
                    key={speaker}
                    style={[
                      styles.speakerButton,
                      selectedSpeaker === speaker && styles.speakerButtonActive
                    ]}
                    onPress={() => handleSpeakerSelect(speaker)}
                  >
                    <Text style={[
                      styles.speakerButtonText,
                      selectedSpeaker === speaker && styles.speakerButtonTextActive
                    ]}>
                      {speaker}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Search Input Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Or Search Words</Text>
            <View style={styles.inputContainer}>
              <Feather 
                name="search" 
                size={20} 
                color={isDark ? '#94A3B8' : '#64748B'} 
                style={styles.inputIcon} 
              />
              <TextInput
                placeholder="Search words..."
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
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={clearFilters}
              style={[
                styles.actionButton,
                styles.clearButton,
                !selectedSpeaker && !query && { opacity: 0.5 }
              ]}
              disabled={!selectedSpeaker && !query}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSearch}
              style={[
                styles.actionButton,
                styles.searchButton,
                (!query && !selectedSpeaker) && { opacity: 0.5 }
              ]}
              disabled={!query && !selectedSpeaker}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Results Section */}
          {hasSearched && !loading && (
            <View style={styles.resultsContainer}>
              {results.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather 
                    name="search" 
                    size={40} 
                    color={isDark ? '#94A3B8' : '#64748B'} 
                  />
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubtext}>
                    {selectedSpeaker 
                      ? `No words found for speaker ${selectedSpeaker}`
                      : 'Try a different search term'}
                  </Text>
                </View>
              ) : (
                <>
                  {displayedResults.map((entry, index) => {
                    if (!entry || !entry[0]) return null;

                    const { form, lemma, line_number, speaker } = entry[0];
                    const definitions = entry[2]?.definitions?.slice(0, 3) || [];

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
                            style={styles.lineButton}
                            onPress={() => handleLineDetails(line_number)}
                          >
                            <Text style={styles.lineButtonText}>Go</Text>
                          </TouchableOpacity>
                        </View>

                        {!selectedSpeaker && (
                          <View style={styles.entryRow}>
                            <Text style={styles.entryLabel}>Speaker:</Text>
                            <Text style={styles.entryValue}>{speaker}</Text>
                          </View>
                        )}

                        {definitions.length > 0 && (
                          <View style={styles.definitionContainer}>
                            <Text style={styles.sectionTitle}>Definitions:</Text>
                            {definitions.map((def) => (
                              <Text key={def.def_num} style={styles.definitionText}>
                                {def.def_num}. {def.short_def}
                              </Text>
                            ))}
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => handleWordDetails(form)}
                          style={styles.detailsButton}
                        >
                          <Text style={styles.detailsButtonText}>Word Details</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  {results.length > 5 && (
                    <TouchableOpacity
                      onPress={() => setShowAllResults(!showAllResults)}
                      style={styles.showAllButton}
                    >
                      <Text style={styles.showAllButtonText}>
                        {showAllResults ? 'Show Less' : `Show All (${results.length})`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#CBD5E1' : '#475569',
    marginBottom: 12,
  },
  speakersContainer: {
    paddingBottom: 8,
  },
  speakerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  speakerButtonActive: {
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    borderColor: isDark ? '#64B5F6' : '#1E88E5',
  },
  speakerButtonText: {
    fontSize: 14,
    color: isDark ? '#CBD5E1' : '#475569',
  },
  speakerButtonTextActive: {
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  clearButton: {
    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  clearButtonText: {
    color: isDark ? '#E2E8F0' : '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 12,
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
  lineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: isDark ? '#64748B' : '#94A3B8',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  lineButtonText: {
    color: isDark ? '#E2E8F0' : '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  definitionContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  definitionText: {
    fontSize: 14,
    color: isDark ? '#E2E8F0' : '#334155',
    lineHeight: 20,
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: isDark ? '#1E88E5' : '#1E88E5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  detailsButtonText: {
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
  showAllButton: {
    backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
    borderWidth: 1,
    borderColor: isDark ? '#64B5F6' : '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  showAllButtonText: {
    color: isDark ? '#64B5F6' : '#1E88E5',
    fontWeight: '600',
  },
});