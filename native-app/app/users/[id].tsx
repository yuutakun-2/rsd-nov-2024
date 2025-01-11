import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { useQuery } from 'react-query';
import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, router } from 'expo-router';
import Text from '../../components/Text';
import { useAuth } from '../../context/auth';
import FollowButton from '../../components/FollowButton';

interface User {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  followerCount: number;
  followingCount: number;
  created: string;
  isFollowing: boolean;
}

async function fetchUserProfile(id: string, token: string | null): Promise<User | null> {
  try {
    const response = await fetch(`http://localhost:8080/users/${id}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    return null;
  }
}

export default function Profile() {
  const { token, user: currentUser } = useAuth();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  
  const { data: user, isLoading } = useQuery<User | null>(
    ['user', id],
    () => fetchUserProfile(id as string, token),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileInfo}>
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.username, { color: colors.text, opacity: 0.6 }]}>@{user.username}</Text>
        {user.bio && (
          <Text style={[styles.bio, { color: colors.text }]}>{user.bio}</Text>
        )}
        
        {!token && (
          <View style={styles.authButtons}>
            <Pressable 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Login to Follow</Text>
            </Pressable>
          </View>
        )}
        
        {token && currentUser?.id !== user.id && (
          <View style={styles.followButtonContainer}>
            <FollowButton userId={user.id} isFollowing={user.isFollowing} />
          </View>
        )}

        <View style={[styles.stats, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/users/list",
                params: {
                  id: user.id,
                  type: "followers",
                  title: "Followers"
                }
              })
            }
            style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {user.followerCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + "99" }]}>
              Followers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/users/list",
                params: {
                  id: user.id,
                  type: "following",
                  title: "Following"
                }
              })
            }
            style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {user.followingCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + "99" }]}>
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  profileInfo: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  followButtonContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  authButtons: {
    marginVertical: 16,
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
