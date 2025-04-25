import { View, Text, ScrollView, useColorScheme, Linking, TouchableOpacity, Alert, ActivityIndicator  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EnIcon from 'react-native-vector-icons/Entypo';
import styles from '../../styles/about.styles';
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
    const downloadUrl = `https://raw.githubusercontent.com/brodeeC/AntigoneApp/refs/heads/main/backend/database/csv/${filename}`; 
    
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
            students, scholars, and enthusiasts, this app provides:
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
          The text and data in this app comes from the following sources:
        </Text>
        <View style={styles.dataDetails}>
          {/* Scaife Viewer */}
          <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Greek text from the{' '}
            <Text 
              style={{color: isDarkMode ? '#4CC9F0' : '#4361EE'}} 
              onPress={() => Linking.openURL('https://scaife.perseus.org/')}
            >
              Scaife Viewer
            </Text>, accessed January 2025
          </Text>

          {/* Treebank */}
          <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Morphological analysis from the{' '}
            <Text 
              style={{color: isDarkMode ? '#4CC9F0' : '#4361EE'}}
              onPress={() => Linking.openURL('https://perseusdl.github.io/treebank_data/')}
            >
              Perseus Ancient Greek Dependency Treebank
            </Text>{' '}
            (v2.1, 2014), developed by Giuseppe G. A. Celano, Gregory Crane, Bridget Almas, and Francesco Mambrini
          </Text>

          {/* Perseus */}
          <Text style={[styles.dataDetailText, dynamicSubtextColor]}>
            • Definitions from the{' '}
            <Text 
              style={{color: isDarkMode ? '#4CC9F0' : '#4361EE'}}
              onPress={() => Linking.openURL('http://www.perseus.tufts.edu')}
            >
              Perseus Digital Library
            </Text>, accessed January 2025
          </Text>
        </View>

        <View style={styles.downloadSection}>
        <Text style={[styles.downloadTitle, dynamicTextColor]}>
          Download Processed Datasets:
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
            <View style={styles.section}>
              <Text style={[styles.sectionText, dynamicSubtextColor]}>
                All processed datasets are licensed under{' '}
                <Text 
                  style={{color: isDarkMode ? '#4CC9F0' : '#4361EE'}}
                  onPress={() => Linking.openURL('https://creativecommons.org/licenses/by-sa/4.0/')}
                >
                  CC-BY-SA 4.0
                </Text>{' '}
                with attribution requirements.
              </Text>
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <EnIcon name="code" size={24} color={isDarkMode ? "#4CC9F0" : "#4361EE"} />
            <Text style={[styles.sectionTitle, dynamicTextColor]}>The Developer</Text>
          </View>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            As a developer passionate about classics, I built this app to bridge ancient 
            Greek literature and modern tech. What started as a simple idea became:
          </Text>
          <Text style={[styles.highlightText, { color: isDarkMode ? "#4CC9F0" : "#4361EE" }]}>
            "A tool that makes reading Antigone as accessible as checking social media."
          </Text>
          <Text style={[styles.sectionText, dynamicSubtextColor]}>
            I never expected my semester project—a mobile adaptation of Antigone—to become such a rewarding 
            challenge. Translating ancient drama into interactive experiences taught me as much about coding 
            as it did about Greek tragedy. Heartfelt thanks to my mentors Dr. Palladino and Dr. Sultan, 
            to the global open-source community for their invisible mentorship, and to Calina Floyd for designing the icon!
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