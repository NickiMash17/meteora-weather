import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Target,
  TrendingUp,
  Droplet,
  Gauge,
  Compass,
  Activity
} from 'lucide-react';

interface WeatherGamificationProps {
  weather: any;
  forecast: any;
  userLocation: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'weather' | 'activity' | 'exploration' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  unlockedAt?: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  maxProgress: number;
  reward: number;
  expiresAt: Date;
  completed: boolean;
}

interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
  streakDays: number;
  totalLocations: number;
  weatherConditionsSeen: number;
}

const WeatherGamification: React.FC<WeatherGamificationProps> = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'stats'>('achievements');
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // User stats (mock data - in real app, this would come from backend)
  const userStats: UserStats = useMemo(() => ({
    level: 15,
    experience: 2750,
    experienceToNext: 3000,
    totalPoints: 12500,
    achievementsUnlocked: 23,
    challengesCompleted: 45,
    streakDays: 7,
    totalLocations: 8,
    weatherConditionsSeen: 12
  }), []);

  // Achievements (mock data - in real app, this would be dynamic)
  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'first-location',
      title: 'Explorer',
      description: 'Check weather in your first location',
      icon: <Compass className="w-5 h-5" />,
      category: 'exploration',
      rarity: 'common',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      points: 10,
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: 'weather-master',
      title: 'Weather Master',
      description: 'Experience 10 different weather conditions',
      icon: <Gauge className="w-5 h-5" />,
      category: 'weather',
      rarity: 'rare',
      unlocked: false,
      progress: 8,
      maxProgress: 10,
      points: 50
    },
    {
      id: 'streak-week',
      title: 'Week Warrior',
      description: 'Check weather for 7 consecutive days',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'activity',
      rarity: 'epic',
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      points: 100,
      unlockedAt: new Date('2024-01-20')
    },
    {
      id: 'temperature-extreme',
      title: 'Temperature Explorer',
      description: 'Experience temperatures below 0°C and above 30°C',
      icon: <Droplet className="w-5 h-5" />,
      category: 'weather',
      rarity: 'legendary',
      unlocked: false,
      progress: 1,
      maxProgress: 2,
      points: 200
    }
  ], []);

  // Challenges (mock data - in real app, this would be dynamic)
  const challenges: Challenge[] = useMemo(() => [
    {
      id: 'daily-check',
      title: 'Daily Weather Check',
      description: 'Check the weather today',
      icon: <Target className="w-5 h-5" />,
      category: 'daily',
      difficulty: 'easy',
      progress: 1,
      maxProgress: 1,
      reward: 5,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: true
    },
    {
      id: 'weekly-forecast',
      title: 'Forecast Follower',
      description: 'Check 5-day forecast 3 times this week',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'weekly',
      difficulty: 'medium',
      progress: 2,
      maxProgress: 3,
      reward: 25,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: 'location-explorer',
      title: 'Location Explorer',
      description: 'Check weather in 3 different cities',
      icon: <Compass className="w-5 h-5" />,
      category: 'special',
      difficulty: 'hard',
      progress: 1,
      maxProgress: 3,
      reward: 50,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      completed: false
    }
  ], []);

  const filteredAchievements = showUnlockedOnly 
    ? achievements.filter(a => a.unlocked)
    : achievements;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressPercentage = (progress: number, max: number) => {
    return Math.min((progress / max) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Weather Gamification
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Earn achievements and complete challenges while exploring weather
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center">
          <div className="text-2xl font-bold">{userStats.level}</div>
          <div className="text-sm opacity-90">Level</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center">
          <div className="text-2xl font-bold">{userStats.totalPoints}</div>
          <div className="text-sm opacity-90">Points</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-center">
          <div className="text-2xl font-bold">{userStats.streakDays}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white text-center">
          <div className="text-2xl font-bold">{userStats.achievementsUnlocked}</div>
          <div className="text-sm opacity-90">Achievements</div>
        </div>
      </div>

      {/* Experience Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Experience</span>
          <span>{userStats.experience} / {userStats.experienceToNext}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userStats.experience / userStats.experienceToNext) * 100}%` }}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'stats', label: 'Stats', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Filter */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Achievements ({filteredAchievements.length})
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded"
                />
                Show unlocked only
              </label>
            </div>

            {/* Achievements Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedAchievement(
                    selectedAchievement === achievement.id ? null : achievement.id
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-green-100 dark:bg-green-800/30'
                        : 'bg-gray-100 dark:bg-gray-700/30'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {achievement.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              achievement.unlocked
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${getProgressPercentage(achievement.progress, achievement.maxProgress)}%` }}
                          />
                        </div>
                      </div>

                      {/* Unlock Details */}
                      {selectedAchievement === achievement.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Points: {achievement.points}</span>
                            {achievement.unlockedAt && (
                              <span>Unlocked: {achievement.unlockedAt.toLocaleDateString()}</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Challenges ({challenges.length})
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  className={`p-4 rounded-lg border ${
                    challenge.completed
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      challenge.completed
                        ? 'bg-green-100 dark:bg-green-800/30'
                        : 'bg-blue-100 dark:bg-blue-800/30'
                    }`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {challenge.title}
                        </h4>
                        <span className={`text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {challenge.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Progress</span>
                          <span>{challenge.progress} / {challenge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              challenge.completed
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${getProgressPercentage(challenge.progress, challenge.maxProgress)}%` }}
                          />
                        </div>
                      </div>

                      {/* Challenge Details */}
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Reward: {challenge.reward} points</span>
                        <span>Expires: {challenge.expiresAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detailed Statistics
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Activity Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Current Streak</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.streakDays} days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Total Locations</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalLocations}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Weather Conditions Seen</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.weatherConditionsSeen}</span>
                  </div>
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievement Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Achievements Unlocked</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.achievementsUnlocked}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Challenges Completed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.challengesCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Total Points Earned</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{userStats.totalPoints}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherGamification; 