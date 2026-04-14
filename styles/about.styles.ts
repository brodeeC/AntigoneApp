import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 10,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    opacity: 0.92,
    maxWidth: 340,
  },
  heroAccentBar: {
    marginTop: 18,
    height: 4,
    width: 64,
    borderRadius: 2,
  },
  panelGap: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: -0.2,
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
    marginTop: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 3,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  dataDetails: {
    marginVertical: 8,
    paddingLeft: 4,
  },
  dataDetailText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  highlightWrap: {
    marginVertical: 14,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderRadius: 2,
  },
  highlightText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  contactContainer: {
    marginTop: 18,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  contactLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 28,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerCredit: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.85,
  },
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
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  downloadTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  darkDownloadButton: {
    backgroundColor: 'rgba(76, 201, 240, 0.12)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(76, 201, 240, 0.28)',
  },
  lightDownloadButton: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(67, 97, 238, 0.22)',
  },
  downloadIcon: {
    marginRight: 12,
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
  },
  downloadingButton: {
    opacity: 0.75,
  },
  licenseNote: {
    marginTop: 14,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
