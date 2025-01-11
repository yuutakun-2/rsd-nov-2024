import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from 'react-query';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Text from '../components/Text';
import { useAuth } from '../context/auth';

type LoginForm = {
  username: string;
  password: string;
};

const login = async (data: LoginForm) => {
  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export default function Login() {
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  
  const loginMutation = useMutation(login, {
    onSuccess: async (data) => {
      await signIn(data.token, data.user);
      router.replace('/(home)');
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <Controller
        control={control}
        rules={{
          required: 'Username is required',
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
          required: 'Password is required',
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

      <Pressable 
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>
          {loginMutation.isLoading ? 'Loading...' : 'Login'}
        </Text>
      </Pressable>

      {loginMutation.isError && (
        <Text style={styles.errorText}>Login failed. Please try again.</Text>
      )}

      <Link href="/register" style={styles.link}>
        Don't have an account? Register
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
