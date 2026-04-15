import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabLayout from './(tabs)/tabLayout';
import { screenGradient, accentFor } from '@/lib/appTheme';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { clearAllBookmarks, listBookmarks, removeBookmark, type Bookmark } from '@/lib/bookmarks';

export default function BookmarksScreen() {
  const isDark = useColorScheme() === 'dark';
  const accent = accentFor(isDark);
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const next = await listBookmarks();
    setItems(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.push('/(tabs)/home');
  };

  const openBookmark = (b: Bookmark) => {
    if (b.kind === 'line') {
      router.push({ pathname: '/line-details/[start]/[end]', params: { start: String(b.line), end: String(b.line) } });
      return;
    }
    if (b.kind === 'page') {
      router.push({ pathname: '/(tabs)/read', params: { page: String(b.page) } });
      return;
    }
    if (b.kind === 'range') {
      router.push({ pathname: '/line-details/[start]/[end]', params: { start: String(b.start), end: String(b.end) } });
      return;
    }
    if (b.line != null) {
      router.push({ pathname: '/line-details/[start]/[end]', params: { start: String(b.line), end: String(b.line) } });
      return;
    }
    const w = (b.lemma ?? b.word).trim();
    router.push(`/word-details/${encodeURIComponent(w)}`);
  };

  const onRemove = async (b: Bookmark) => {
    await removeBookmark(b);
    await load();
  };

  const onClearAll = async () => {
    Alert.alert('Clear all bookmarks?', 'This removes bookmarks from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearAllBookmarks();
          await load();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TabLayout>
        <LinearGradient colors={screenGradient(isDark)} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: insets.top + 17,
              paddingBottom: insets.bottom + 36,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <TouchableOpacity onPress={goBack} activeOpacity={0.85} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="chevron-left" size={26} color={isDark ? '#E2E8F0' : '#1E293B'} />
              </TouchableOpacity>
              <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                Bookmarks
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <GlassPanel isDark={isDark} padding={18} style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
                Saved for later
              </Text>
              <Text style={{ fontSize: 15, lineHeight: 22, color: isDark ? '#CBD5E1' : '#475569' }}>
                Bookmark a line or a lexicon entry. Tap a bookmark to jump back in.
              </Text>

              {items.length > 0 && (
                <TouchableOpacity
                  onPress={() => void onClearAll()}
                  activeOpacity={0.85}
                  style={{
                    marginTop: 14,
                    alignSelf: 'flex-start',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 14,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="delete-outline" size={18} color={accent} />
                  <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </GlassPanel>

            {loading ? (
              <GlassPanel isDark={isDark} padding={22}>
                <Text style={{ textAlign: 'center', fontWeight: '700', color: isDark ? '#CBD5E1' : '#475569' }}>Loading…</Text>
              </GlassPanel>
            ) : items.length === 0 ? (
              <GlassPanel isDark={isDark} padding={22}>
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800', color: isDark ? '#E2E8F0' : '#1E293B' }}>
                  No bookmarks yet
                </Text>
                <Text style={{ marginTop: 8, textAlign: 'center', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 22 }}>
                  Tap the bookmark icon on a line or in the lexicon preview.
                </Text>
              </GlassPanel>
            ) : (
              items.map((b, idx) => {
                const title =
                  b.kind === 'line'
                    ? `Line ${b.line}`
                    : b.kind === 'page'
                      ? `Page ${b.page}`
                      : b.kind === 'range'
                        ? `Lines ${b.start}–${b.end}`
                    : (b.lemma ?? b.word);
                const subtitle =
                  b.kind === 'line'
                    ? 'Line bookmark'
                    : b.kind === 'page'
                      ? 'Page bookmark'
                      : b.kind === 'range'
                        ? 'Range bookmark'
                    : b.line != null
                      ? `Word bookmark · from line ${b.line}`
                      : 'Word bookmark';

                return (
                  <GlassPanel key={`${b.kind}-${idx}-${b.createdAt}`} isDark={isDark} padding={14} style={{ marginBottom: 12 }}>
                    <TouchableOpacity onPress={() => openBookmark(b)} activeOpacity={0.86} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isDark ? 'rgba(76, 201, 240, 0.12)' : 'rgba(67, 97, 238, 0.10)',
                          borderWidth: 1,
                          borderColor: isDark ? 'rgba(76, 201, 240, 0.28)' : 'rgba(67, 97, 238, 0.20)',
                        }}
                      >
                        <MaterialIcons
                          name={
                            b.kind === 'line'
                              ? 'format-quote'
                              : b.kind === 'page'
                                ? 'auto-stories'
                                : b.kind === 'range'
                                  ? 'view-list'
                                  : 'menu-book'
                          }
                          size={18}
                          color={accent}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? '#F8FAFC' : '#0F172A' }} numberOfLines={1}>
                          {String(title)}
                        </Text>
                        <Text style={{ marginTop: 2, fontSize: 13, color: isDark ? '#94A3B8' : '#64748B' }} numberOfLines={1}>
                          {subtitle}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => void onRemove(b)} activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <MaterialIcons name="close" size={20} color={isDark ? 'rgba(226,232,240,0.6)' : 'rgba(30,41,59,0.45)'} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </GlassPanel>
                );
              })
            )}
          </ScrollView>
        </LinearGradient>
      </TabLayout>
    </>
  );
}

