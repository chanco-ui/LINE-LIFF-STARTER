'use client';

import { useState, useEffect } from 'react';
import { MealRecord } from '@/types/user.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  meals: MealRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function Calendar({ meals, selectedDate, onSelectDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const hasMeal = (date: Date) => {
    return meals.some(meal => meal.date === date.toISOString().split('T')[0]);
  };

  const renderDays = () => {
    const days = [];
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // 曜日のヘッダー
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={`weekday-${i}`}
          className={`text-center font-medium ${
            i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''
          }`}
        >
          {weekdays[i]}
        </div>
      );
    }

    // 月の最初の日の前の空白
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // 日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <button
          key={day}
          onClick={() => onSelectDate(dateString)}
          className={`h-10 w-10 rounded-full flex items-center justify-center relative border
            ${isToday(date) ? 'bg-blue-100' : ''}
            ${isSelected(date) ? 'bg-blue-500 text-white' : ''}
            ${isWeekend ? 'text-red-500' : ''}
            ${isSelected(date) && isWeekend ? 'text-white' : ''}
            hover:bg-gray-100 transition-colors`}
        >
          {day}
          {hasMeal(date) && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
          )}
        </button>
      );
    }

    return days;
  };

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  );
} 