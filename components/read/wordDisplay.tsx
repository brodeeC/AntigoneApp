import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { screenGradient, accentFor } from '@/lib/appTheme';
import { getWordDetailsUrl } from '@/lib/api';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getWordDisplayStyles } from '@/styles/wordDisplay.styles';

type WordDetailsProps = {
  word: string;
  lineNumber: number;
};

export default function WordDetails({ word, lineNumber }: WordDetailsProps) {
  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDarkMode = useColorScheme() === 'dark';
  const ws = getWordDisplayStyles(isDarkMode);
  const spin = accentFor(isDarkMode);

  useEffect(() => {
    const fetchWordDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(getWordDetailsUrl(word));
        if (!response.ok) throw new Error('Failed to load word details');
        const json = await response.json();

        const matchingEntry =
          json.find(
            (entry: any) =>
              entry[0]?.line_number === lineNumber || entry[0]?.form === word
          ) ||
          json[3] ||
          json[0];

        if (matchingEntry) {
          setWordData(matchingEntry);
        } else {
          setWordData(null);
          setError('No matching word found for this line.');
        }
      } catch {
        setError('Error loading word details');
      } finally {
        setLoading(false);
      }
    };

    fetchWordDetails();
  }, [word, lineNumber]);

  const handleMoreDetailsPress = () => {
    if (wordData?.[0]?.lemma) {
      router.push(`/word-details/${wordData[0].lemma}`);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={screenGradient(isDarkMode)} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <GlassPanel isDark={isDarkMode} padding={24}>
            <ActivityIndicator size="small" color={spin} />
            <Text style={[ws.morphText, { marginTop: 12, textAlign: 'center' }]}>
              Loading lexicon…
            </Text>
          </GlassPanel>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <GlassPanel isDark={isDarkMode} style={{ marginTop: 8 }}>
        <View style={ws.errorBanner}>
          <Text style={ws.errorText}>{error}</Text>
        </View>
      </GlassPanel>
    );
  }

  if (!wordData) {
    return (
      <GlassPanel isDark={isDarkMode} style={{ marginTop: 8 }}>
        <View style={ws.errorBanner}>
          <Text style={ws.errorText}>Data unavailable</Text>
        </View>
      </GlassPanel>
    );
  }

  const lemma = wordData[0]?.lemma;
  const form = wordData[0]?.form;
  const caseInfo = wordData[1]?.case;
  const definitions = wordData[2]?.definitions;

  return (
    <GlassPanel isDark={isDarkMode} style={{ marginTop: 8 }}>
      <Text style={ws.eyebrow}>Lexicon preview</Text>
      <Text style={ws.heroLemma}>{lemma || '—'}</Text>

      <Text style={ws.formLabel}>Surface form</Text>
      <Text style={ws.formValue}>{form || '—'}</Text>

      <Text style={ws.sectionLabel}>Morphology</Text>
      <View style={ws.morphBlock}>
        {caseInfo ? (
          <Text style={ws.morphText}>
            {Object.entries(caseInfo)
              .filter(([, value]) => value && value !== '-')
              .map(([, value]) => `${String(value)}. `)
              .join('')}
          </Text>
        ) : (
          <Text style={ws.morphText}>No morphological tags for this token.</Text>
        )}
      </View>

      <Text style={ws.sectionLabel}>Definitions</Text>
      {Array.isArray(definitions) && definitions.length > 0 ? (
        definitions
          .slice(0, 3)
          .filter(
            (def: { short_def?: string }) =>
              def.short_def && def.short_def !== '[unavailable]'
          )
          .map((def: { short_def?: string }, idx: number) => (
            <View key={idx} style={ws.defRow}>
              <Text style={ws.defText}>{def.short_def}</Text>
            </View>
          ))
      ) : (
        <View style={ws.morphBlock}>
          <Text style={ws.morphText}>No short definitions in bundle.</Text>
        </View>
      )}

      <TouchableOpacity onPress={handleMoreDetailsPress} style={ws.cta} activeOpacity={0.88}>
        <MaterialIcons name="open-in-new" size={20} color="#FFFFFF" />
        <Text style={ws.ctaText}>Full lexicon entry</Text>
      </TouchableOpacity>
    </GlassPanel>
  );
}
