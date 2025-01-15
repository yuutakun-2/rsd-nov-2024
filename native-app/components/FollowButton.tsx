import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import Text from './Text';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../context/auth';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}

async function followUser(userId: number, token: string) {
  const res = await fetch(`http://localhost:8080/users/${userId}/follow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to follow user');
  return res.json();
}

async function unfollowUser(userId: number, token: string) {
  const res = await fetch(`http://localhost:8080/users/${userId}/follow`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to unfollow user');
  return res.json();
}

export default function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const { colors } = useTheme();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const follow = useMutation(
    () => followUser(userId, token!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', userId.toString()]);
        queryClient.invalidateQueries(['users']); // Invalidate search results
      },
    }
  );

  const unfollow = useMutation(
    () => unfollowUser(userId, token!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', userId.toString()]);
        queryClient.invalidateQueries(['users']); // Invalidate search results
      },
    }
  );

  const isLoading = follow.isLoading || unfollow.isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFollowing ? colors.background : colors.primary,
          borderColor: colors.primary,
        },
      ]}
      onPress={() => {
        if (isFollowing) {
          unfollow.mutate();
        } else {
          follow.mutate();
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isFollowing ? colors.primary : colors.background} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: isFollowing ? colors.primary : colors.background },
          ]}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
