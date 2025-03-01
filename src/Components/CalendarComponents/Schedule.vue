<template>
  <div
    class="ds-schedule"
    :class="classes"
  >
    <div
      v-if="showRange"
      class="ds-schedule-span"
    >
      <!-- Span -->

      <slot
        name="scheduleSpan"
        v-bind="{schedule, day}"
      >
        <v-checkbox
          v-model="schedule.relative"
          label="relative to first response"
        >
          <template slot="label">
            <div>
              Relative to first response
              <p>
                <small>
                  if this is selected, all dates and times entered below
                  will be relative to when the user first responds
                </small>
              </p>
            </div>
          </template>
        </v-checkbox>

        <ds-schedule-span
          :schedule="schedule"
          :day="day"
          :read-only="readOnly"
        />
      </slot>
    </div>


    <div class="ds-schedule-type-line">
      <div class="ds-schedule-type">
        <!-- Type -->
        <slot
          name="scheduleType"
          v-bind="{schedule, day, setType, custom}"
        >
          <ds-schedule-type
            :day="day"
            :schedule="schedule"
            :read-only="readOnly"
            @change="setType"
            @custom="custom"
          />
        </slot>
      </div>
    </div>

    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <!-- Times -->
        <slot
          name="scheduleTimes"
          v-bind="{schedule, day}"
        >
          <ds-schedule-times
            :schedule="schedule"
            :read-only="readOnly"
          />
        </slot>
      </v-flex>
      <v-flex
        v-if="!isReadOnly"
        xs12
      >
        <slot
          name="scheduleFooter"
          v-bind="{schedule, day}"
        />

        <!-- Custom -->
        <ds-schedule-type-custom-dialog
          ref="customScheduler"
          v-bind="{$scopedSlots}"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Day, Schedule } from 'dayspan';


export default {

  name: 'dsSchedule',

  props:
  {
    schedule:
    {
      required: true,
      type: Schedule
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

    allowsRange:
    {
      type: Boolean,
      default() {
        return this.$dsDefaults().allowsRange;
      }
    }
  },

  // eslint-disable-next-line
  data: vm => ({

  }),

  computed:
  {
    showRange()
    {
      return this.allowsRange && !this.schedule.isSingleEvent();
    },

    classes()
    {
      return {
        'ds-schedule-small': this.$vuetify.breakpoint.smAndDown
      };
    },

    isReadOnly()
    {
      return this.readOnly || this.$dayspan.readOnly;
    }
  },

  methods:
  {
    custom()
    {
      this.$refs.customScheduler.edit(this.schedule, this.day);
    },

    setType(type)
    {
      this.$emit('type', type);
    }
  }
}
</script>

<style lang="scss">

.ds-schedule {

  .ds-schedule-type {
    max-width: 436px;
    padding-right: 8px;
  }

  &.ds-schedule-small {

    .ds-schedule-type {
      width: 100%;
    }
  }

}

</style>
