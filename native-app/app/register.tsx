import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Text from '../components/Text';
import { useAuth } from '../context/auth';

type RegisterForm = {
  name: string;
  username: string;
  bio: string;
  password: string;
  confirmPassword: string;
};

const register = async (data: RegisterForm) => {
  // First register the user
  const registerResponse = await fetch('http://localhost:8080/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (registerResponse.status !== 201) {
    throw new Error('Registration failed');
  }

  // Then login to get the token
  const loginResponse = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
    }),
  });

  if (!loginResponse.ok) {
    throw new Error('Login after registration failed');
  }

  return loginResponse.json();
};

export default function Register() {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const password = watch('password');
  
  const registerMutation = useMutation(register, {
    onSuccess: async (data) => {
      await signIn(data.token, data.user);
      router.replace('/(home)');
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <Controller
        control={control}
        rules={{ required: 'Name is required' }}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            onChangeText={onChange}
            value={value}
            placeholder="Name"
            placeholderTextColor={colors.text + '80'}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      
      <Controller
        control={control}
        rules={{
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message: 'Username can only contain letters, numbers and underscores',
          },
        }}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
            placeholderTextColor={colors.text + '80'}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: {
            value: 160,
            message: 'Bio must be less than 160 characters',
          },
        }}
        name="bio"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.bioInput, { color: colors.text, borderColor: colors.border }]}
            onChangeText={onChange}
            value={value}
            placeholder="Bio (optional)"
            placeholderTextColor={colors.text + '80'}
            multiline
            numberOfLines={3}
            maxLength={160}
          />
        )}
      />
      {errors.bio && <Text style={styles.errorText}>{errors.bio.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            placeholderTextColor={colors.text + '80'}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match',
        }}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            onChangeText={onChange}
            value={value}
            placeholder="Confirm Password"
            placeholderTextColor={colors.text + '80'}
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>
          {registerMutation.isLoading ? 'Loading...' : 'Register'}
        </Text>
      </Pressable>

      {registerMutation.isError && (
        <Text style={styles.errorText}>Registration failed. Please try again.</Text>
      )}

      <Link href="/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
});
