import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FriendQuery } from '../state/friend.query';
import { FriendService } from '../state/friend.service';
import {By} from '@angular/platform-browser';

import { AgeWeightScatterGraphComponent } from './age-weight-scatter-graph.component';
import { of } from 'rxjs';
import { FriendStore } from '../state/friend.store';
import { Friend } from '../state/friend.model';
import cuid from 'cuid';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { HttpClientModule } from '@angular/common/http';

describe('AgeWeightScatterGraphComponent', () => {
  let component: AgeWeightScatterGraphComponent;
  let friendQuery: jasmine.SpyObj<FriendQuery>;
  let friendStore: FriendStore;
  let fixture: ComponentFixture<AgeWeightScatterGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FriendService,
        FriendQuery
      ],
      declarations: [ AgeWeightScatterGraphComponent ],
      imports: [
        HttpClientModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeWeightScatterGraphComponent);
    component = fixture.componentInstance;
    friendQuery = jasmine.createSpyObj('FriendQuery', ['selectAll'])
    friendStore = TestBed.inject(FriendStore)
    fixture.detectChanges();
  });

  //  Query tests
  it('should display graph', () => {
    friendQuery.selectAll.and.returnValue(of([]));
    fixture.detectChanges();
    let graphID = fixture.componentInstance.scatterPlotId;
    const noMessageElement = fixture.debugElement.query(By.css(`#scatterplot`));
    expect(noMessageElement).not.toBeNull();
  });

  //  Store tests
  it('should display two plots', () => {
    let friend1: Friend = {
      id: cuid(),
      name: 'Bob',
      age: 29,
      weight: 200,
      friendList: []
    };
    let friend2: Friend = {
      id: cuid(),
      name: 'Bob',
      age: 30,
      weight: 210,
      friendList: [friend1]
    };    
    friendStore.set([friend1, friend2]);
    fixture.detectChanges();
    const plots = fixture.debugElement.queryAll(By.css('.dot'));
    expect(plots.length).toEqual(2);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
