import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, useColorScheme, Keyboard, ScrollView,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { accentFor } from '@/lib/appTheme';
import { router } from 'expo-router';
import { buildSearchUrl, getSpeakersUrl } from '@/lib/api';
import { GlassPanel } from '@/components/ui/GlassPanel';

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
  const accent = accentFor(isDark);
  const styles = getStyles(isDark);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'definition'>('word');
  const [results, setResults] = useState<WordDataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [allSpeakers, setAllSpeakers] = useState<string[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);
  const [speakersLoading, setSpeakersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 5;

  const paginatedResults = results.slice(
    currentPage * resultsPerPage,
    (currentPage + 1) * resultsPerPage
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };
  
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const sanitizeInput = useCallback((text: string) => 
    text.replace(/[^a-zA-Zά-ωΑ-Ω\s']/g, ''), []);

  // Fetch all speakers on component mount
  useEffect(() => {
    const fetchSpeakers = async () => {
      setSpeakersLoading(true);
      try {
        const response = await fetch(getSpeakersUrl());
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

  const doSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const safeQuery = sanitizeInput(trimmedQuery);
    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const url = buildSearchUrl({
        mode,
        q: safeQuery,
        speaker: selectedSpeaker,
      });
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Unexpected server response. Please try again.');
      }

      if (!Array.isArray(data)) {
        console.error('Response is not an array:', data);
        throw new Error('Unexpected response format');
      }

      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
      alert(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [query, mode, sanitizeInput, selectedSpeaker]);

  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    void doSearch();
  }, [doSearch]);

  // Refetch when speaker chip changes after a search (server-side filter)
  useEffect(() => {
    if (!hasSearched || !query.trim()) return;
    void doSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when speaker changes
  }, [selectedSpeaker]);
  

  useEffect(() => {
    setCurrentPage(0);
  }, [results]);

  const handleWordDetails = useCallback((form: string) => {
    router.push(`/word-details/${form}`)
  }, []);

  const handleLineDetails = useCallback((lineNumber: number) => {
    router.push({
      pathname: '/line-details/[start]/[end]',
      params: { start: lineNumber.toString(), end: lineNumber.toString() }
    });
  }, []);

  const handleSpeakerSelect = useCallback((speaker: string) => {
    setSelectedSpeaker(speaker === selectedSpeaker ? null : speaker);
  }, [selectedSpeaker]);

  const clearFilters = useCallback(() => {
    setSelectedSpeaker(null);
    setQuery('');
    setResults([]);
    setHasSearched(false);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: accent }]}>Lexicon</Text>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>
            {selectedSpeaker 
              ? `Showing results for speaker: ${selectedSpeaker}` 
              : 'Search by ' + (mode === 'word' ? 'word (Greek or Latin characters)' : 'English definitions')}
          </Text>

        <GlassPanel isDark={isDark} padding={16} style={styles.panel}>
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
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.toggleText,
                    mode === option && styles.toggleTextActive,
                  ]}
                >
                  {option === 'word' ? 'Greek word' : 'Definition'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Speaker Filter */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Filter by Speaker</Text>
            {speakersLoading ? (
              <ActivityIndicator size="small" color={accent} />
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
                    activeOpacity={0.85}
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
              activeOpacity={0.85}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSearch}
              style={[
                styles.searchButton,
                (!query) && { opacity: 0.5 }
              ]}
              disabled={!query}
              activeOpacity={0.85}
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
        </GlassPanel>

          {/* Results */}
          {hasSearched && !loading && (
            <View style={styles.resultsContainer}>
              {results.length === 0 ? (
                <GlassPanel isDark={isDark} padding={22} style={styles.panel}>
                  <View style={styles.emptyState}>
                    <Feather name="search" size={40} color={isDark ? '#94A3B8' : '#64748B'} />
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>
                      {selectedSpeaker
                        ? `No ${mode === 'word' ? 'words' : 'definitions'} found for speaker ${selectedSpeaker}`
                        : 'Try a different search term'}
                    </Text>
                  </View>
                </GlassPanel>
              ) : (
                <>
                  {paginatedResults.map((entry, index) => {
                    if (!entry || !entry[0]) return null;

                    const { form, lemma, line_number, speaker } = entry[0];
                    const definitions = entry[2]?.definitions?.slice(0, 3) || [];

                    return (
                      <GlassPanel key={`${entry[0].lemma_id}-${index}`} isDark={isDark} padding={16} style={styles.entryContainer}>
                        <View style={styles.entryHeader}>
                          <Text style={[styles.entryTitle, { color: accent }]}>#{currentPage * resultsPerPage + index + 1}</Text>
                          <Text style={styles.entryForm}>{form}</Text>
                        </View>

                        <View style={styles.entryRow}>
                          <Text style={styles.entryLabel}>Lemma</Text>
                          <Text style={styles.entryValue}>{lemma}</Text>
                        </View>

                        <View style={styles.entryRow}>
                          <Text style={styles.entryLabel}>Line</Text>
                          <Text style={styles.entryValue}>{line_number}</Text>
                          <TouchableOpacity 
                            style={[styles.lineButton, { borderColor: accent }]}
                            onPress={() => handleLineDetails(line_number)}
                            activeOpacity={0.85}
                          >
                            <Text style={[styles.lineButtonText, { color: accent }]}>Go</Text>
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
                            <Text style={styles.sectionTitle}>Definitions</Text>
                            {definitions.map((def) => (
                              <Text key={def.def_num} style={styles.definitionText}>
                                {def.def_num}. {def.short_def}
                              </Text>
                            ))}
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => handleWordDetails(form)}
                          style={[styles.detailsButton, { backgroundColor: accent }]}
                          activeOpacity={0.88}
                        >
                          <Text style={styles.detailsButtonText}>Full entry</Text>
                          <Feather name="arrow-up-right" size={16} color="#FFF" />
                        </TouchableOpacity>
                      </GlassPanel>
                    );
                  })}
                  {results.length > resultsPerPage && (
                    <View style={styles.paginationContainer}>
                      <TouchableOpacity
                        onPress={goToPrevPage}
                        disabled={currentPage === 0}
                        style={[
                          styles.paginationButton,
                          currentPage === 0 && styles.paginationButtonDisabled
                        ]}
                        activeOpacity={0.85}
                      >
                        <Feather 
                          name="chevron-left" 
                          size={20} 
                          color={currentPage === 0 ? 
                            (isDark ? '#64748B' : '#94A3B8') : 
                            accent} 
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
                        activeOpacity={0.85}
                      >
                        <Feather 
                          name="chevron-right" 
                          size={20} 
                          color={currentPage === totalPages - 1 ? 
                            (isDark ? '#64748B' : '#94A3B8') : 
                            accent} 
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
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  scrollContainer: {
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
  panel: {
    marginBottom: 14,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: isDark ? '#CBD5E1' : '#475569',
    marginBottom: 12,
  },
  speakersContainer: {
    paddingBottom: 8,
  },
  speakerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: isDark ? 'rgba(76, 201, 240, 0.10)' : 'rgba(67, 97, 238, 0.08)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(76, 201, 240, 0.22)' : 'rgba(67, 97, 238, 0.18)',
  },
  speakerButtonActive: {
    backgroundColor: isDark ? 'rgba(76, 201, 240, 0.20)' : 'rgba(67, 97, 238, 0.16)',
    borderColor: isDark ? 'rgba(76, 201, 240, 0.46)' : 'rgba(67, 97, 238, 0.40)',
  },
  speakerButtonText: {
    fontSize: 14,
    color: isDark ? '#E2E8F0' : '#334155',
  },
  speakerButtonTextActive: {
    fontWeight: '700',
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
    borderRadius: 999,
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
  },
  toggleButtonActive: {
    backgroundColor: isDark ? 'rgba(76, 201, 240, 0.18)' : 'rgba(67, 97, 238, 0.14)',
    borderColor: isDark ? 'rgba(76, 201, 240, 0.40)' : 'rgba(67, 97, 238, 0.34)',
  },
  toggleText: {
    fontSize: 14,
    color: isDark ? '#CBD5E1' : '#475569',
  },
  toggleTextActive: {
    fontWeight: '800',
    color: isDark ? '#F8FAFC' : '#0F172A',
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
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  clearButtonText: {
    color: isDark ? '#E2E8F0' : '#1E293B',
    fontSize: 16,
    fontWeight: '800',
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
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  resultsContainer: {
    marginTop: 12,
  },
  entryContainer: {
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: 12,
  },
  entryForm: {
    fontSize: 18,
    fontWeight: '900',
    color: isDark ? '#F8FAFC' : '#1E293B',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  entryLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
    borderColor: isDark ? 'rgba(76, 201, 240, 0.42)' : 'rgba(67, 97, 238, 0.40)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  lineButtonText: {
    color: isDark ? '#E2E8F0' : '#334155',
    fontSize: 12,
    fontWeight: '800',
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
    backgroundColor: isDark ? '#4CC9F0' : '#4361EE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  detailsButtonText: {
    color: '#FFF',
    fontWeight: '900',
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
    backgroundColor: isDark ? 'rgba(76, 201, 240, 0.10)' : 'rgba(67, 97, 238, 0.08)',
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