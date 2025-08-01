import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors());

const internData = {
  user: { name: 'Demo User', referralCode: 'demouser2025' },
  stats: {
    totalDonations: 750,
    donationChange: '+12% from last month',
    referrals: 12,
    referralChange: '+3 this month',
    monthlyGoal: { current: 750, target: 1000 },
    growthRate: { percentage: 15, period: 'Above average' },
  },
  // Inside backend/server.js, find this array and replace it:

  // Data for the recent activity list
  recentActivity: [
    { type: 'New donation received', person: 'Sarah J.', amount: 50, time: '2 hours ago' },
    { type: 'Referral signup', person: 'Sarah J.', time: '1 day ago' },
    { type: 'Goal milestone reached', goal: '75%', time: '3 days ago' },
    { type: 'New donation received', person: 'Anonymous', amount: 25, time: '5 days ago' }, // <-- New Item
  ],
  rewards: {
    nextReward: { title: 'Top Performer', current: 750, target: 1000 },
    unlocked: [
        { id: 1, title: 'First Donation', goal: 100 },
        { id: 2, title: 'Rising Star', goal: 500 },
    ],
    locked: [
        { id: 3, title: 'Top Performer', goal: 1000 },
        { id: 4, title: 'Elite Fundraiser', goal: 2500 },
    ]
  },
  leaderboard: [
    { rank: 1, name: 'Sarah Johnson', amount: 2850, status: 'No change', medal: 'gold' },
    { rank: 2, name: 'Mike Chen', amount: 2640, status: 'Moving up', medal: 'silver' },
    { rank: 3, name: 'Emily Davis', amount: 2420, status: 'Moving down', medal: 'bronze' },
    { rank: 4, name: 'Alex Rodriguez', amount: 1980, status: 'Moving up' },
    { rank: 5, name: 'Demo User', amount: 750, status: 'No change', isUser: true },
    { rank: 6, name: 'Jessica Lee', amount: 650, status: 'Moving down' },
    { rank: 7, name: 'David Wilson', amount: 580, status: 'Moving up' },
  ],
};

app.get('/api/data', (req, res) => {
  res.json(internData);
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});