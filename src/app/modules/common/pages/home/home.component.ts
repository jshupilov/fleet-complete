import { Component, OnInit } from '@angular/core';
import { TrackingService } from '@app/data/service/tracking.service';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }, {
    provide: MAT_DATE_FORMATS,
    useValue: MY_FORMATS
  }],
})
export class HomeComponent implements OnInit {

  public lat = 59.436962;
  public lng = 24.753574;

  public origin: any;
  public apiKey: string = ''; // 'home.assignment-699172', 'home.assignment.2-1230927'
  public destination: any;
  public loading: boolean = false;
  public lastData: any = [null, null, null, null, null];
  public directions: any = [];
  public dirs: any;
  public markers: any = [];
  public date: FormControl = new FormControl(moment());
  public renderOptions: any = { suppressMarkers: true }
  private selectedItem: any;
  public stopsCount: number = 0;
  public distance: number = 0;
  public shortestDistance: number = 0;

  constructor(
    private trackingService: TrackingService
  ) { }

  ngOnInit() { }

  getData() {
    this.trackingService.getLastData({ key: this.apiKey, json: true }).subscribe(res => {

      this.lastData = res.response.map((item: any) => {
        item.timestamp = moment(item.timestamp).fromNow();
        this.markers.push({
          lat: item.latitude,
          lng: item.longitude,
          name: item.objectName
        })
        return item;
      });
    }, error => {
      console.log('Getting LAST DATA Error', error)
    })
  }

  active(item: any) {
    if (this.lastData.some((ld: any) => ld)) {
      const activeItem = this.lastData.find((ld: any) => ld.active)
      if (activeItem) {
        activeItem.active = false;
      }
      item.active = true;
      this.selectedItem = item;
    }
  }

  public onResponse(event: any) {

    setTimeout((event: any) => {
      if (((event || {}).routes || []).length) {
        this.distance = this.distance + event.routes[0].legs.reduce((acc: any, leg: { distance: { value: any; }; }) => {
          return acc + leg.distance.value / 1000;
        }, 0);
      } else {
        console.log(event);
      }
      if (this.directions.length < this.dirs.length) {
        const index = this.directions.length - 1;
        if (this.dirs[index + 1]) {
          if (this.directions[index])
            this.directions.push({
              origin: {
                lat: this.dirs[index].Latitude,
                lng: this.dirs[index].Longitude
              },
              destination: {
                lat: this.dirs[index + 1].Latitude,
                lng: this.dirs[index + 1].Longitude
              }
            })
        }
      } else {
        if (this.directions.length === this.dirs.length) {
          this.directions.push({
            origin: {
              lat: this.dirs[this.dirs.length - 1].Latitude,
              lng: this.dirs[this.dirs.length - 1].Longitude
            },
            destination: {
              lat: this.selectedItem.latitude,
              lng: this.selectedItem.longitude
            }
          });
        } else {
          this.loading = false;
        }
      }
    }, 1500, event);
  }

  async getDirection() {

    this.directions = [];
    this.distance = 0;
    this.shortestDistance = 0;
    if ((this.selectedItem || {}).objectId) {
      this.loading = true;
      this.trackingService.getRawData({
        objectId: this.selectedItem.objectId,
        key: 'home.assignment-699172',
        begTimestamp: moment(this.date.value).format('yyyy-MM-DD'),
        endTimestamp: moment(this.date.value).add(1, 'days').format('yyyy-MM-DD'),
        json: true
      }).subscribe(res => {

        if (res.response.length) {

          //Function to take defined routes from list of routes
          //to decrease amount of requests to Google API
          const take = (array: any, nth: number) => {
            if (!Number(nth) && nth !== 0) {
              console.log(`Array.take requires passing in a number.  Passed in ${typeof nth}`);
            } else if (nth <= 0) {
              console.log(`Array.take requires a number greater than 0.  Passed in ${nth}`);
            }

            const selectedIndicesLength = Math.floor(array.length / nth);
            return [...Array(selectedIndicesLength)].map((item, index) => array[index * nth + 1]);
          };
          //Take only 10 routes
          this.dirs = take(res.response, Math.floor(res.response.length / 10));

          //Calculating count of stops
          //Collecting all indexes with Engine status equal to null 
          const stopsCounts = res.response.reduce((acc: any, route: { EngineStatus: number; }, i: any) => {
            return !route.EngineStatus ? [...acc, i] : acc;
          }, []);
          this.distance = 0;
          const stopRoutes = [];
          for (let i = 0; i < stopsCounts.length - 1; i++) {
            if (stopsCounts[i] + 1 < stopsCounts[i + 1]) {
              //Deviding routes on ways between stops
              const origin = res.response[stopsCounts[i]];
              const destination = res.response[stopsCounts[i + 1]];
              stopRoutes.push({
                origins: `${origin.Latitude}, ${origin.Longitude}`,
                destinations: `${destination.Latitude}, ${destination.Longitude}`
              })
            }
          }
          //Calculating count of stops
          this.stopsCount = stopRoutes.length;

          //If no stops then calculate full path
          if (!this.stopsCount) {
            const origin = res.response[stopsCounts[stopsCounts.length - 1]];
            const destination = res.response[res.response.length - 1];
            stopRoutes.push({
              origins: `${origin.Latitude}, ${origin.Longitude}`,
              destinations: `${destination.Latitude}, ${destination.Longitude}`
            })
          }

          this.trackingService.getShortestDistance({
            origins: stopRoutes.map(route => route.origins).join('|'),
            destinations: stopRoutes.map(route => route.destinations).join('|')

          }).subscribe(res => {
            if (res.rows.length) {
              const allDistances: any = [];
              res.rows.every((row: any) => {
                allDistances.push(row.elements.reduce((acc: number, row: { distance: { value: number; }; }) => {
                  return acc + row.distance.value / 1000;
                }, 0));
              })
              this.shortestDistance = Math.min(...allDistances);
            }
          }, error => {
            console.log('Getting Shortes Distance Error', error)
          });

          this.directions.push({
            origin: {
              lat: res.response[0].Latitude,
              lng: res.response[0].Longitude
            },
            destination: {
              lat: this.dirs[0].Latitude,
              lng: this.dirs[0].Longitude
            }
          });

        } else {
          this.loading = false;
        }
      }, error => {
        console.log('Getting Directions Error', error)
      })
    } else {
      alert("Please select object");
    }

  }

}
