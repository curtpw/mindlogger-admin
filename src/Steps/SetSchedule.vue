<template>
  <div>
    <div>
      <Calendar
        ref="calendar"
        :activities="activities"
        @change="continueAction"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Calendar from '../Components/CalendarComponents/CalendarMain';
import adminApi from '../Components/Utils/api';

export default {
  name: 'Schedule',
  components: {
    Calendar,
  },
  data: () => ({
    /**
     * colors for the activities, to show on the left hand bar
     */
    colors: ["Orange",  "Deep Purple", "Red",
    "Light Blue","Pink","Glue", "Light Green",
    "Blue Gray", "Green", "Yellow", "Teal", "Brown", "Indigo",
    "Amber", "Cyan", "Gray", "Blue", "Purple", "Lime", "Deep Orange"],
    /**
     * you can always skip scheduling
     */
    readyToContinue: true,
  }),
  computed: {
    /**
     * shortcut to current applet in store
     */
    currentApplet() {
      return this.$store.state.currentApplet;
    },
    /**
     * format the activities in a way that's needed to render the calendar
     */
    activities() {
      if (this.currentApplet) {
        let index = 0;
        return _.map(this.currentApplet.activities, (a, URI) => {
          const name = a['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'];
          const color = this.colors[index]
          index += 1;
          return {
            name,
            color,
            visibility: 1,
            URI,
          };
        });
      }
      return [];
    },
    /**
     * if there is a selected applet, grab its schedule from the store
     */
    schedule() {
      if (this.currentApplet) {
        if (this.$store.state.currentApplet.applet.schedule) {
          return this.$store.state.currentApplet.applet.schedule;
        }
      }
      return {};
    },
  },
  methods: {
    /**
     * on continue, save the schedule.
     * TODO: probably we should save when you hit 'back' as well?
     */
    continueAction() {
      const scheduleForm = new FormData();
      if (this.currentApplet) {
        if (this.currentApplet.schedule) {
          // eslint-disable-next-line
          console.log('saving the schedule');
          const schedule = this.currentApplet.applet.schedule;
          scheduleForm.set('schedule', JSON.stringify(schedule || {}));
          adminApi.setSchedule({
            apiHost: this.$store.state.backend,
            id: this.currentApplet.applet._id,
            token: this.$store.state.auth.authToken.token,
            data: scheduleForm,
          }).then(() => {
          });
        }

      }

    },
  }
}
</script>
