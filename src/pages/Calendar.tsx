import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Calendar as CalendarIcon, Clock, Users, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: 'class' | 'rehearsal' | 'performance' | 'meeting' | 'other';
  location?: string;
  instructor?: string;
  max_participants?: number;
  current_participants: number;
  division?: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    event_type: 'class' as const,
    location: '',
    instructor: '',
    max_participants: '',
    division: ''
  });

  // Mock events data (would be fetched from Supabase)
  const events: Event[] = [
    {
      id: '1',
      title: 'Ballet Technique - Professional',
      description: 'Advanced ballet technique class',
      start_time: '2025-01-07T10:00:00',
      end_time: '2025-01-07T11:30:00',
      event_type: 'class',
      location: 'Studio A',
      instructor: 'Ms. Johnson',
      max_participants: 12,
      current_participants: 8,
      division: 'Professional'
    },
    {
      id: '2',
      title: 'Nutcracker Rehearsal',
      description: 'Act II rehearsal',
      start_time: '2025-01-08T16:00:00',
      end_time: '2025-01-08T18:00:00',
      event_type: 'rehearsal',
      location: 'Main Theater',
      instructor: 'Ms. Smith',
      max_participants: 25,
      current_participants: 20,
      division: 'All'
    },
    {
      id: '3',
      title: 'Parent Meeting',
      description: 'Monthly parent information session',
      start_time: '2025-01-10T19:00:00',
      end_time: '2025-01-10T20:00:00',
      event_type: 'meeting',
      location: 'Conference Room',
      max_participants: 50,
      current_participants: 15
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'rehearsal': return 'bg-purple-100 text-purple-800';
      case 'performance': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), date)
    );
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would create the event in Supabase
    toast({
      title: "Event Created",
      description: "Event has been added to the calendar",
    });

    setIsCreateEventOpen(false);
    setNewEvent({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      event_type: 'class',
      location: '',
      instructor: '',
      max_participants: '',
      division: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Studio Calendar</h1>
            <p className="text-white/80">Manage classes, rehearsals, and events</p>
          </div>
        </div>

        {/* Calendar Header */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-bold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
                  <DialogTrigger asChild>
                    <Button variant="elegant">
                      <Plus className="h-4 w-4 mr-2" />
                      New Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                      <DialogDescription>
                        Add a new class, rehearsal, or event to the calendar
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium mb-2 block">Event Title *</label>
                        <Input
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                          placeholder="e.g., Ballet Technique Class"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Event Type *</label>
                        <Select value={newEvent.event_type} onValueChange={(value: any) => setNewEvent({...newEvent, event_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class">Class</SelectItem>
                            <SelectItem value="rehearsal">Rehearsal</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Division</label>
                        <Select value={newEvent.division} onValueChange={(value) => setNewEvent({...newEvent, division: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
                            <SelectItem value="Supplemental">Supplemental</SelectItem>
                            <SelectItem value="All">All Divisions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Time *</label>
                        <Input
                          type="datetime-local"
                          value={newEvent.start_time}
                          onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Time *</label>
                        <Input
                          type="datetime-local"
                          value={newEvent.end_time}
                          onChange={(e) => setNewEvent({...newEvent, end_time: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                          placeholder="e.g., Studio A"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Instructor</label>
                        <Input
                          value={newEvent.instructor}
                          onChange={(e) => setNewEvent({...newEvent, instructor: e.target.value})}
                          placeholder="e.g., Ms. Johnson"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                          placeholder="Event description..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Max Participants</label>
                        <Input
                          type="number"
                          value={newEvent.max_participants}
                          onChange={(e) => setNewEvent({...newEvent, max_participants: e.target.value})}
                          placeholder="0 for unlimited"
                        />
                      </div>
                      <div className="col-span-2 pt-4">
                        <Button onClick={handleCreateEvent} className="w-full">
                          Create Event
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="shadow-card">
              <CardContent className="p-6">
                {/* Calendar Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          min-h-24 p-2 border rounded-lg cursor-pointer transition-colors
                          ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                          ${isTodayDate ? 'ring-2 ring-primary' : ''}
                          ${isSelected ? 'bg-primary/10' : ''}
                          hover:bg-muted/50
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1 mt-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.event_type)}`}
                            >
                              {format(new Date(event.start_time), 'HH:mm')} {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-4">
            {/* Today's Events */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Today's Events</CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(new Date()).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(new Date()).map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getEventTypeColor(event.event_type)} variant="outline">
                            {event.event_type}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        {event.max_participants && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {event.current_participants}/{event.max_participants}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No events today</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="p-2 border rounded">
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(event.start_time), 'MMM d, HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Classes</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rehearsals</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Events</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;