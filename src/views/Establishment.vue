<template>
  <div class="c-establishment">
    <div v-if="establishment" class="c-establishment__content">
      <h1>{{ establishment.BusinessName }}</h1>
      <h4><a :href="map">{{ address }}</a></h4>
      <h1 :class="'u-badge u-badge-' + ratingColor">Hygiene Rating: {{ rating }}</h1>
      <h1>{{ ratingMessage }}</h1>
      <br />
      <router-link to="/">&larr; Check somewhere else</router-link>
    </div>
    <div v-if="this.$store.state.establishment.error" class="c-establishment__error">
      <h1>Oops ;-(</h1>
      <h3>We couldn't find a rating... <i>no food for us.</i></h3>
      <router-link to="/">&larr; Try somewhere else</router-link>
    </div> 
  </div>
</template>

<script>
export default {
  computed: {
    address() {
      const { AddressLine1, AddressLine2, AddressLine3, PostCode } = this.$store.state.establishment.data;

      const address = [];

      if (AddressLine1 !== '') {
        address.push(AddressLine1);
      }

      if (AddressLine2 !== '') {
        address.push(AddressLine2);
      }

      if (AddressLine3 !== '') {
        address.push(AddressLine3);
      }

      if (PostCode !== '') {
        address.push(PostCode);
      }

      return address.join(', ');
    },
    establishment() {
      return this.$store.state.establishment.data;
    },
    map() {
      const { latitude, longitude } = this.$store.state.establishment.data.geocode;

      return `https://maps.google.com/?q=${latitude},${longitude}`;
    },
    rating() {
      const { RatingValue } = this.$store.state.establishment.data;

      return !isNaN(RatingValue) ? RatingValue : 'Unknown';
    },
    ratingColor() {
      const { RatingValue } = this.$store.state.establishment.data;
      const rating = parseInt(RatingValue, 10);

      if (rating === 5) {
        return 'green';
      }

      if (rating >= 3) {
        return 'amber';
      }

      if (rating <= 2) {
        return 'red';
      }

      return 'grey';
    },
    ratingMessage() {
      const { RatingValue } = this.$store.state.establishment.data;
      const rating = parseInt(RatingValue, 10);

      if (rating === 5) {
        return 'Delicious! Everything is clean as a whistle!';
      }

      if (rating >= 3) {
        return 'You\'ll probably be okay...';
      }

      if (rating === 2) {
        return 'What doesn\'t kill you, makes you stronger.';
      }

      if (rating <= 1) {
        return 'NOPE. JUST, NO.';
      }

      return 'Go forth, into the unknown.';
    },
    search() {
      return this.$store.state.establishment.query;
    },
  },

  created() {
    if (this.$store.state.establishment.data) {
      return;
    }

    this.$store.dispatch('getEstablishment', { id: this.$route.params.id });
  },
  destroyed() {
    this.$store.dispatch('clearError');
  },
};
</script>

<style lang="scss">
@import '../scss/variables';

h1 {
  margin-bottom: 5px;
  padding: 0 5px;
}

h4 {
  color: $ash;
  margin-top: 0;
  
  a {
    color: $ash;
    text-decoration: none;
  }
}

.c-establishment {
  display: table;
  height: 100vh;
  width: 100%;
}

.c-establishment__content, .c-establishment__error {
  display: table-cell;
  padding: 10px;
  text-align: center;
  vertical-align: middle;
}

.c-establishment__error {
  a {
    text-decoration: none;
  }

  h3 {
    margin-bottom: 30px;
  }
}

.u-badge {
  display: inline-block;
  margin: 0 auto;
}
</style>
