import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Umbrella,
  Car,
  Plane,
  TreePine,
  Coffee,
  Heart,
  Zap,
  Sparkles,
  Award,
  Medal,
  Crown,
  Droplet,
  Eye,
  Gauge,
  Compass,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BarChart3,
  Target as TargetIcon,
  Users,
  Globe,
  Sunrise,
  Sunset
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  category: 'weather' | 'exploration' | 'consistency' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  conditions: {
    type: 'temperature' | 'condition' | 'location' | 'streak' | 'time' | 'custom';
    value: any;
    operator: 'equals' | 'greater' | 'less' | 'contains' | 'between';
  }[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  deadline?: Date;
  rewards: {
    points: number;
    badges?: string[];
    unlocks?: string[];
  };
}

interface UserStats {
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNext: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  challengesCompleted: number;
  totalChallenges: number;
  streakDays: number;
  longestStreak: number;
  locationsVisited: number;
  weatherConditionsSeen: number;
  lastCheckIn: Date;
}

const WeatherGamification: React.FC<WeatherGamificationProps> = ({ 
  weather, 
  forecast, 
  userLocation 
}) => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('meteora-user-stats');
    return saved ? JSON.parse(saved) : {
      totalPoints: 0,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      achievementsUnlocked: 0,
      totalAchievements: 0,
      challengesCompleted: 0,
      totalChallenges: 0,
      streakDays: 0,
      longestStreak: 0,
      locationsVisited: 1,
      weatherConditionsSeen: 1,
      lastCheckIn: new Date().toISOString()
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');

  // Initialize achievements
  useEffect(() => {
    const baseAchievements: Achievement[] = [
      {
        id: 'first-check',
        title: 'Weather Watcher',
        description: 'Check weather for the first time',
        icon: <Eye className="w-5 h-5" />,
        category: 'exploration',
        rarity: 'common',
        points: 10,
        isUnlocked: false,
        conditions: [{ type: 'custom', value: 'first_check', operator: 'equals' }]
      },
      {
        id: 'temperature-extreme',
        title: 'Temperature Warrior',
        description: 'Experience extreme temperatures (above 35°C or below -10°C)',
        icon: <Thermometer className="w-5 h-5" />,
        category: 'weather',
        rarity: 'rare',
        points: 50,
        isUnlocked: false,
        conditions: [
          { type: 'temperature', value: 35, operator: 'greater' },
          { type: 'temperature', value: -10, operator: 'less' }
        ]
      },
      {
        id: 'rain-master',
        title: 'Rain Master',
        description: 'Check weather during rain 5 times',
        icon: <CloudRain className="w-5 h-5" />,
        category: 'weather',
        rarity: 'common',
        points: 30,
        isUnlocked: false,
        progress: 0,
        maxProgress: 5,
        conditions: [{ type: 'condition', value: 'rain', operator: 'contains' }]
      },
      {
        id: 'storm-chaser',
        title: 'Storm Chaser',
        description: 'Experience a thunderstorm',
        icon: <CloudLightning className="w-5 h-5" />,
        category: 'weather',
        rarity: 'epic',
        points: 100,
        isUnlocked: false,
        conditions: [{ type: 'condition', value: 'thunderstorm', operator: 'contains' }]
      },
      {
        id: 'snow-explorer',
        title: 'Snow Explorer',
        description: 'Experience snowfall',
        icon: <Snowflake className="w-5 h-5" />,
        category: 'weather',
        rarity: 'rare',
        points: 75,
        isUnlocked: false,
        conditions: [{ type: 'condition', value: 'snow', operator: 'contains' }]
      },
      {
        id: 'location-hopper',
        title: 'Location Hopper',
        description: 'Check weather in 10 different locations',
        icon: <MapPin className="w-5 h-5" />,
        category: 'exploration',
        rarity: 'rare',
        points: 80,
        isUnlocked: false,
        progress: 0,
        maxProgress: 10,
        conditions: [{ type: 'location', value: 10, operator: 'greater' }]
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Check weather for 7 consecutive days',
        icon: <TrendingUp className="w-5 h-5" />,
        category: 'consistency',
        rarity: 'epic',
        points: 150,
        isUnlocked: false,
        progress: 0,
        maxProgress: 7,
        conditions: [{ type: 'streak', value: 7, operator: 'greater' }]
      },
      {
        id: 'weather-collector',
        title: 'Weather Collector',
        description: 'Experience 15 different weather conditions',
        icon: <Globe className="w-5 h-5" />,
        category: 'exploration',
        rarity: 'legendary',
        points: 300,
        isUnlocked: false,
        progress: 0,
        maxProgress: 15,
        conditions: [{ type: 'custom', value: 'weather_conditions', operator: 'greater' }]
      },
      {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Check weather before 6 AM',
        icon: <Sunrise className="w-5 h-5" />,
        category: 'special',
        rarity: 'common',
        points: 25,
        isUnlocked: false,
        conditions: [{ type: 'time', value: 6, operator: 'less' }]
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Check weather after 10 PM',
        icon: <Moon className="w-5 h-5" />,
        category: 'special',
        rarity: 'common',
        points: 25,
        isUnlocked: false,
        conditions: [{ type: 'time', value: 22, operator: 'greater' }]
      }
    ];

    setAchievements(baseAchievements);
  }, []);

  // Initialize challenges
  useEffect(() => {
    const baseChallenges: Challenge[] = [
      {
        id: 'daily-check',
        title: 'Daily Weather Check',
        description: 'Check the weather today',
        icon: <Calendar className="w-5 h-5" />,
        type: 'daily',
        difficulty: 'easy',
        points: 10,
        isCompleted: false,
        progress: 0,
        maxProgress: 1,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        rewards: { points: 10 }
      },
      {
        id: 'temperature-prediction',
        title: 'Temperature Predictor',
        description: 'Predict tomorrow\'s high temperature within 3°C',
        icon: <Target className="w-5 h-5" />,
        type: 'daily',
        difficulty: 'medium',
        points: 50,
        isCompleted: false,
        progress: 0,
        maxProgress: 1,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        rewards: { points: 50, badges: ['predictor'] }
      },
      {
        id: 'weather-explorer',
        title: 'Weather Explorer',
        description: 'Check weather in 3 different cities this week',
        icon: <MapPin className="w-5 h-5" />,
        type: 'weekly',
        difficulty: 'medium',
        points: 100,
        isCompleted: false,
        progress: 0,
        maxProgress: 3,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rewards: { points: 100, badges: ['explorer'] }
      },
      {
        id: 'extreme-weather',
        title: 'Extreme Weather Survivor',
        description: 'Experience 3 different extreme weather conditions',
        icon: <AlertTriangle className="w-5 h-5" />,
        type: 'monthly',
        difficulty: 'hard',
        points: 200,
        isCompleted: false,
        progress: 0,
        maxProgress: 3,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        rewards: { points: 200, badges: ['survivor'], unlocks: ['extreme_weather_tracker'] }
      }
    ];

    setChallenges(baseChallenges);
  }, []);

  // Check achievements
  useEffect(() => {
    if (!weather) return;

    const checkAchievements = () => {
      const updatedAchievements = achievements.map(achievement => {
        if (achievement.isUnlocked) return achievement;

        let shouldUnlock = false;
        let progress = achievement.progress || 0;

        achievement.conditions.forEach(condition => {
          switch (condition.type) {
            case 'temperature':
              const temp = weather.temperature?.current;
              if (condition.operator === 'greater' && temp > condition.value) shouldUnlock = true;
              if (condition.operator === 'less' && temp < condition.value) shouldUnlock = true;
              break;
            case 'condition':
              const weatherCondition = weather.condition?.main?.toLowerCase();
              if (condition.operator === 'contains' && weatherCondition?.includes(condition.value)) {
                progress++;
                if (progress >= (achievement.maxProgress || 1)) shouldUnlock = true;
              }
              break;
            case 'location':
              if (condition.operator === 'greater' && userStats.locationsVisited >= condition.value) {
                shouldUnlock = true;
              }
              break;
            case 'streak':
              if (condition.operator === 'greater' && userStats.streakDays >= condition.value) {
                shouldUnlock = true;
              }
              break;
            case 'time':
              const hour = new Date().getHours();
              if (condition.operator === 'less' && hour < condition.value) shouldUnlock = true;
              if (condition.operator === 'greater' && hour > condition.value) shouldUnlock = true;
              break;
            case 'custom':
              if (condition.value === 'first_check' && userStats.totalPoints === 0) shouldUnlock = true;
              break;
          }
        });

        if (shouldUnlock) {
          return {
            ...achievement,
            isUnlocked: true,
            unlockedAt: new Date(),
            progress: achievement.maxProgress || 1
          };
        }

        return {
          ...achievement,
          progress
        };
      });

      setAchievements(updatedAchievements);
    };

    checkAchievements();
  }, [weather, userStats]);

  // Update user stats
  useEffect(() => {
    const updateStats = () => {
      const today = new Date().toDateString();
      const lastCheckIn = new Date(userStats.lastCheckIn).toDateString();
      
      let newStreak = userStats.streakDays;
      if (today !== lastCheckIn) {
        newStreak++;
      }

      const newStats = {
        ...userStats,
        streakDays: newStreak,
        longestStreak: Math.max(userStats.longestStreak, newStreak),
        lastCheckIn: new Date(),
        totalAchievements: achievements.length,
        totalChallenges: challenges.length
      };

      setUserStats(newStats);
      localStorage.setItem('meteora-user-stats', JSON.stringify(newStats));
    };

    updateStats();
  }, [achievements, challenges]);

  // Calculate level and experience
  const levelInfo = useMemo(() => {
    const level = userStats.level;
    const exp = userStats.experience;
    const expToNext = userStats.experienceToNext;
    const progress = (exp / expToNext) * 100;

    return { level, exp, expToNext, progress };
  }, [userStats]);

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
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  // Fallback content if no weather data
  if (!weather) {
    return (
      <div className="space-y-6">
        <motion.div
          className="glass-card p-6 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Weather Gamification</h3>
                <p className="text-white/70 text-sm">Earn achievements and complete challenges</p>
              </div>
            </div>
          </div>
          <div className="text-center py-10">
            <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <p className="text-white/70">Search for a location to start earning weather achievements</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gamification Overview */}
      <motion.div
        className="glass-card p-6 rounded-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Weather Gamification</h3>
              <p className="text-white/70 text-sm">Earn achievements and complete challenges</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-white/60 text-xs">Level {levelInfo.level}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'challenges', label: 'Challenges', icon: TargetIcon },
            { id: 'leaderboard', label: 'Leaderboard', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Level Progress */}
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">Level Progress</h4>
                  <span className="text-white/60 text-sm">Level {levelInfo.level}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>{levelInfo.exp} XP</span>
                    <span>{levelInfo.expToNext} XP</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${levelInfo.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{userStats.totalPoints} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{userStats.streakDays} day streak</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Achievements', value: `${unlockedAchievements.length}/${userStats.totalAchievements}`, icon: Award, color: 'text-blue-400' },
                  { label: 'Challenges', value: `${completedChallenges.length}/${userStats.totalChallenges}`, icon: TargetIcon, color: 'text-green-400' },
                  { label: 'Locations', value: userStats.locationsVisited, icon: MapPin, color: 'text-purple-400' },
                  { label: 'Conditions', value: userStats.weatherConditionsSeen, icon: Cloud, color: 'text-yellow-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="glass-card p-4 rounded-2xl text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mb-3 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Achievements */}
              <div>
                <h4 className="text-white font-semibold mb-3">Recent Achievements</h4>
                <div className="space-y-2">
                  {unlockedAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                      <div className={`p-2 rounded-full bg-white/10 ${getRarityColor(achievement.rarity)}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{achievement.title}</div>
                        <div className="text-white/60 text-sm">{achievement.description}</div>
                      </div>
                      <div className="text-white/40 text-sm">
                        +{achievement.points} pts
                      </div>
                    </div>
                  ))}
                  {unlockedAchievements.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No achievements unlocked yet. Keep checking the weather!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    achievement.isUnlocked 
                      ? 'bg-white/20 border border-white/30' 
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-white/10 ${getRarityColor(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">{achievement.title}</h4>
                        {achievement.isUnlocked && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      <p className="text-white/70 text-sm mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${getRarityColor(achievement.rarity)} capitalize`}>
                            {achievement.rarity}
                          </span>
                          <span className="text-white/60">
                            +{achievement.points} points
                          </span>
                        </div>
                        {achievement.maxProgress && (
                          <div className="text-white/60 text-sm">
                            {achievement.progress || 0}/{achievement.maxProgress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    challenge.isCompleted 
                      ? 'bg-white/20 border border-white/30' 
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-white/10 ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">{challenge.title}</h4>
                        {challenge.isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      <p className="text-white/70 text-sm mb-3">{challenge.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-white/60 mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`${getDifficultyColor(challenge.difficulty)} capitalize`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-white/60">
                            +{challenge.points} points
                          </span>
                        </div>
                        {challenge.deadline && (
                          <div className="text-white/40 text-sm">
                            Due: {challenge.deadline.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center py-8 text-white/60">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Leaderboard coming soon!</p>
                <p className="text-sm">Compete with other weather enthusiasts</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WeatherGamification; 