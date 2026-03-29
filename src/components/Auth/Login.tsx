import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Switch } from 'react-native';
import { authAPI } from '../services/authService';
import { secureStorage } from '../utils/secureStorage';

interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      
      // Store tokens securely
      if (formData.rememberMe) {
        await secureStorage.storeTokens(response.data.tokens);
        await secureStorage.storeUser(response.data.user);
      } else {
        // Store in memory only
        // This would be handled by your state management
      }
      
      Alert.alert(
        'Login Successful',
        'Welcome back!',
        [{ text: 'OK' }]
      );
      
      // Navigate to main app
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'MainApp' }],
      // });
      
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Login failed');
      
      // Handle specific security scenarios
      if (error.status === 429) {
        Alert.alert(
          'Too Many Attempts',
          'Please wait before trying again. Your account has been temporarily locked for security.',
          [{ text: 'OK' }]
        );
      } else if (error.status === 401) {
        Alert.alert(
          'Invalid Credentials',
          'Please check your username and password and try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof LoginData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    // navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username or Phone</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Enter username or phone number"
            value={formData.username}
            onChangeText={(value) => updateFormData('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, errors.password && styles.inputError]}
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.rememberMeContainer}>
            <Switch
              value={formData.rememberMe}
              onValueChange={(value) => updateFormData('rememberMe', value)}
              trackColor={{ false: '#ccc', true: '#007AFF' }}
              thumbColor={formData.rememberMe ? '#fff' : '#f4f3f4'}
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>
          
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>
            🔒 Your connection is secure and encrypted
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginRight: 10,
  },
  eyeButton: {
    padding: 10,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityNotice: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
