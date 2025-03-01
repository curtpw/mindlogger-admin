<template>
  <div
    class="ds-event"
    :class="classes"
  >
    <div class="ds-event-header ds-event-area">
      <div
        v-if="hasCancel"
        class="ds-event-cancel"
      >
        <!-- Cancel -->
        <slot
          name="scheduleCancel"
          v-bind="{cancel, labels}"
        >
          <v-tooltip bottom>
            <v-btn
              slot="activator"
              icon
              class="ds-button"
              @click="cancel"
            >
              <v-icon dark>
                clear
              </v-icon>
            </v-btn>
            <span v-html="labels.cancel" />
          </v-tooltip>
        </slot>
      </div>

      <div class="ds-event-actions">
        <!-- Save -->
        <slot
          name="scheduleSave"
          v-bind="{hasSave, save, labels, readOnly}"
        >
          <v-btn
            v-if="!isReadOnly"
            class="ds-button-tall ml-3 mt-0 mb-2"
            depressed
            color="primary"
            :disabled="!canSave"
            @click.stop="save"
          >
            <span v-html="labels.save" />
          </v-btn>
        </slot>

        <!-- More Actions -->
        <slot
          name="scheduleActions"
          v-bind="{calendarEvent, schedule, calendar, actioned, readOnly}"
        >
          <ds-schedule-actions
            v-if="calendarEvent && !isReadOnly"
            v-bind="{$scopedSlots}"
            :schedule="schedule"
            :calendar-event="calendarEvent"
            :calendar="calendar"
            v-on="$listeners"
            @finish="actioned"
          >
            <v-btn
              class="ds-button-tall ml-1 mt-0 mb-2"
              depressed
            >
              {{ labels.moreActions }}
            </v-btn>
          </ds-schedule-actions>
        </slot>
      </div>

      <!-- Title -->
      <slot
        name="scheduleTitle"
        v-bind="{schedule, schedule, calendarEvent, details}"
      >
        <!-- class="ds-textfield ds-calendar-event-title" -->
        <!-- <v-text-field single-line hide-details solo flat
          class="ds-event-title"
          :label="labels.title"
          :readonly="isReadOnly"
          v-model="details.title"
        ></v-text-field> -->
        <v-select
          v-model="details.title" 
          :items="activityNames"
          placeholder="Select Activity"
        />
      </slot>
    </div>

    <div class="ds-event-body ds-event-area">
      <slot
        name="schedule"
        v-bind="slotData"
      >
        <!-- absolute scheduling options below -->
        <my-schedule
          :schedule="schedule"
          :day="day"
          :read-only="readOnly"
        />
      </slot>
    </div>

    <!-- Tabs -->
    <v-layout
      v-if="hasTabs"
      row
    >
      <v-flex
        xs12
        class="mt-2"
      >
        <v-tabs
          v-model="tab"
          class="text--primary"
        >
          <v-tab
            v-if="hasDetails"
            href="#details"
          >
            {{ labels.tabs.details }}
          </v-tab>

          <v-tab
            v-if="showForecast"
            href="#forecast"
          >
            {{ labels.tabs.forecast }}
          </v-tab>

          <v-tab
            v-if="showExclusions"
            href="#exclusions"
          >
            {{ labels.tabs.removed }}
          </v-tab>

          <v-tab
            v-if="showInclusions"
            href="#inclusions"
          >
            {{ labels.tabs.added }}
          </v-tab>

          <v-tab
            v-if="showCancels"
            href="#cancelled"
          >
            {{ labels.tabs.cancelled }}
          </v-tab>

          <slot
            name="eventTabsExtra"
            v-bind="slotData"
          />

          <!-- Details -->
          <v-tab-item
            v-if="hasDetails"
            value="details"
          >
            <v-card flat>
              <v-card-text>
                {{ details }}
                <br>
                <br>
                <!-- Max number of responses -->
                max # of responses
                <v-text-field
                  v-model="details.maxResponses"
                  single-line
                  hide-details
                  solo
                  flat
                  type="number"
                  :value="1"
                />

                <!-- Notifications -->

                <Notification
                  :details="details"
                  @updatedNotification="(n) => {details.notifications = n}"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Forecast -->
          <v-tab-item
            v-if="showForecast"
            value="forecast"
            lazy
          >
            <v-card flat>
              <v-card-text>
                <slot
                  name="eventForecast"
                  v-bind="slotData"
                >
                  <ds-schedule-forecast
                    :schedule="schedule"
                    :day="day"
                    :read-only="readOnly"
                  />
                </slot>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Exclusions -->
          <v-tab-item
            v-if="showExclusions"
            value="exclusions"
            lazy
          >
            <v-card flat>
              <v-card-text>
                <slot
                  name="eventExclusions"
                  v-bind="slotData"
                >
                  <ds-schedule-modifier
                    :description="labels.exclusions"
                    :modifier="schedule.exclude"
                    :read-only="readOnly"
                  />
                </slot>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Inclusions -->
          <v-tab-item
            v-if="showInclusions"
            value="inclusions"
            lazy
          >
            <v-card flat>
              <v-card-text>
                <slot
                  name="eventInclusions"
                  v-bind="slotData"
                >
                  <ds-schedule-modifier
                    :description="labels.inclusions"
                    :modifier="schedule.include"
                    :read-only="readOnly"
                  />
                </slot>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Cancelled -->
          <v-tab-item
            v-if="showCancels"
            value="cancelled"
            lazy
          >
            <v-card flat>
              <v-card-text>
                <slot
                  name="eventCancels"
                  v-bind="slotData"
                >
                  <ds-schedule-modifier
                    :description="labels.cancelled"
                    :modifier="schedule.cancel"
                    :read-only="readOnly"
                  />
                </slot>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <slot
            name="eventTabItemsExtra"
            v-bind="slotData"
          />
        </v-tabs>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Day, Calendar, CalendarEvent, Schedule, Functions as fn } from 'dayspan';
import _ from 'lodash';
import Notification from './Notification';
import mySchedule from './Schedule';

export default {

  name: 'dsEvent',

  components: {
    Notification,
    mySchedule,
  },

  props:
  {
    activities: {
      type: Array,
      required: true,
    },
    targetSchedule:
    {
      required: true,
      type: Schedule
    },

    targetDetails:
    {
      type: Object,
      required: true
    },

    calendarEvent:
    {
      type: CalendarEvent
    },

    calendar:
    {
      type: Calendar
    },

    day:
    {
      type: Day
    },

    readOnly:
    {
      type: Boolean,
      default: false
    },

    labels:
    {
      validate(x) {
        return this.$dsValidate(x, 'labels');
      },
      default() {
        return this.$dsDefaults().labels;
      }
    },

    hasTitle:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasTitle;
      }
    },

    hasCancel:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasCancel;
      }
    },

    hasSave:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasSave;
      }
    },

    hasTabs:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasTabs;
      }
    },

    hasDetails:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasDetails;
      }
    },

    hasForecast:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasForecast;
      }
    },

    hasExclusions:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasExclusions;
      }
    },

    hasInclusions:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasInclusions;
      }
    },

    hasCancelled:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().hasCancelled;
      }
    },

    busyOptions:
    {
      type: Array,
      default() {
        return this.$dsDefaults().busyOptions;
      }
    }
  },

  data: vm => ({
    tab: 'details',
    schedule: new Schedule(),
    details: vm.$dayspan.getDefaultEventDetails()
  }),

  computed:
  {
    title() {
      return this.details.title;
    },
    activityNames() {
      return _.map(this.activities, a => a.name);
    },
    slotData()
    {
      return {
        targetSchedule: this.targetSchedule,
        targetDetails: this.targetDetails,
        schedule: this.schedule,
        details: this.details,
        busyOptions: this.busyOptions,
        day: this.day,
        calendar: this.calendar,
        calendarEvent: this.calendarEvent,
        labels: this.labels,
        readOnly: this.readOnly
      };
    },

    classes()
    {
      return {
        'ds-has-cancel': this.hasCancel,
        'ds-event-small': this.$vuetify.breakpoint.smAndDown
      };
    },

    canSave()
    {
      return this.$dayspan.isValidEvent( this.details, this.schedule, this.calenderEvent );
    },

    repeats()
    {
      return !this.schedule.isSingleEvent();
    },

    showTitle()
    {
      return this.$dayspan.supports.title &&
        this.hasTitle;
    },

    showCancels()
    {
      return this.$dayspan.features.cancel &&
        this.repeats &&
        this.hasCancelled &&
        !this.schedule.cancel.isEmpty();
    },

    showForecast()
    {
      return this.$dayspan.features.forecast &&
        this.repeats &&
        this.hasForecast;
    },

    showExclusions()
    {
      return this.$dayspan.features.exclude &&
        this.repeats &&
        this.hasExclusions &&
        !this.schedule.exclude.isEmpty();
    },

    showInclusions()
    {
      return this.$dayspan.features.include &&
        this.repeats &&
        this.hasInclusions &&
        !this.schedule.include.isEmpty();
    },

    isReadOnly()
    {
      return this.readOnly || this.$dayspan.readOnly;
    }
  },

  watch:
  {
    targetSchedule:
    {
      handler: 'updateSchedule',
      immediate: true
    },

    targetDetails:
    {
      handler: 'updateDetails',
      immediate: true
    },
    title() {
      const res = _.filter(this.activities, a => a.name === this.title);
      this.details.URI = res[0].URI;
    }
  },

  methods:
  {
    save()
    {
      var ev = this.getEvent('save')

      this.$emit('save', ev);

      if (!ev.handled)
      {
        if (ev.target && ev.schedule)
        {
          ev.target.set( ev.schedule );
        }

        if (ev.calendarEvent)
        {
          this.$dayspan.setEventDetails(
            ev.details,
            ev.targetDetails,
            ev.calendarEvent.event,
            ev.calendarEvent
          );

          this.$emit('update', ev);

          this.$emit('event-update', ev.calendarEvent.event);
        }
        else if (ev.create)
        {
          ev.created = this.$dayspan.createEvent( ev.details, ev.schedule );

          if (ev.calendar)
          {
            ev.calendar.addEvent( ev.created );
            ev.added = true;
          }

          this.$emit('create', ev);
        }

        if (ev.calendar && ev.refresh)
        {
          ev.calendar.refreshEvents();
        }

        ev.handled = true;

        if (ev.created)
        {
          this.$emit('event-create', ev.created);
        }
      }

      this.$emit('saved', ev);
    },

    actioned(ev)
    {
      this.$emit('actioned', ev);
    },

    cancel()
    {
      this.$emit('cancel', this.getEvent('cancel'));
    },

    updateSchedule(schedule)
    {
      this.schedule = schedule.clone();
      this.tab = 'details';
    },

    updateDetails(details)
    {
      this.details = this.$dayspan.copyEventDetails( details );
      this.tab = 'details';
    },

    getEvent(type, extra = {})
    {
      return fn.extend({

        type: type,
        day: this.day,
        schedule: this.schedule,
        target: this.targetSchedule,
        details: this.details,
        targetDetails: this.targetDetails,
        calendar: this.calendar,
        calendarEvent: this.calendarEvent,
        handled: false,
        refresh: true,
        create: true,
        added: false,
        $vm: this,
        $element: this.$el

      }, extra);
    }

  }
}
</script>

<style scoped lang="scss">

.ds-calendar-event-title {
  font-size: 18px;
  padding-right: 8px;
  padding-top: 4px;
}

.ds-color-option {
  width: 100%;
  color: white;
  padding: 4px;
}

.ds-button-tall {
  height: 48px;
}

.ds-event {

  &.ds-has-cancel {

    .ds-event-area {
      margin-left: 60px;
    }
  }

  &.ds-event-small {

    &.ds-has-cancel {

      .ds-event-area {
        margin-left: 0px;
      }
      .ds-event-header {
        margin-left: 60px;
        margin-bottom: 58px;
      }
    }

    .ds-event-title {
      position: absolute;
      right: 8px;
      left: -60px;
      top: 60px;
    }

    .ds-event-body {
      clear: both;
    }
  }

  .ds-event-area {
    position: relative;
  }

  .ds-event-actions {
    float: right;

    > * {
      display: inline-block;
    }
  }

  .ds-event-header {
    min-height: 60px;
  }

  .ds-event-cancel {
    position: absolute;
    left: -60px;
  }

  .v-input {
    margin-bottom: 8px;
  }
}

</style>