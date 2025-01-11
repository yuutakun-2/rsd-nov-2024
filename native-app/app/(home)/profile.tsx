import { View, StyleSheet, Pressable } from "react-native";
import { useQuery } from 'react-query';
import { useTheme } from "@react-navigation/native";
import { router } from 'expo-router';
import Text from "../../components/Text";
import { useAuth } from '../../context/auth';
import React from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  created: string;
}

async function fetchUserProfile(token: string): Promise<User> {
  const response = await fetch('http://localhost:8080/verify', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

export default function Profile() {
  const { token, signOut } = useAuth();
  const { colors } = useTheme();
  
  const { data: user, isLoading } = useQuery<User | null>(
    ['user', token],
    () => token ? fetchUserProfile(token) : Promise.resolve(null),
    {
      enabled: !!token,
    }
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome!</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Please login or register to continue</Text>
        
        <Pressable 
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push('/register')}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Register</Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.username, { color: colors.text }]}>@{user.username}</Text>
        {user.bio && (
          <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>
        )}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{user.followersCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{user.followingCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Following</Text>
          </View>
        </View>
      </View>
      
      <Pressable style={[styles.button, styles.logoutButton]} onPress={signOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.6,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    marginBottom: 15,
    opacity: 0.7,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
  }
});
