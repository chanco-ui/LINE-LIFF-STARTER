'use client';

import { useState } from 'react';
import { CalendarProps, WorkoutRecord, MealRecord } from '@/types/workout.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar({ selectedDate, onDateSelect, records }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    return new Date(year, month - 1);
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(formatDate(date));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // 前月の日付を追加
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i);
      days.unshift(prevDate);
    }

    // 当月の日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    // 次月の日付を追加（6週間分の日付を確保）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i));
    }

    return days.map((date, index) => {
      const dateStr = formatDate(date);
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isSelected = dateStr === selectedDate;
      const hasWorkout = records.some(record => 
        'workoutSets' in record && record.date === dateStr
      );
      const hasMeal = records.some(record => 
        'foodItems' in record && record.date === dateStr
      );

      return (
        <button
          key={index}
          onClick={() => handleDateClick(date)}
          className={`
            relative p-2 text-center rounded-lg
            ${isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-400'}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
          `}
        >
          <span>{date.getDate()}</span>
          {(hasWorkout || hasMeal) && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
              {hasWorkout && (
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              )}
              {hasMeal && (
                <div className="w-1 h-1 bg-green-500 rounded-full" />
              )}
            </div>
          )}
        </button>
      );
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm">トレーニング</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm">食事</span>
        </div>
      </div>
    </div>
  );
} 