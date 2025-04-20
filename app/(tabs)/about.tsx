import { View, Text, ScrollView, useColorScheme, Linking, TouchableOpacity, Alert, ActivityIndicator  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EnIcon from 'react-native-vector-icons/Entypo';
import styles from '../../frontend/styles/about.styles';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';

export default function AboutScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const dynamicTextColor = isDarkMode ? styles.darkText : styles.lightText;
  const dynamicSubtextColor = isDarkMode ? styles.darkSubtext : styles.lightSubtext;

  const [downloading, setDownloading] = useState<string | null>(null);

const downloadCSV = async (filename: string) => {
  try {
    setDownloading(filename);
    
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    const downloadUrl = `https://raw.githubusercontent.com/brodeeC/AntigoneApp/1aae980617e632797c15a47fbc5b2125848758de/backend/database/csv/${filename}`; 
    
    const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );
  
      const result = await downloadResumable.downloadAsync();
      
      if (!result) {
        throw new Error('Download failed - no result returned');
      }
  
      // Now TypeScript knows result is defined
      const { uri } = result;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'text/csv',
          dialogTitle: `Download ${filename}`,
          UTI: 'public.comma-separated-values-text'
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
    Linking.openURL(url).catch(err => console.error("Failed to open link:", err));
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0F0F1B', '#1A1A2E'] : ['#F8F9FA', '#FFFFFF']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* App Header */}
        <View style={styles.header}>
          <Text style={[styles.title, dynamicTextColor]}>About Antigone Reader</Text>
          <Text style={[styles.subtitle, dynamicSubtextColor]}>
            A modern approach to ancient tragedy
          </Text>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <EnIcon name="grid" size={24} color={isDarkMode ? "#4CC9F0" : "#4361EE"} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The App</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            Antigone Reader reimagines Sophocles' classic tragedy for the digital age. Designed for 
            students, scholars, and theater enthusiasts, this app provides:
          </Text>
          <View style={styles.featureList}>
            {[
              "Clean, distraction-free reading experience",
              "Advanced Greek text search capabilities",
              "Line-by-line reference system",
              "Dark/light mode for all lighting conditions"
            ].map((item, index) => (
              <View key={index} style={styles.featureItem}>
                <EnIcon 
                  name="check" 
                  size={16} 
                  color={isDarkMode ? "#4CC9F0" : "#4361EE"} 
                  style={styles.featureIcon}
                />
                <Text style={[styles.featureText, dynamicSubtextColor]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <EnIcon name="database" size={24} color={isDarkMode ? "#4CC9F0" : "#4361EE"} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The Text</Text>
        </View>
        <Text style={[styles.sectionText, dynamicSubtextColor]}>
            This app uses the 1924 Oxford Classical Text edition of Sophocles' Antigone, edited by 
            A.C. Pearson. The Greek text has been enhanced with:
        </Text>
        <View style={styles.dataDetails}>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Full morphological analysis of every word
            </Text>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Speaker attribution for every line
            </Text>
            <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Cross-referenced with Perseus Digital Library
            </Text>
        </View>

        <View style={styles.downloadSection}>
            <Text style={[styles.downloadTitle, dynamicTextColor]}>
            Download Datasets:
            </Text>
            
            {[
            { name: "lines.csv", label: "Full Text" },
            { name: "wordList.csv", label: "Morphology Data" },
            { name: "defList.csv", label: "Lexicographic Data" }
            ].map((file) => (
            <TouchableOpacity
                key={file.name}
                onPress={() => downloadCSV(file.name)}
                disabled={!!downloading}
                style={[
                styles.downloadButton, 
                isDarkMode ? styles.darkDownloadButton : styles.lightDownloadButton,
                downloading === file.name && styles.downloadingButton
                ]}
            >
                {downloading === file.name ? (
                <ActivityIndicator size="small" color={isDarkMode ? "#4CC9F0" : "#4361EE"} />
                ) : (
                <>
                    <EnIcon 
                    name="download" 
                    size={18} 
                    color={isDarkMode ? "#4CC9F0" : "#4361EE"} 
                    style={styles.downloadIcon}
                    />
                    <Text style={[styles.downloadText, dynamicTextColor]}>
                    {file.label}
                    </Text>
                </>
                )}
            </TouchableOpacity>
            ))}
        </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <EnIcon name="code" size={24} color={isDarkMode ? "#4CC9F0" : "#4361EE"} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The Developer</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            Created by a classics loving developer, this app combines a passion for ancient Greek 
            literature with modern technology. As a former student struggling with paper commentaries, 
            I wanted to create:
          </Text>
          <Text style={[styles.highlightText, { color: isDarkMode ? "#4CC9F0" : "#4361EE" }]}>
            "A tool that makes Antigone as accessible as checking social media."
          </Text>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            The project began as a way to learn React Native and grew into a full-fledged reading 
            environment. Special thanks to my professors Dr. Chiara Palladino (Greek) and Dr. Fahad Sultan (CS) 
            and the open-source community.
          </Text>
          
          <View style={styles.contactContainer}>
            <Text style={[styles.contactTitle, dynamicTextColor]}>Connect:</Text>
            <View style={styles.contactLinks}>

            <TouchableOpacity 
                onPress={() => openLink('https://www.linkedin.com/in/brodeeclontz')}
                style={styles.contactButton}
              >
                <EnIcon name="linkedin" size={20} color={isDarkMode ? "#E2E8F0" : "#1E293B"} />
                <Text style={[styles.contactText, dynamicTextColor]}>LinkedIn</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => openLink('https://github.com/brodeeC')}
                style={styles.contactButton}
              >
                <EnIcon name="github" size={20} color={isDarkMode ? "#E2E8F0" : "#1E293B"} />
                <Text style={[styles.contactText, dynamicTextColor]}>GitHub</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => openLink('mailto:brodeeclontz@gmail.com')}
                style={styles.contactButton}
              >
                <EnIcon name="mail" size={20} color={isDarkMode ? "#E2E8F0" : "#1E293B"} />
                <Text style={[styles.contactText, dynamicTextColor]}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, dynamicSubtextColor]}>
            Version 1.0 · Made with ♥ for Greek tragedy
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}