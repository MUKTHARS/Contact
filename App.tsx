import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  useColorScheme,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';

const { width } = Dimensions.get('window');

// Improved API configuration with platform-specific URLs
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // For Android Emulator
    return 'http://10.0.2.2:5000/api';
  } else if (Platform.OS === 'ios') {
    // For iOS Simulator
    return 'http://localhost:5000/api';
  } else {
    // For physical devices, use your computer's local network IP address
    // Replace 192.168.1.X with your actual IP address
    return 'http://192.168.1.X:5000/api';
  }
};

const API_BASE_URL = getApiUrl();

// Fetch with timeout utility function
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const App = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(width));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from API
  useEffect(() => {
    fetchStudents();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Improved function to fetch students from API with retry logic
  const fetchStudents = async (retryCount = 0) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching from:', `${API_BASE_URL}/students`);

      const response = await fetchWithTimeout(`${API_BASE_URL}/students`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data received:', !!result);

      if (result.status === 'success') {
        const sortedStudents = result.data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
      } else {
        setError('Failed to load students: ' + (result.message || 'Unknown error'));
        Alert.alert('Error', 'Failed to load student data: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('API Error:', error.message);

      if (error.name === 'AbortError') {
        setError('Request timed out. Server might be slow or unreachable.');
        Alert.alert('Timeout', 'Request timed out. Please check your server is running correctly.');
      } else if (retryCount < 2) {
        // Retry up to 2 times with exponential backoff
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        setTimeout(() => {
          fetchStudents(retryCount + 1);
        }, 1000 * Math.pow(2, retryCount)); // 1s, 2s, 4s backoff
        return;
      } else {
        setError(`Network error: ${error.message}. Check server connection and API URL.`);
        Alert.alert(
          'Network Error',
          `Failed to connect to the server. Please verify:

1. Node.js server is running on port 5000
2. Database connection is working
3. API URL is correct (${API_BASE_URL})
4. No firewall blocking connections`,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single student by ID (with improved error handling)
  const fetchStudentById = async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/students/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        return result.data;
      } else {
        Alert.alert('Error', 'Failed to load student details');
        return null;
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Network Error', 'Failed to connect to the server');
      return null;
    }
  };

  // Search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(text.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Toggle to student details view with animation
  const viewStudentDetails = async (student) => {
    setSelectedStudent(student);

    // Reset and trigger slide-in animation
    slideAnim.setValue(width);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Back to student list
  const goBackToList = () => {
    // Slide-out animation
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSelectedStudent(null);
    });
  };

  // Theme-based colors - enhanced production palette
  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
    textColor: isDarkMode ? '#ffffff' : '#333333',
    cardBackground: isDarkMode ? '#1e1e1e' : '#ffffff',
    searchBarBackground: isDarkMode ? '#333333' : '#f0f0f0',
    borderColor: isDarkMode ? '#444444' : '#eeeeee',
    subtitleColor: isDarkMode ? '#aaaaaa' : '#666666',
    accentColor: isDarkMode ? '#5d8ef7' : '#3b78e7',
    accentGradientStart: isDarkMode ? '#5d8ef7' : '#4285f4',
    accentGradientEnd: isDarkMode ? '#3874dd' : '#2c65d1',
    shadowColor: isDarkMode ? '#000000' : '#aaaaaa',
    cardShadow: isDarkMode ?
      'rgba(0, 0, 0, 0.3)' :
      'rgba(0, 0, 0, 0.1)',
    statusTagBackground: isDarkMode ? '#383838' : '#f0f0f0',
    statusTagText: isDarkMode ? '#ffffff' : '#333333',
    headerBg: isDarkMode ? '#1e1e1e' : '#ffffff',
  };

  // Simple icon component to avoid dependency issues
  const Icon = ({ name, size, color }) => {
    // Map icon name to a simple text representation
    let iconSymbol;

    switch(name) {
      case 'search':
        iconSymbol = '';
        break;
      case 'arrow-back':
        iconSymbol = ' く';
        break;
        case 'information-circle-outline':
          iconSymbol = 'ⓘ';
          return (
            <Text style={{
              fontSize: size * 0.9,
              color: color,
              lineHeight: size,
              marginRight: 5,
              fontWeight: 'bold'
            }}>
              {iconSymbol}
            </Text>
          );
          break;
      case 'call':
        iconSymbol = '📞';
        break;
      case 'mail':
        iconSymbol = '✉️';
        break;
      case 'location':
        iconSymbol = '📍';
        break;
      case 'school':
        iconSymbol = '🎓';
        break;
      case 'home':
        iconSymbol = '🏠';
        break;
      case 'flask':
        iconSymbol = '🧪';
        break;
      case 'refresh':
        iconSymbol = '⟳';
        break;
      default:
        iconSymbol = '•';
    }

    return (
      <Text style={{ fontSize: size * 0.9, color: color, lineHeight: size, marginRight: 5 }}>
        {iconSymbol}
      </Text>
    );
  };

  // Header Component
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
      <Text style={[styles.headerTitle, { color: theme.textColor }]}>Student Contacts</Text>
      <View style={styles.headerBadge}>
        <Text style={styles.headerBadgeText}>{students.length}</Text>
      </View>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => fetchStudents()}
        disabled={loading}
      >
        <Icon name="refresh" size={42} color={loading ? theme.subtitleColor : theme.accentColor} />
      </TouchableOpacity>
    </View>
  );

  // Student List Item Component with enhanced design
  const StudentListItem = ({ student, index }) => {
    // Create staggered animation for list items
    const itemFadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50, // Stagger effect
        useNativeDriver: true,
      }).start();
    }, []);

    // Department abbreviation
    const deptInitial = student.department.split(' ')[0][0] +
                        (student.department.split(' ')[1] ? student.department.split(' ')[1][0] : '');

    return (
      <Animated.View style={{ opacity: itemFadeAnim, transform: [{ translateY: itemFadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0]
      })}]}}>
        <TouchableOpacity
          style={[styles.studentCard, {
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
            shadowColor: theme.cardShadow,
          }]}
          onPress={() => viewStudentDetails(student)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarBg, {backgroundColor: theme.accentColor}]}>
              <Text style={styles.avatarText}>{student.name[0]}</Text>
            </View>
          </View>

          <View style={styles.studentInfo}>
            <Text style={[styles.studentName, { color: theme.textColor }]}>{student.name}</Text>
            <View style={styles.badgeRow}>
              <Text style={[styles.rollNumber, { color: theme.subtitleColor }]}>{student.rollNumber}</Text>
              <View style={[styles.deptBadge, {backgroundColor: theme.statusTagBackground}]}>
                <Text style={[styles.deptBadgeText, {color: theme.accentColor}]}>{deptInitial}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => viewStudentDetails(student)}
          >

            <Icon name="information-circle-outline" size={22} color={theme.accentColor} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Student Detail View Component with enhanced design
  const StudentDetailView = ({ student }) => {
    const accommodationColor = student.accommodation === 'Hosteller' ? '#ff9500' : '#34c759';

    return (
      <Animated.View
        style={[
          styles.detailContainer,
          {
            backgroundColor: theme.backgroundColor,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View style={[styles.profileHeader, { backgroundColor: theme.headerBg }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToList}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.profileTitle, { color: theme.textColor }]}>Student Profile</Text>
        </View>

        <View style={styles.profileScrollView}>
          <View style={[styles.profileHero, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.photoContainer}>
              <View style={[styles.photoPlaceholder, { backgroundColor: theme.accentColor }]}>
                <Text style={styles.photoInitial}>{student.name[0]}</Text>
              </View>
              <Text style={[styles.heroName, { color: theme.textColor }]}>{student.name}</Text>
              <View style={[styles.accommodationBadge, { backgroundColor: accommodationColor + '20' }]}>
                <Text style={[styles.accommodationText, { color: accommodationColor }]}>
                  {student.accommodation}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.detailSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Student Information</Text>

            <View style={styles.detailRow}>
              <Icon name="school" size={20} color={theme.accentColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.subtitleColor }]}>Roll Number</Text>
                <Text style={[styles.detailValue, { color: theme.textColor }]}>{student.rollNumber}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Icon name="school" size={20} color={theme.accentColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.subtitleColor }]}>Department</Text>
                <Text style={[styles.detailValue, { color: theme.textColor }]}>{student.department}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Icon name="flask" size={20} color={theme.accentColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.subtitleColor }]}>Lab</Text>
                <Text style={[styles.detailValue, { color: theme.textColor }]}>{student.labName}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.detailSection, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Contact Information</Text>

            <View style={styles.detailRow}>
              <Icon name="mail" size={20} color={theme.accentColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.subtitleColor }]}>Email</Text>
                <Text style={[styles.detailValue, { color: theme.textColor }]}>{student.email}</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Icon name="home" size={20} color={theme.accentColor} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.subtitleColor }]}>Address</Text>
                <Text style={[styles.detailValue, { color: theme.textColor }]}>{student.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.subtitleColor }]}>
              Student ID: {student.id}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  // Enhanced Loading indicator component
  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.accentColor} />
      <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading students...</Text>
    </View>
  );

  // Enhanced Error component with more details
  const ErrorView = () => (
    <View style={styles.errorContainer}>
      <Text style={[styles.errorTitle, { color: theme.textColor }]}>Connection Error</Text>
      <Text style={[styles.errorText, { color: theme.subtitleColor }]}>{error}</Text>
      <View style={styles.errorTips}>
        <Text style={[styles.errorTipTitle, { color: theme.textColor }]}>Troubleshooting tips:</Text>
        <Text style={[styles.errorTip, { color: theme.subtitleColor }]}>• Check if Node.js server is running on port 5000</Text>
        <Text style={[styles.errorTip, { color: theme.subtitleColor }]}>• Verify XAMPP Apache and MySQL are running</Text>
        <Text style={[styles.errorTip, { color: theme.subtitleColor }]}>• Check database connection settings</Text>
        <Text style={[styles.errorTip, { color: theme.subtitleColor }]}>• Ensure the API URL is correct: {API_BASE_URL}</Text>
      </View>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: theme.accentColor }]}
        onPress={() => fetchStudents()}
      >
        <Text style={styles.retryButtonText}>Retry Connection</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.backgroundColor}
      />

      {!selectedStudent ? (
        // Student List View
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.backgroundColor,
              opacity: fadeAnim
            }
          ]}
        >
          <Header />

          <View style={[styles.searchBarContainer, { backgroundColor: theme.searchBarBackground }]}>
            <Icon name="search" size={20} color={theme.subtitleColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search by name or roll number..."
              placeholderTextColor={theme.subtitleColor}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Text style={{ color: theme.subtitleColor, fontSize: 16, paddingHorizontal: 8 }}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <LoadingView />
          ) : error ? (
            <ErrorView />
          ) : filteredStudents.length > 0 ? (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => <StudentListItem student={item} index={index} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>
                No students found matching "{searchQuery}"
              </Text>
            </View>
          )}
        </Animated.View>
      ) : (
        // Student Detail View
        <StudentDetailView student={selectedStudent} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerBadge: {
    backgroundColor: '#3b78e7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  headerBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  refreshButton: {
    padding: 8,
    marginLeft: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    height: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rollNumber: {
    fontSize: 14,
    marginRight: 8,
  },
  deptBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoButton: {
    padding: 8,
  },
  detailContainer: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 6,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  profileScrollView: {
    flex: 1,
  },
  profileHero: {
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  heroName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  accommodationBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  accommodationText: {
    fontWeight: '600',
    fontSize: 13,
  },
  detailSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  detailContent: {
    flex: 1,
    marginLeft: 10,
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorTips: {
    alignSelf: 'stretch',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  errorTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorTip: {
    fontSize: 14,
    marginBottom: 6,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default App;