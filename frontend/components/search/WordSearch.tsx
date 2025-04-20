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

export default function WordSearch() {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'definition'>('word');
  const [results, setResults] = useState<WordDataEntry[]>([]);
  const [filteredResults, setFilteredResults] = useState<WordDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [allSpeakers, setAllSpeakers] = useState<string[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [speakersLoading, setSpeakersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 5;

  const paginatedResults = filteredResults.slice(
    currentPage * resultsPerPage,
    (currentPage + 1) * resultsPerPage
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const goToNextPage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const goToPrevPage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const displayedResults = showAllResults ? filteredResults : filteredResults.slice(0, 5);

  const sanitizeInput = useCallback((text: string) => 
    text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, ''), []);

  // Fetch all speakers on component mount
  useEffect(() => {
    const fetchSpeakers = async () => {
      setSpeakersLoading(true);
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

  // Filter results when selectedSpeaker changes
  useEffect(() => {
    if (selectedSpeaker) {
      const filtered = results.filter(entry => 
        entry[0]?.speaker?.toLowerCase() === selectedSpeaker.toLowerCase()
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results);
    }
  }, [selectedSpeaker, results]);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
    if (!query.trim()) return;
  
    const safeQuery = sanitizeInput(query.trim());
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(
        `http://brodeeclontz.com/AntigoneApp/search?mode=${mode}&q=${encodeURIComponent(safeQuery)}`
      );
  
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        if (data.error) throw new Error(data.error);
        if (!Array.isArray(data)) throw new Error('Unexpected response format');
        
        setResults(data);
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
  }, [query, mode, sanitizeInput]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredResults]);

  const handleWordDetails = useCallback((form: string) => {
    router.push(`/word-details/${form}`)
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
  }, [selectedSpeaker]);

  const clearFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSpeaker(null);
    setQuery('');
    setResults([]);
    setFilteredResults([]);
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
          <Text style={styles.title}>Antigone Lexicon Search</Text>
          <Text style={styles.subtitle}>
            {selectedSpeaker 
              ? `Showing results for speaker: ${selectedSpeaker}` 
              : 'Search by ' + (mode === 'word' ? 'word (Greek or Latin characters)' : 'English definitions')}
          </Text>

          {/* Search Mode Toggle */}
          <View style={styles.toggleContainer}>
            {['word', 'definition'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleButton,
                  mode === option && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setMode(option as 'word' | 'definition');
                  setSelectedSpeaker(null); // Reset speaker when changing mode
                }}
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

          {/* Speaker Filter */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Filter by Speaker</Text>
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

          {/* Search Input */}
          <View style={styles.inputContainer}>
            <Feather name="search" size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.inputIcon} />
            <TextInput
              placeholder={mode === 'word' ? "Search words..." : "Search definitions..."}
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
                styles.searchButton,
                (!query && !selectedSpeaker) && { opacity: 0.5 }
              ]}
              disabled={!query && !selectedSpeaker}
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
          </View>

          {/* Results */}
          {hasSearched && !loading && (
            <View style={styles.resultsContainer}>
              {filteredResults.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="search" size={40} color={isDark ? '#94A3B8' : '#64748B'} />
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubtext}>
                    {selectedSpeaker 
                      ? `No ${mode === 'word' ? 'words' : 'definitions'} found for speaker ${selectedSpeaker}`
                      : 'Try a different search term'}
                  </Text>
                </View>
              ) : (
                <>
                  {paginatedResults.map((entry, index) => {
                    if (!entry || !entry[0]) return null;

                    const { form, lemma, line_number, speaker } = entry[0];
                    const definitions = entry[2]?.definitions?.slice(0, 3) || [];

                    return (
                      <View key={`${entry[0].lemma_id}-${index}`} style={styles.entryContainer}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>{currentPage * resultsPerPage + index + 1}</Text>
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
                  {filteredResults.length > resultsPerPage && (
                    <View style={styles.paginationContainer}>
                      <TouchableOpacity
                        onPress={goToPrevPage}
                        disabled={currentPage === 0}
                        style={[
                          styles.paginationButton,
                          currentPage === 0 && styles.paginationButtonDisabled
                        ]}
                      >
                        <Feather 
                          name="chevron-left" 
                          size={20} 
                          color={currentPage === 0 ? 
                            (isDark ? '#64748B' : '#94A3B8') : 
                            (isDark ? '#64B5F6' : '#1E88E5')} 
                        />
                      </TouchableOpacity>
                      
                      <Text style={styles.paginationText}>
                        {currentPage + 1} / {totalPages}
                      </Text>
                      
                      <TouchableOpacity
                        onPress={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        style={[
                          styles.paginationButton,
                          currentPage === totalPages - 1 && styles.paginationButtonDisabled
                        ]}
                      >
                        <Feather 
                          name="chevron-right" 
                          size={20} 
                          color={currentPage === totalPages - 1 ? 
                            (isDark ? '#64748B' : '#94A3B8') : 
                            (isDark ? '#64B5F6' : '#1E88E5')} 
                        />
                      </TouchableOpacity>
                    </View>
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
    marginBottom: 16,
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#64B5F6' : '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    flex: 1,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 20,
  },
  paginationButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: isDark ? 'rgba(100, 181, 246, 0.1)' : 'rgba(30, 136, 229, 0.1)',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#E2E8F0' : '#1E293B',
  },
});