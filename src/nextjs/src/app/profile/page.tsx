'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { UserProfile } from '@/types/user.types';

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', {
    name: '',
    age: 30,
    gender: 'male',
    height: 170,
    weight: 60,
    activityLevel: 'moderate',
    goal: 'maintenance',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (!isClient) {
    return null;
  }

  if (!isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">プロフィール</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">基本情報</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              編集
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">名前</div>
              <div className="text-lg">{profile.name || '未設定'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">年齢</div>
              <div className="text-lg">{profile.age}歳</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">性別</div>
              <div className="text-lg">
                {profile.gender === 'male' ? '男性' : '女性'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">身長</div>
              <div className="text-lg">{profile.height}cm</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">体重</div>
              <div className="text-lg">{profile.weight}kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">活動レベル</div>
              <div className="text-lg">
                {profile.activityLevel === 'sedentary' && 'ほとんど運動しない'}
                {profile.activityLevel === 'light' && '週1-3回の軽い運動'}
                {profile.activityLevel === 'moderate' && '週3-5回の中程度の運動'}
                {profile.activityLevel === 'active' && '週6-7回の激しい運動'}
                {profile.activityLevel === 'very_active' && '毎日の激しい運動'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">目標</div>
              <div className="text-lg">
                {profile.goal === 'maintenance' && '体重維持'}
                {profile.goal === 'weight_loss' && '減量'}
                {profile.goal === 'muscle_gain' && '筋肉増加'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">プロフィール編集</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年齢
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
              min="15"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性別
            </label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value as 'male' | 'female' })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              身長 (cm)
            </label>
            <input
              type="number"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
              min="100"
              max="250"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              体重 (kg)
            </label>
            <input
              type="number"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
              min="30"
              max="200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              活動レベル
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as UserProfile['activityLevel'] })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="sedentary">ほとんど運動しない</option>
              <option value="light">週1-3回の軽い運動</option>
              <option value="moderate">週3-5回の中程度の運動</option>
              <option value="active">週6-7回の激しい運動</option>
              <option value="very_active">毎日の激しい運動</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目標
            </label>
            <select
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value as UserProfile['goal'] })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="maintenance">体重維持</option>
              <option value="weight_loss">減量</option>
              <option value="muscle_gain">筋肉増加</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 