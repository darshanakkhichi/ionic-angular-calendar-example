import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,

} from 'angular-calendar';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  data: any = {};
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  events: CalendarEvent[] = [
    // {
    //   start: startOfDay(new Date('2020-06-10')),
    //   end: startOfDay(new Date('2020-06-10')),
    //   title: "Mumbai",
    //   allDay: true,
    //   color: colors.red
    // },
    // {
    //   start: startOfDay(new Date('2020-06-12')),
    //   end: startOfDay(new Date('2020-06-13')),
    //   title: "Bangalore",
    //   color: colors.yellow
    // },
    // {
    //   start: startOfDay(new Date('2020-06-15')),
    //   end: startOfDay(new Date('2020-06-16')),
    //   title: "Sewree",
    //   color: colors.blue
    // }
  ];
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    },
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  constructor(private modal: NgbModal) {
    this.data = {
      "events": [
        {
          "start": "2020-06-10",
          "end": "2020-06-10",
          "name": "Mumbai",
          "color": {
            primary: '#e3bc08',
            secondary: '#FDF1BA',
          }
        },
        {
          "start": "2020-06-12",
          "end": "2020-06-13",
          "name": "Bangalore",
          "color": {
            primary: '#ad2121',
            secondary: '#FAE3E3',
          },
        },
        {
          "start": "2020-06-15",
          "end": "2020-06-16",
          "name": "Sewree",
          "color": {
            primary: '#1e90ff',
            secondary: '#D1E8FF',
          }
        }]
    }
    for (let i = 0; i < this.data.events.length; i++) {
      this.events[i] = {
        start: startOfDay(new Date(this.data.events[i]['start'])),
        end: startOfDay(new Date(this.data.events[i]['end'])),
        title: this.data.events[i]['name'],
        allDay: true,
        color: this.data.events[i].color
      }
    }
    // this.events = [
    //   {
    //     start: startOfDay(new Date(this.data.event)),
    //     end: startOfDay(new Date('2020-06-10')),
    //     title: "Mumbai",
    //     allDay: true,
    //     color: colors.red
    //   },
    //   {
    //     start: startOfDay(new Date('2020-06-12')),
    //     end: startOfDay(new Date('2020-06-13')),
    //     title: "Bangalore",
    //     color: colors.yellow
    //   },
    //   {
    //     start: startOfDay(new Date('2020-06-15')),
    //     end: startOfDay(new Date('2020-06-16')),
    //     title: "Sewree",
    //     color: colors.blue
    //   }
    // ]


  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        // color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}
