import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Keyboard,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { fetchMetadata } from '@/lib/api';
import { getLastReadPage, setLastReadPage } from '@/lib/readingProgress';
import { homeStyles, homeColors } from '@/styles/home.styles';

type Metadata = Awaited<ReturnType<typeof fetchMetadata>>;

function GlassCard({
  isDark,
  children,
  noBottomMargin,
  fillHeight,
}: {
  isDark: boolean;
  children: React.ReactNode;
  /** Row tiles: avoid double gap; parent row handles spacing */
  noBottomMargin?: boolean;
  /** Stretch in a row so paired cards share the same height */
  fillHeight?: boolean;
}) {
  const borderGlass = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: borderGlass,
        marginBottom: noBottomMargin ? 0 : 14,
        flex: fillHeight ? 1 : undefined,
        alignSelf: fillHeight ? 'stretch' : undefined,
      }}
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={isDark ? 48 : 56}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(30,41,59,0.92)' : 'rgba(255,255,255,0.94)',
            },
          ]}
        />
      )}
      <View
        style={{
          position: 'relative',
          flex: fillHeight ? 1 : undefined,
          alignSelf: fillHeight ? 'stretch' : undefined,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function HomeTab() {
  const isDark = useColorScheme() === 'dark';
  const styles = homeStyles(isDark);
  const router = useRouter();

  const [meta, setMeta] = useState<Metadata | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [savedPage, setSavedPage] = useState<number | null>(null);
  const [lineInput, setLineInput] = useState('');
  const [lineError, setLineError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const loadSidebar = useCallback(async () => {
    try {
      const m = await fetchMetadata();
      setMeta(m);
      setMetaError(null);
    } catch {
      setMetaError('Could not load edition info. Reading still works offline from cached bounds.');
    }
    const p = await getLastReadPage();
    setSavedPage(p);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSidebar();
    }, [loadSidebar])
  );

  const maxLine = meta?.maxLine ?? 1353;

  const triggerLight = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const goRead = (page?: number) => {
    triggerLight();
    if (page != null && page >= 1) {
      void setLastReadPage(page);
    }
    router.push('/(tabs)/read');
  };

  const goSearchWord = () => {
    triggerLight();
    router.push({ pathname: '/(tabs)/search', params: { tab: 'Word Search' } });
  };

  const goSearchLine = () => {
    triggerLight();
    router.push({ pathname: '/(tabs)/search', params: { tab: 'Line Search' } });
  };

  const goAbout = () => {
    triggerLight();
    router.push('/(tabs)/about');
  };

  const handleJumpLine = () => {
    Keyboard.dismiss();
    triggerLight();
    setLineError(null);
    const n = parseInt(lineInput.trim(), 10);
    if (!Number.isFinite(n) || n < 1) {
      setLineError('Enter a valid line number.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (n > maxLine) {
      setLineError(`Line must be at most ${maxLine}.`);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    router.push({
      pathname: '/line-details/[start]/[end]',
      params: { start: String(n), end: String(n) },
    });
    setLineInput('');
  };

  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={isDark ? [...homeColors.darkBg] : [...homeColors.lightBg]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? homeColors.darkAccent : homeColors.lightAccent}
        />
      </LinearGradient>
    );
  }

  const resumeLabel =
    savedPage != null && savedPage > 1
      ? `Resume page ${savedPage}`
      : 'Open reader';

  return (
    <LinearGradient
      colors={isDark ? [...homeColors.darkBg] : [...homeColors.lightBg]}
      style={styles.safe}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heroTitle}>Antigone</Text>
          <Text style={styles.heroAuthor}>Sophocles</Text>
          <Text style={[styles.metaLine, { marginTop: 8 }]}>
            Greek text · reader · search · line study
          </Text>

          <Text style={[styles.metaLine, { marginTop: 12 }]}>
            {meta ? (
              <>
                Lines {meta.minLine}–{meta.maxLine} · Pages {meta.firstPage}–{meta.lastPage} (
                {meta.linesPerPage} lines/page) · data v{meta.apiVersion}
              </>
            ) : metaError ? (
              metaError
            ) : (
              'Loading edition bounds…'
            )}
          </Text>

          <View style={styles.sectionPad}>
            <Text style={styles.sectionLabel}>Read</Text>
            <GlassCard isDark={isDark}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>Browse the play</Text>
                <Text style={styles.cardSubtitle}>
                  Paginated Greek text with speakers. Your page is remembered on this device.
                </Text>
                <View style={styles.ctaRow}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => goRead()}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons name="menu-book" size={22} color="#FFF" />
                    <Text style={styles.primaryButtonText}>{resumeLabel}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.ghostButton, { alignSelf: 'flex-start', marginTop: 10 }]}
                  onPress={() => goRead(1)}
                >
                  <Text style={styles.ghostButtonText}>Start from page 1</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>

          <Text style={styles.sectionLabel}>Jump by line</Text>
          <GlassCard isDark={isDark}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>Line reference</Text>
              <Text style={styles.cardSubtitle}>
                Open any line in context (same view as line search).
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Line number"
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  value={lineInput}
                  onChangeText={setLineInput}
                  keyboardType="number-pad"
                  style={styles.jumpInput}
                  returnKeyType="go"
                  onSubmitEditing={handleJumpLine}
                />
                <TouchableOpacity style={styles.jumpButton} onPress={handleJumpLine}>
                  <Text style={styles.jumpButtonText}>Go</Text>
                </TouchableOpacity>
              </View>
              {lineError ? <Text style={styles.errorText}>{lineError}</Text> : null}
            </View>
          </GlassCard>

          <Text style={styles.sectionLabel}>Search</Text>
          <View style={styles.actionsRow}>
            <View style={styles.actionHalf}>
              <GlassCard isDark={isDark} noBottomMargin fillHeight>
                <TouchableOpacity
                  onPress={goSearchWord}
                  activeOpacity={0.88}
                  style={{ flex: 1, alignSelf: 'stretch' }}
                >
                  <View style={[styles.cardInner, styles.searchCardInner]}>
                    <MaterialIcons
                      name="translate"
                      size={28}
                      color={isDark ? homeColors.darkAccent : homeColors.lightAccent}
                    />
                    <Text style={[styles.cardTitle, { marginTop: 10 }]}>Lexicon</Text>
                    <Text style={styles.cardSubtitle}>Word & definition search</Text>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            </View>
            <View style={styles.actionHalf}>
              <GlassCard isDark={isDark} noBottomMargin fillHeight>
                <TouchableOpacity
                  onPress={goSearchLine}
                  activeOpacity={0.88}
                  style={{ flex: 1, alignSelf: 'stretch' }}
                >
                  <View style={[styles.cardInner, styles.searchCardInner]}>
                    <MaterialIcons
                      name="format-list-numbered"
                      size={28}
                      color={isDark ? homeColors.darkAccent : homeColors.lightAccent}
                    />
                    <Text style={[styles.cardTitle, { marginTop: 10 }]}>By line #</Text>
                    <Text style={styles.cardSubtitle}>Numeric line range</Text>
                  </View>
                </TouchableOpacity>
              </GlassCard>
            </View>
          </View>

          <TouchableOpacity onPress={goAbout} style={{ marginTop: 12, paddingVertical: 8 }}>
            <Text style={styles.linkText}>About · sources & data</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
