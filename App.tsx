import React from 'react';
 import { View, Text, StyleSheet } from 'react-native';

 const App = () => {
   return (
     <View style={styles.container}>
       <Text style={styles.title}>Welcome to My React Native App 🚀</Text>
       <Text style={styles.subtitle}>This is my customized homepage!</Text>
     </View>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#f0f0f0',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#333',
   },
   subtitle: {
     fontSize: 16,
     color: '#666',
     marginTop: 9,
   },
 });

 export default App;