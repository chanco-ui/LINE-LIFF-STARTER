'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const [currentDate] = useState(new Date(selectedDate));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(today.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={handlePrevDay}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-4">
        <span className="text-lg font-medium">{formatDate(currentDate)}</span>
        <button
          onClick={handleToday}
          className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200"
        >
          今日
        </button>
      </div>

      <button
        onClick={handleNextDay}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}; 