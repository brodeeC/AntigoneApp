import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, getDynamicStyles } from '../../styles/word-details.styles';
import { router, useLocalSearchParams } from 'expo-router';
import TabLayout from '../(tabs)/tabLayout';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { screenGradient, accentFor } from '@/lib/appTheme';
import { getWordDetailsUrl } from '@/lib/api';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface WordEntry {
  form: string;
  lemma: string;
  line_number: string;
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

interface WordDataEntry {
  [0]: WordEntry;
  [1]?: { case?: CaseInfo };
  [2]?: { definitions?: Definition[] };
}

export default function WordDetails() {
  const { word } = useLocalSearchParams();
  const [wordData, setWordData] = useState<WordDataEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackPressed, setIsBackPressed] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 4;

  const totalPages = wordData ? Math.ceil(wordData.length / resultsPerPage) : 0;

  const paginatedResults = wordData
    ? wordData.slice(currentPage * resultsPerPage, (currentPage + 1) * resultsPerPage)
    : [];

  const isDarkMode = useColorScheme() === 'dark';
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const insets = useSafeAreaInsets();
  const accent = accentFor(isDarkMode);

  const scrollViewRef = useRef<ScrollView>(null);

  const [collapsedEntries, setCollapsedEntries] = useState<Record<number, boolean>>({});

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const toggleDefinitionCollapse = useCallback((index: number) => {
    setCollapsedEntries((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  };

  const handleLineNavigation = (lineNum: string) => {
    router.push({
      pathname: '/line-details/[start]/[end]',
      params: { start: lineNum, end: lineNum },
    });
  };

  useEffect(() => {
    const fetchWordDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(getWordDetailsUrl(String(word)));
        if (!response.ok) throw new Error('Failed to load word details');

        const json: WordDataEntry[] = await response.json();

        if (!json || json.length === 0) {
          setError('No data available for this word');
          setWordData(null);
        } else {
          setWordData(json);
          const initialCollapsed: Record<number, boolean> = {};
          json.forEach((_, index) => {
            initialCollapsed[index] = true;
          });
          setCollapsedEntries(initialCollapsed);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading word details');
      } finally {
        setLoading(false);
      }
    };
    fetchWordDetails();
  }, [word]);

  if (loading) {
    return (
      <TabLayout>
        <LinearGradient colors={screenGradient(isDarkMode)} style={{ flex: 1 }}>
          <View style={[dynamicStyles.loadingContainer, { paddingTop: insets.top }]}>
            <GlassPanel isDark={isDarkMode} padding={28}>
              <ActivityIndicator size="large" color={accent} />
              <Text
                style={[
                  dynamicStyles.morphText,
                  { marginTop: 16, textAlign: 'center', fontWeight: '700' },
                ]}
              >
                Loading lexicon…
              </Text>
            </GlassPanel>
          </View>
        </LinearGradient>
      </TabLayout>
    );
  }

  if (error) {
    return (
      <TabLayout>
        <LinearGradient colors={screenGradient(isDarkMode)} style={{ flex: 1 }}>
          <View style={[dynamicStyles.loadingContainer, { paddingTop: insets.top }]}>
            <GlassPanel isDark={isDarkMode} padding={22}>
              <Text style={dynamicStyles.errorText}>{error}</Text>
            </GlassPanel>
          </View>
        </LinearGradient>
      </TabLayout>
    );
  }

  if (!wordData) {
    return (
      <TabLayout>
        <LinearGradient colors={screenGradient(isDarkMode)} style={{ flex: 1 }}>
          <Text style={dynamicStyles.errorText}>Data unavailable</Text>
        </LinearGradient>
      </TabLayout>
    );
  }

  return (
    <TabLayout>
      <LinearGradient colors={screenGradient(isDarkMode)} style={{ flex: 1 }}>
        <View style={dynamicStyles.wordDetailsContainer}>
          <View style={[dynamicStyles.headerGlass, { marginTop: insets.top + 4 }]}>
            <GlassPanel isDark={isDarkMode} padding={14}>
              <View style={dynamicStyles.headerRow}>
                <TouchableOpacity
                  onPressIn={() => setIsBackPressed(true)}
                  onPressOut={() => setIsBackPressed(false)}
                  onPress={handleGoBack}
                  style={[dynamicStyles.backButton, isBackPressed && dynamicStyles.backButtonPressed]}
                  activeOpacity={0.85}
                >
                  <Feather
                    name="chevron-left"
                    size={24}
                    color={isDarkMode ? Colors.dark.buttonText : Colors.light.buttonText}
                  />
                </TouchableOpacity>
                <Text style={dynamicStyles.headerTitle} numberOfLines={2}>
                  {typeof word === 'string' ? word : 'Lemma'}
                </Text>
              </View>
            </GlassPanel>
          </View>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 48 }}
            showsVerticalScrollIndicator={false}
          >
            {paginatedResults.map((entry, index) => {
              const absoluteIndex = currentPage * resultsPerPage + index;

              if (!entry || !entry[0]) return null;

              const { form, lemma, line_number, postag, speaker } = entry[0];
              const lineNum = line_number;
              const caseInfo: CaseInfo | null = entry[1]?.case ?? null;
              const definitions: Definition[] = entry[2]?.definitions ?? [];

              return (
                <View key={absoluteIndex} style={dynamicStyles.entryWrap}>
                  <GlassPanel isDark={isDarkMode} padding={18}>
                    <View style={dynamicStyles.entryHeader}>
                      <Text style={dynamicStyles.entryIndex}>#{absoluteIndex + 1}</Text>
                      <Text style={dynamicStyles.entryBadge}>Occurrence</Text>
                    </View>

                    <View style={dynamicStyles.row}>
                      <Text style={dynamicStyles.label}>Form</Text>
                      <Text style={dynamicStyles.value}>{form}</Text>
                    </View>
                    <View style={dynamicStyles.row}>
                      <Text style={dynamicStyles.label}>Lemma</Text>
                      <Text style={dynamicStyles.value}>{lemma}</Text>
                    </View>
                    <View style={dynamicStyles.row}>
                      <Text style={dynamicStyles.label}>Line</Text>
                      <Text style={dynamicStyles.valuePlain}>{lineNum}</Text>
                      <TouchableOpacity
                        style={dynamicStyles.goButton}
                        onPress={() => handleLineNavigation(String(lineNum))}
                        activeOpacity={0.88}
                      >
                        <Text style={dynamicStyles.goButtonText}>Go</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={dynamicStyles.row}>
                      <Text style={dynamicStyles.label}>POS</Text>
                      <Text style={dynamicStyles.valuePlain}>{postag}</Text>
                    </View>
                    <View style={dynamicStyles.row}>
                      <Text style={dynamicStyles.label}>Speaker</Text>
                      <Text style={dynamicStyles.valuePlain}>{speaker}</Text>
                    </View>

                    <Text style={dynamicStyles.sectionLabel}>Morphology</Text>
                    <View style={dynamicStyles.morphPanel}>
                      {caseInfo ? (
                        <Text style={dynamicStyles.morphText}>
                          {Object.entries(caseInfo)
                            .filter(([, v]) => v !== '-')
                            .map(([, v]) => `${String(v)}. `)
                            .join('')}
                        </Text>
                      ) : (
                        <Text style={dynamicStyles.noDataText}>No morphology for this row.</Text>
                      )}
                    </View>

                    <Text style={dynamicStyles.sectionLabel}>Definitions</Text>
                    <View style={dynamicStyles.defPanel}>
                      {definitions.length > 0 ? (
                        <>
                          {definitions.slice(0, 3).map(({ def_num, short_def }) => (
                            <Text key={def_num} style={dynamicStyles.defLine}>
                              {`${def_num}. ${short_def}`}
                            </Text>
                          ))}
                          {collapsedEntries[absoluteIndex] === false &&
                            definitions.length > 3 &&
                            definitions.slice(3).map(({ def_num, short_def }) => (
                              <Text key={def_num} style={dynamicStyles.defLine}>
                                {`${def_num}. ${short_def}`}
                              </Text>
                            ))}
                          {definitions.length > 3 && (
                            <TouchableOpacity
                              onPress={() => toggleDefinitionCollapse(absoluteIndex)}
                              style={dynamicStyles.toggleButton}
                              activeOpacity={0.85}
                            >
                              <Text style={dynamicStyles.toggleButtonText}>
                                {collapsedEntries[absoluteIndex] !== false
                                  ? `Show ${definitions.length - 3} more`
                                  : 'Show less'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <Text style={dynamicStyles.noDataText}>No definitions.</Text>
                      )}
                    </View>
                  </GlassPanel>
                </View>
              );
            })}
          </ScrollView>

          {totalPages > 1 && (
            <View style={dynamicStyles.paginationContainer}>
              <TouchableOpacity
                onPress={goToPrevPage}
                disabled={currentPage === 0}
                style={[
                  dynamicStyles.paginationButton,
                  currentPage === 0 && dynamicStyles.paginationButtonDisabled,
                ]}
                activeOpacity={0.85}
              >
                <Feather name="chevron-left" size={24} color={accent} />
              </TouchableOpacity>

              <Text style={dynamicStyles.paginationText}>
                {currentPage + 1}{' '}
                <Text style={dynamicStyles.paginationMuted}>of</Text> {totalPages}
              </Text>

              <TouchableOpacity
                onPress={goToNextPage}
                disabled={currentPage === totalPages - 1}
                style={[
                  dynamicStyles.paginationButton,
                  currentPage === totalPages - 1 && dynamicStyles.paginationButtonDisabled,
                ]}
                activeOpacity={0.85}
              >
                <Feather name="chevron-right" size={24} color={accent} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </TabLayout>
  );
}
