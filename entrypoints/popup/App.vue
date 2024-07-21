<template>
  <router-link @click="deleteMessage" v-if="!authenticatedCondition" to="/login">{{ message }}</router-link><br>
  <div>
    <router-view @authenticated="authenticated"></router-view>
  </div>
</template>

<script>
import router from './main';

export default {
  name: 'App',
  mounted: function() {
      chrome.runtime.sendMessage(
        {
          type: 'getCookies'
        },
        (response) => {
          this.cookiesDetail = response.cookies[0].value;
          if (this.cookiesDetail){
            this.authenticatedCondition = true;
            router.push('/home');
          } else {
            this.authenticatedCondition = false;
            console.log('aaa');
            router.push('/login');
          }
        }
      );
  },
  data() {
    return {
      message: 'Click here to login',
      access_token: null,
      authenticatedCondition: false,
      cookiesDetail: null
    }
  },
  methods: {
    deleteMessage() {
      this.message = '';
    },
    authenticated(access_token) {
      this.authenticatedCondition = true;
      this.access_token = access_token;
      router.push('/home');
    }
  }
}
</script>


