import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15, // Space between buttons
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#8A2BE2', // ✨ Vivid purple color
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5, // Shadow for Android
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  lightBackground: {
    backgroundColor: '#F9F9F9',
  },
  darkBackground: {
    backgroundColor: '#1C1C1E', // Darker shade for dark mode
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#FFF',
  },
});
