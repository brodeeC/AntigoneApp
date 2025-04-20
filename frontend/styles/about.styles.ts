import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
    top: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  italicText: {
    fontStyle: 'italic',
  },
  featureList: {
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  dataDetails: {
    marginVertical: 12,
    paddingLeft: 12,
  },
  dataDetailText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginVertical: 16,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  contactContainer: {
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 15,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
  },
  // Color modes
  darkText: {
    color: '#E2E8F0',
  },
  lightText: {
    color: '#1E293B',
  },
  darkSubtext: {
    color: '#94A3B8',
  },
  lightSubtext: {
    color: '#64748B',
  },
  downloadSection: {
    marginTop: 20,
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkDownloadButton: {
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.3)',
  },
  lightDownloadButton: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(67, 97, 238, 0.3)',
  },
  downloadIcon: {
    marginRight: 12,
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '500',
  },
  downloadingButton: {
    opacity: 0.8,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
  },
});