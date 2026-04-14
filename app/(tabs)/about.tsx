import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  Linking,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenGradient, accentFor } from '@/lib/appTheme';
import { GlassPanel } from '@/components/ui/GlassPanel';
import EnIcon from 'react-native-vector-icons/Entypo';
import styles from '../../styles/about.styles';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { useState } from 'react';

export default function AboutScreen() {
  const appVersion = Constants.expoConfig?.version ?? '2.0.0';
  const insets = useSafeAreaInsets();

  const isDarkMode = useColorScheme() === 'dark';
  const accent = accentFor(isDarkMode);
  const dynamicTextColor = isDarkMode ? styles.darkText : styles.lightText;
  const dynamicSubtextColor = isDarkMode ? styles.darkSubtext : styles.lightSubtext;

  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadCSV = async (filename: string) => {
    try {
      setDownloading(filename);

      const downloadUrl = `https://raw.githubusercontent.com/brodeeC/AntigoneApp/refs/heads/main/backend/database/csv/${filename}`;
      const destination = new File(Paths.document, filename);
      const downloaded = await File.downloadFileAsync(downloadUrl, destination, {
        idempotent: true,
      });
      const { uri } = downloaded;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: `Download ${filename}`,
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Download complete', `Saved to: ${uri}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
      Alert.alert('Download failed', errorMessage);
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open link:', err));
  };

  const linkColor = accent;
  const downloadBorder = isDarkMode ? 'rgba(76, 201, 240, 0.28)' : 'rgba(67, 97, 238, 0.22)';
  const chipBg = isDarkMode ? 'rgba(76, 201, 240, 0.1)' : 'rgba(67, 97, 238, 0.08)';
  const dividerColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  return (
    <LinearGradient colors={screenGradient(isDarkMode)} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: accent }]}>About</Text>
          <Text style={[styles.heroTitle, dynamicTextColor]}>Antigone Reader</Text>
          <Text style={[styles.heroSubtitle, dynamicSubtextColor]}>
            A modern approach to ancient tragedy
          </Text>
          <LinearGradient
            colors={isDarkMode ? ['#4CC9F0', '#4361EE'] : ['#4361EE', '#5B8DEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroAccentBar}
          />
        </View>

        <GlassPanel isDark={isDarkMode} padding={18} style={styles.panelGap}>
          <View style={styles.sectionHeader}>
            <EnIcon name="grid" size={22} color={accent} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The app</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            Antigone Reader reimagines Sophocles{"'"} classic tragedy for the digital age. Designed for
            students, scholars, and enthusiasts, this app provides:
          </Text>
          <View style={styles.featureList}>
            {[
              'Clean, distraction-free reading experience',
              'Advanced Greek text search capabilities',
              'Line-by-line reference system',
              'Dark/light mode for all lighting conditions',
            ].map((item, index) => (
              <View key={index} style={styles.featureItem}>
                <EnIcon name="check" size={16} color={accent} style={styles.featureIcon} />
                <Text style={[styles.featureText, dynamicSubtextColor]}>{item}</Text>
              </View>
            ))}
          </View>
        </GlassPanel>

        <GlassPanel isDark={isDarkMode} padding={18} style={styles.panelGap}>
          <View style={styles.sectionHeader}>
            <EnIcon name="database" size={22} color={accent} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The text</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            The text and data in this app comes from the following sources:
          </Text>
          <View style={styles.dataDetails}>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
              • Greek text from the{' '}
              <Text style={{ color: linkColor }} onPress={() => Linking.openURL('https://scaife.perseus.org/')}>
                Scaife Viewer
              </Text>
              , accessed January 2025
            </Text>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
              • Morphological analysis from the{' '}
              <Text
                style={{ color: linkColor }}
                onPress={() => Linking.openURL('https://perseusdl.github.io/treebank_data/')}
              >
                Perseus Ancient Greek Dependency Treebank
              </Text>{' '}
              (v2.1, 2014), developed by Giuseppe G. A. Celano, Gregory Crane, Bridget Almas, and Francesco
              Mambrini
            </Text>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
              • Definitions from the{' '}
              <Text style={{ color: linkColor }} onPress={() => Linking.openURL('http://www.perseus.tufts.edu')}>
                Perseus Digital Library
              </Text>
              , accessed January 2025
            </Text>
          </View>

          <View style={[styles.downloadSection, { borderTopColor: dividerColor }]}>
            <Text style={[styles.downloadTitle, dynamicTextColor]}>Download processed datasets</Text>
            {[
              { name: 'lines.csv', label: 'Full text' },
              { name: 'wordList.csv', label: 'Morphology data' },
              { name: 'defList.csv', label: 'Lexicographic data' },
            ].map((file) => (
              <TouchableOpacity
                key={file.name}
                onPress={() => downloadCSV(file.name)}
                disabled={!!downloading}
                style={[
                  styles.downloadButton,
                  isDarkMode ? styles.darkDownloadButton : styles.lightDownloadButton,
                  downloading === file.name && styles.downloadingButton,
                ]}
              >
                {downloading === file.name ? (
                  <ActivityIndicator size="small" color={accent} />
                ) : (
                  <>
                    <EnIcon name="download" size={18} color={accent} style={styles.downloadIcon} />
                    <Text style={[styles.downloadText, dynamicTextColor]}>{file.label}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
            <Text style={[styles.sectionText, styles.licenseNote, dynamicSubtextColor]}>
              All processed datasets are licensed under{' '}
              <Text
                style={{ color: linkColor }}
                onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/4.0/')}
              >
                CC-BY-SA 4.0
              </Text>{' '}
              with attribution requirements.
            </Text>
          </View>
        </GlassPanel>

        <GlassPanel isDark={isDarkMode} padding={18} style={styles.panelGap}>
          <View style={styles.sectionHeader}>
            <EnIcon name="code" size={22} color={accent} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The developer</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            As a developer passionate about classics, I built this app to bridge ancient Greek literature and
            modern tech. What started as a simple idea became:
          </Text>
          <View style={[styles.highlightWrap, { borderLeftColor: accent }]}>
            <Text style={[styles.highlightText, dynamicSubtextColor]}>
              {'\u201c'}A tool that makes reading Antigone as accessible as checking social media.{'\u201d'}
            </Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            I never expected my semester project, a mobile adaptation of Antigone, to be such a rewarding
            challenge. Translating ancient tragedy into interactive experiences taught me as much about coding as
            it did Greek tragedy. Heartfelt thanks to my mentors Dr. Palladino and Dr. Sultan, and to Calina Floyd
            for designing the icon!
          </Text>

          <View style={styles.contactContainer}>
            <Text style={[styles.contactTitle, dynamicTextColor]}>Connect</Text>
            <View style={styles.contactLinks}>
              <TouchableOpacity
                onPress={() => openLink('https://www.linkedin.com/in/brodeeclontz')}
                style={[styles.contactChip, { backgroundColor: chipBg, borderColor: downloadBorder }]}
                activeOpacity={0.85}
              >
                <EnIcon name="linkedin" size={18} color={accent} />
                <Text style={[styles.contactText, dynamicTextColor]}>LinkedIn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink('https://github.com/brodeeC')}
                style={[styles.contactChip, { backgroundColor: chipBg, borderColor: downloadBorder }]}
                activeOpacity={0.85}
              >
                <EnIcon name="github" size={18} color={accent} />
                <Text style={[styles.contactText, dynamicTextColor]}>GitHub</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openLink('mailto:brodeeclontz@gmail.com')}
                style={[styles.contactChip, { backgroundColor: chipBg, borderColor: downloadBorder }]}
                activeOpacity={0.85}
              >
                <EnIcon name="mail" size={18} color={accent} />
                <Text style={[styles.contactText, dynamicTextColor]}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassPanel>

        <View style={styles.footer}>
          <Text style={[styles.footerText, dynamicSubtextColor]}>
            Version {appVersion} · Made with ♥ for Greek tragedy
          </Text>
          <Text style={[styles.footerCredit, dynamicSubtextColor]}>
            Additional development assistance: Cursor (AI-assisted tooling)
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
