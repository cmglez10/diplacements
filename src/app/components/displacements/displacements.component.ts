import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  AddressInfo,
  Coordinates,
  OpenstreetmapService,
} from './openstreetmap.service';
import { reduce } from 'lodash';

interface Appointment {
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  name?: string;
  distance?: number;
}

interface Day {
  appointments: Appointment[];
}

@Component({
  selector: 'app-displacements',
  templateUrl: './displacements.component.html',
  styleUrls: ['./displacements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplacementsComponent {
  public days: Day[] = [];
  public totalDistance: number = 0;

  constructor(
    private readonly _openstreetmapService: OpenstreetmapService,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {}

  public onChangeLocation(day: Day, appoinmentIndex: number, event: Event) {
    const appoinment = day.appointments[appoinmentIndex];
    appoinment.location = (event.target as HTMLInputElement).value;
    this._openstreetmapService
      .getAddressInfo(appoinment.location)
      .subscribe((addressInfo: AddressInfo) => {
        appoinment.coordinates = addressInfo.coordinates;
        appoinment.name = addressInfo.name;
        appoinment.distance = 0;

        if (appoinmentIndex > 0) {
          const previousAppoinment: Appointment =
            day.appointments[appoinmentIndex - 1];
          this._openstreetmapService
            .getDistance(
              previousAppoinment.coordinates as Coordinates,
              appoinment.coordinates
            )
            .subscribe((distance: number) => {
              appoinment.distance = distance;
              this._calculateTotalDistance();
            });
        }

        if (appoinmentIndex < day.appointments.length - 1) {
          const nextAppoinment: Appointment =
            day.appointments[appoinmentIndex + 1];
          this._openstreetmapService
            .getDistance(
              appoinment.coordinates,
              nextAppoinment.coordinates as Coordinates
            )
            .subscribe((distance: number) => {
              nextAppoinment.distance = distance;
              this._calculateTotalDistance();
            });
        }

        this._calculateTotalDistance();
      });
  }

  private _calculateTotalDistance(): void {
    this.totalDistance = reduce(
      this.days,
      (totalDistance: number, day: Day) => {
        return (
          totalDistance +
          reduce(
            day.appointments,
            (totalDistance: number, appoinment: Appointment) => {
              return totalDistance + (appoinment.distance || 0);
            },
            0
          )
        );
      },
      0
    );

    this._changeDetectorRef.markForCheck();
  }
}
