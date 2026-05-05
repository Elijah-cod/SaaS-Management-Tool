type UserRecord = {
  userId: number;
  email: string;
  name: string;
  role: string;
  profilePictureUrl: string | null;
  teamId: number | null;
};

export const serializeUser = (user: UserRecord) => ({
  id: `u${user.userId}`,
  email: user.email,
  name: user.name,
  role: user.role,
  avatarUrl: user.profilePictureUrl,
  teamId: user.teamId,
});
