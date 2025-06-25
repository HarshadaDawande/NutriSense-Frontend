import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 font-medium">Meal Date</span>
      </div>
      <Button
        variant="outline"
        className="w-full border-green-200 focus:border-green-500 focus:ring-green-500/20 justify-start text-left font-normal"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        type="button"
      >
        <Calendar className="mr-2 h-4 w-4 text-green-600" />
        {format(selectedDate, 'PPP')}
      </Button>
      
      {isCalendarOpen && (
        <div className="relative">
          <div className="absolute z-10 mt-1 w-full border border-green-200 rounded-md p-4 bg-white shadow-md">
            <div className="mb-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                onClick={() => {
                  const today = new Date();
                  onDateChange(today);
                  setIsCalendarOpen(false);
                }}
              >
                Today
              </Button>
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => {
                if (date) {
                  onDateChange(date);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={(date: Date) => date > new Date()}
              className="mx-auto"
              classNames={{
                day_selected: "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white",
                day_today: "bg-green-50 text-green-800 font-medium",
                caption_label: "text-green-800 font-medium",
                nav_button: "text-green-600 hover:bg-green-50 hover:text-green-800",
                cell: "rounded-full",
                day: "rounded-full hover:bg-green-50 hover:text-green-800 focus:bg-green-50 focus:text-green-800"
              }}
            />
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Select the date when you had this meal (future dates not allowed)
      </p>
    </div>
  );
}
