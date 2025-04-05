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
  Image
} from 'react-native';

const { width } = Dimensions.get('window');

const App = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(width));

  // Mock data - replace with your DB connection
  useEffect(() => {
    // This would be your API call in a real app
    const mockStudents = [
      { id: '1', name: 'Adam Johnson', rollNumber: 'CS2201', department: 'Computer Science', email: 'adam.j@example.edu', accommodation: 'Hosteller', address: '123 College Dorm, Room 302', labName: 'AI Research Lab', photo: 'https://via.placeholder.com/150' },
      { id: '2', name: 'Beth Williams', rollNumber: 'CS2202', department: 'Computer Science', email: 'beth.w@example.edu', accommodation: 'Day Scholar', address: '456 University Avenue', labName: 'Network Security Lab', photo: 'https://via.placeholder.com/150' },
      { id: '3', name: 'Carlos Rodriguez', rollNumber: 'EE2203', department: 'Electrical Engineering', email: 'carlos.r@example.edu', accommodation: 'Hosteller', address: '123 College Dorm, Room 205', labName: 'Power Systems Lab', photo: 'https://via.placeholder.com/150' },
      { id: '4', name: 'Diana Chen', rollNumber: 'ME2204', department: 'Mechanical Engineering', email: 'diana.c@example.edu', accommodation: 'Day Scholar', address: '789 Engineering Blvd', labName: 'Robotics Lab', photo: 'https://via.placeholder.com/150' },
      { id: '5', name: 'Eli Thompson', rollNumber: 'CS2205', department: 'Computer Science', email: 'eli.t@example.edu', accommodation: 'Hosteller', address: '123 College Dorm, Room 410', labName: 'Data Science Lab', photo: 'https://via.placeholder.com/150' },
      { id: '6', name: 'Fatima Ahmed', rollNumber: 'CE2206', department: 'Civil Engineering', email: 'fatima.a@example.edu', accommodation: 'Day Scholar', address: '101 Structure Street', labName: 'Urban Planning Lab', photo: 'https://via.placeholder.com/150' },
      { id: '7', name: 'George Patel', rollNumber: 'BT2207', department: 'Biotechnology', email: 'george.p@example.edu', accommodation: 'Hosteller', address: '123 College Dorm, Room 115', labName: 'Genetics Lab', photo: 'https://via.placeholder.com/150' },
      { id: '8', name: 'Hannah Kim', rollNumber: 'CS2208', department: 'Computer Science', email: 'hannah.k@example.edu', accommodation: 'Day Scholar', address: '202 Programming Path', labName: 'Mobile Computing Lab', photo: 'https://via.placeholder.com/150' },
    ];
    
    // Sort alphabetically by name
    const sortedStudents = mockStudents.sort((a, b) => a.name.localeCompare(b.name));
    setStudents(sortedStudents);
    setFilteredStudents(sortedStudents);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
  const viewStudentDetails = (student) => {
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
          
          {filteredStudents.length > 0 ? (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.id}
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
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;