<template>
  <div class="ds-expand ds-calendar-app">
    <v-content class="ds-expand">
      <v-container
        fluid
        class="ds-calendar-container"
        style="height: 100%;"
      >
        <!-- top controls -->
        <div>
          <v-tooltip bottom>
            <v-btn
              slot="activator"
              class="ds-skinny-button"
              depressed
              :icon="$vuetify.breakpoint.smAndDown"
              @click="setToday"
            >
              <span v-if="$vuetify.breakpoint.mdAndUp">{{ labels.today }}</span>
              <v-icon v-else>
                {{ labels.todayIcon }}
              </v-icon>
            </v-btn>
            <span>{{ todayDate }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <v-btn
              slot="activator"
              icon
              depressed
              class="ds-light-forecolor ds-skinny-button"
              @click="prev"
            >
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <span>{{ prevLabel }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <v-btn
              slot="activator"
              icon
              depressed
              class="ds-light-forecolor ds-skinny-button"
              @click="next"
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
            <span>{{ nextLabel }}</span>
          </v-tooltip>

          <h1
            class="title ds-light-forecolor"
            style="display: inline;"
          >
            {{ summary }}
          </h1>

          <span style="text-align: right">
            <v-menu>
              <v-btn
                slot="activator"
                flat
              >
                {{ currentType.label }}
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile
                  v-for="type in types"
                  :key="type.id"
                  @click="currentType = type"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ type.label }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>{{ type.shortcut }}</v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-menu>
          </span>
        </div>

        <v-layout
          row
          wrap
          style="height: calc(100% - 200px);"
        >
          <!-- The activities in the applet -->
          <v-flex xs2>
            <div>
              <div class="px-3">
                <h3 class="mb-3 mt-3 pb-3">
                  Activities
                </h3>
                <div
                  v-for="act in activities"
                  :key="act.name"
                  class="mt-3 mb-3"
                >
                  <ActivitySidebar :activity="act" />
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs10>
            <!-- The calendar -->
            <ds-gestures
              @swipeleft="next"
              @swiperight="prev"
            >
              <div
                v-if="currentType.schedule"
                class="ds-expand"
              >
                <slot
                  name="calendarAppAgenda"
                  v-bind="{$scopedSlots, $listeners, calendar, add, edit, viewDay}"
                >
                  <ds-agenda
                    v-bind="{$scopedSlots}"
                    :read-only="readOnly"
                    :calendar="calendar"
                    v-on="$listeners"
                    @add="add"
                    @edit="edit"
                    @view-day="viewDay"
                  />
                </slot>
              </div>

              <div
                v-else
                class="ds-expand"
              >
                <slot
                  name="calendarAppCalendar"
                  v-bind="{$scopedSlots, $listeners, calendar, add, addAt, edit, viewDay, handleAdd, handleMove}"
                >
                  <ds-calendar
                    ref="calendar"
                    v-bind="{$scopedSlots}"
                    :calendar="calendar"
                    :read-only="readOnly"
                    v-on="$listeners"
                    @add="add"
                    @add-at="addAt"
                    @edit="edit"
                    @view-day="viewDay"
                    @added="handleAdd"
                    @moved="handleMove"
                  />
                </slot>
              </div>
            </ds-gestures>
          </v-flex>
        </v-layout>

        <!-- dialogs and popups -->
        <slot
          name="calendarAppEventDialog"
          v-bind="{$scopedSlots, $listeners, calendar, eventFinish}"
        >
          <event-dialog
            ref="eventDialog"
            v-bind="{$scopedSlots}"
            :calendar="calendar"
            :read-only="readOnly"
            :activities="activities"
            v-on="$listeners"
            @saved="eventFinish"
            @actioned="eventFinish"
          />
        </slot>

        <slot
          name="calendarAppOptions"
          v-bind="{optionsVisible, optionsDialog, options, chooseOption}"
        >
          <v-dialog
            ref="optionsDialog"
            v-model="optionsVisible"
            v-bind="optionsDialog"
            :fullscreen="$dayspan.fullscreenDialogs"
          >
            <v-list>
              <template v-for="option in options">
                <v-list-tile
                  :key="option.text"
                  @click="chooseOption( option )"
                >
                  {{ option.text }}
                </v-list-tile>
              </template>
            </v-list>
          </v-dialog>
        </slot>

        <slot
          name="calendarAppPrompt"
          v-bind="{promptVisible, promptDialog, promptQuestion, choosePrompt}"
        >
          <v-dialog
            ref="promptDialog"
            v-model="promptVisible"
            v-bind="promptDialog"
          >
            <v-card>
              <v-card-title>{{ promptQuestion }}</v-card-title>
              <v-card-actions>
                <v-btn
                  color="primary"
                  flat
                  @click="choosePrompt( true )"
                >
                  {{ labels.promptConfirm }}
                </v-btn>
                <v-spacer />
                <v-btn
                  color="secondary"
                  flat
                  @click="choosePrompt( false )"
                >
                  {{ labels.promptCancel }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </slot>

        <slot
          name="calendarAppAdd"
          v-bind="{allowsAddToday, addToday}"
        >
          <v-fab-transition v-if="!readOnly">
            <v-btn
              v-model="allowsAddToday"
              class="ds-add-event-today"
              color="primary"
              fixed
              bottom
              right
              fab
              style="bottom: 70px; right: 40px;"
              @click="addToday"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-fab-transition>
        </slot>

        <slot
          name="containerInside"
          v-bind="{events, calendar}"
        />
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { Sorts, Calendar, Op } from 'dayspan';

import EventDialog from './EventDialog';
import ActivitySidebar from './ActivitySidebar';

export default {

  name: 'dsCalendarApp',

  components: {
    EventDialog,
    ActivitySidebar,
  },

  props:
  {
    activities: {
      type: Array,
    },
    events:
    {
      type: Array
    },
    calendar:
    {
      type: Calendar,
      default() {
        return Calendar.months();
      }
    },
    readOnly:
    {
      type: Boolean,
      default: false
    },
    types:
    {
      type: Array,
      default() {
        return this.$dsDefaults().types;
      }
    },
    allowsAddToday:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().allowsAddToday;
      }
    },
    formats:
    {
      validate(x) {
        return this.$dsValidate(x, 'formats');
      },
      default() {
        return this.$dsDefaults().formats;
      }
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
    styles:
    {
      validate(x) {
        return this.$dsValidate(x, 'styles');
      },
      default() {
        return this.$dsDefaults().styles;
      }
    },
    optionsDialog:
    {
      validate(x) {
        return this.$dsValidate(x, 'optionsDialog');
      },
      default() {
        return this.$dsDefaults().optionsDialog;
      }
    },
    promptDialog:
    {
      validate(x) {
        return this.$dsValidate(x, 'promptDialog');
      },
      default() {
        return this.$dsDefaults().promptDialog;
      }
    }
  },

  // eslint-disable-next-line
  data: vm => ({
    drawer: null,
    optionsVisible: false,
    options: [],
    promptVisible: false,
    promptQuestion: '',
    promptCallback: null
  }),

  computed:
  {
    currentType:
    {
      get()
      {
        return this.types.find((type) =>
          type.type === this.calendar.type &&
          type.size === this.calendar.size
        ) || this.types[0];
      },
      set(type)
      {
        this.rebuild(undefined, true, type);
      }
    },

    summary()
    {
      let small = this.$vuetify.breakpoint.xs;

      if (small)
      {
        return this.calendar.start.format( this.formats.xs );
      }

      let large = this.$vuetify.breakpoint.mdAndUp;

      return this.calendar.summary(false, !large, false, !large);
    },

    todayDate()
    {
      return this.$dayspan.today.format( this.formats.today );
    },

    nextLabel()
    {
      return this.labels.next( this.currentType );
    },

    prevLabel()
    {
      return this.labels.prev( this.currentType );
    },

    toolbarStyle()
    {
      let large = this.$vuetify.breakpoint.lgAndUp;

      return large ? this.styles.toolbar.large : this.styles.toolbar.small;
    },

    hasCreatePopover()
    {
      return !!this.$scopedSlots.eventCreatePopover;
    },

    canAddDay()
    {
      return this.$dayspan.features.addDay && !this.readOnly && !this.$dayspan.readOnly;
    },

    canAddTime()
    {
      return this.$dayspan.features.addTime && !this.readOnly && !this.$dayspan.readOnly;
    }
  },

  watch:
  {
    'events': 'applyEvents',
    'calendar': 'applyEvents'
  },

  mounted()
  {
    if (!this.$dayspan.promptOpen)
    {
      this.$dayspan.promptOpen = (question, callback) => {
        this.promptVisible = false;
        this.promptQuestion = question;
        this.promptCallback = callback;
        this.promptVisible = true;
      };
    }
  },

  methods:
  {
    setState(state)
    {
      state.eventSorter = state.listTimes
        ? Sorts.List([Sorts.FullDay, Sorts.Start])
        : Sorts.Start;

      this.calendar.set( state );

      this.triggerChange();
    },

    applyEvents()
    {
      if (this.events)
      {
        this.calendar.removeEvents();
        this.calendar.addEvents(this.events);
      }
    },

    isType(type, aroundDay)
    {
      let cal = this.calendar;

      return (cal.type === type.type && cal.size === type.size &&
          (!aroundDay || cal.span.matchesDay(aroundDay)));
    },

    rebuild (aroundDay, force, forceType)
    {
      let type = forceType || this.currentType || this.types[ 2 ];

      if (this.isType( type, aroundDay ) && !force)
      {
        return;
      }

      let input = {
        type: type.type,
        size: type.size,
        around: aroundDay,
        eventsOutside: true,
        preferToday: false,
        listTimes: type.listTimes,
        updateRows: type.updateRows,
        updateColumns: type.listTimes,
        fill: !type.listTimes,
        otherwiseFocus: type.focus,
        repeatCovers: type.repeat
      };

      this.setState( input );
    },

    next()
    {
      this.calendar.unselect().next();

      this.triggerChange();
    },

    prev()
    {
      this.calendar.unselect().prev();

      this.triggerChange();
    },

    setToday()
    {
      this.rebuild( this.$dayspan.today );
    },

    viewDay(day)
    {
      this.rebuild( day, false, this.types[ 0 ] );
    },

    edit(calendarEvent)
    {
      let eventDialog = this.$refs.eventDialog;

      eventDialog.edit(calendarEvent);
    },

    editPlaceholder(createEdit)
    {
      let placeholder = createEdit.calendarEvent;
      let details = createEdit.details;
      let eventDialog = this.$refs.eventDialog;
      let calendar = this.$refs.calendar;

      eventDialog.addPlaceholder( placeholder, details );
      eventDialog.$once('close', calendar.clearPlaceholder);
    },

    add(day)
    {
      if (!this.canAddDay)
      {
        return;
      }

      let eventDialog = this.$refs.eventDialog;
      let calendar = this.$refs.calendar;
      let useDialog = !this.hasCreatePopover;

      calendar.addPlaceholder( day, true, useDialog );

      if (useDialog)
      {
        eventDialog.add(day);
        eventDialog.$once('close', calendar.clearPlaceholder);
      }
    },

    addAt(dayHour)
    {
      if (!this.canAddTime)
      {
        return;
      }

      let eventDialog = this.$refs.eventDialog;
      let calendar = this.$refs.calendar;
      let useDialog = !this.hasCreatePopover;
      let at = dayHour.day.withHour( dayHour.hour );

      calendar.addPlaceholder( at, false, useDialog );

      if (useDialog)
      {
        eventDialog.addAt(dayHour.day, dayHour.hour);
        eventDialog.$once('close', calendar.clearPlaceholder);
      }
    },

    addToday()
    {
      if (!this.canAddDay)
      {
        return;
      }

      let eventDialog = this.$refs.eventDialog;
      let calendar = this.$refs.calendar;
      let useDialog = !this.hasCreatePopover || !calendar;

      let day = this.$dayspan.today;

      if (!this.calendar.filled.matchesDay( day ))
      {
        let first = this.calendar.days[ 0 ];
        let last = this.calendar.days[ this.calendar.days.length - 1 ];
        let firstDistance = Math.abs( first.currentOffset );
        let lastDistance = Math.abs( last.currentOffset );

        day = firstDistance < lastDistance ? first: last;
      }

      calendar && calendar.addPlaceholder( day, true, useDialog );

      if (useDialog)
      {
        eventDialog.add( day );

        calendar && eventDialog.$once('close', calendar.clearPlaceholder);
      }
    },

    handleAdd(addEvent)
    {
      let eventDialog = this.$refs.eventDialog;
      let calendar = this.$refs.calendar;

      addEvent.handled = true;

      if (!this.hasCreatePopover)
      {
        if (addEvent.placeholder.fullDay)
        {
          eventDialog.add(addEvent.span.start, addEvent.span.days(Op.UP));
        }
        else
        {
          eventDialog.addSpan(addEvent.span);
        }

        eventDialog.$once('close', addEvent.clearPlaceholder);
      }
      else
      {
        calendar.placeholderForCreate = true;
      }
    },

    handleMove(moveEvent)
    {
      let calendarEvent = moveEvent.calendarEvent;
      let target = moveEvent.target;
      let targetStart = target.start;
      let sourceStart = calendarEvent.time.start;
      let schedule = calendarEvent.schedule;
      let options = [];

      moveEvent.handled = true;

      let callbacks = {
        cancel: () => {
          moveEvent.clearPlaceholder()
        },
        single: () => {
          calendarEvent.move( targetStart );
          this.eventsRefresh();
          moveEvent.clearPlaceholder();

          this.$emit('event-update', calendarEvent.event);
        },
        instance: () => {
          calendarEvent.move( targetStart );
          this.eventsRefresh();
          moveEvent.clearPlaceholder();

          this.$emit('event-update', calendarEvent.event);
        },
        duplicate: () => {
          schedule.setExcluded( targetStart, false );
          this.eventsRefresh();
          moveEvent.clearPlaceholder();

          this.$emit('event-update', calendarEvent.event);
        },
        all: () => {
          schedule.moveTime( sourceStart.asTime(), targetStart.asTime() );
          this.eventsRefresh();
          moveEvent.clearPlaceholder();

          this.$emit('event-update', calendarEvent.event);
        }
      };

      options.push({
        text: this.labels.moveCancel,
        callback: callbacks.cancel
      });

      if (schedule.isSingleEvent())
      {
        options.push({
          text: this.labels.moveSingleEvent,
          callback: callbacks.single
        });

        if (this.$dayspan.features.moveDuplicate)
        {
          options.push({
            text: this.labels.moveDuplicate,
            callback: callbacks.duplicate
          });
        }
      }
      else
      {
        if (this.$dayspan.features.moveInstance)
        {
          options.push({
            text: this.labels.moveOccurrence,
            callback: callbacks.instance
          });
        }

        if (this.$dayspan.features.moveDuplicate)
        {
          options.push({
            text: this.labels.moveDuplicate,
            callback: callbacks.duplicate
          });
        }

        if (this.$dayspan.features.moveAll &&
            !schedule.isFullDay() &&
            targetStart.sameDay(sourceStart))
        {
          options.push({
            text: this.labels.moveAll,
            callback: callbacks.all
          });
        }
      }

      this.options = options;
      this.optionsVisible = true;
    },

    chooseOption(option)
    {
      if (option)
      {
        option.callback();
      }

      this.optionsVisible = false;
    },

    choosePrompt(yes)
    {
      this.promptCallback( yes );
      this.promptVisible = false;
    },

    // eslint-disable-next-line
    eventFinish(ev)
    {
      this.triggerChange();
    },

    eventsRefresh()
    {
      this.calendar.refreshEvents();

      this.triggerChange();
    },

    triggerChange()
    {
      // eslint-disable-next-line
      console.log('triggering change', this.calendar);
      this.$emit('change', {
        calendar: this.calendar
      });
    }
  }
}
</script>

<style lang="scss">

.ds-app-calendar-toolbar {

  .v-toolbar__content {
    border-bottom: 1px solid rgb(224, 224, 224);
  }
}

.ds-skinny-button {
  margin-left: 2px !important;
  margin-right: 2px !important;
}

.ds-expand {
  width: 100%;
  height: 100%;
}

.ds-calendar-container {
  padding: 0px !important;
  position: relative;
}

.v-btn--floating.ds-add-event-today {

  .v-icon {
    width: 24px;
    height: 24px;
  }
}

</style>
