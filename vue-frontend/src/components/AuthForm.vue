<script>
export default {
  data(){return {form: {login:"", password:""},message:''}},
  methods:{
    async login(){
      let response = await fetch("http://localhost:3000/authWithToken", {method: "POST", headers: {'Content-Type': 'application/json'}, body:JSON.stringify(this.form)})
      if(response.status === 200) {
        let jwt = await response.json()
        localStorage.setItem("token", jwt.jwt)
        let redirect = localStorage.getItem("previousPage")?localStorage.getItem("previousPage"):'/home';
        this.$router.push(redirect);

      }
      else{
        let error = await response.json()
        this.message = error.message;
      }
    }
  }
}
</script>

<template>
<form @submit.prevent = "login">
  <label>login</label>
  <input type = "text" v-model = "form.login">
  <label>password</label>
  <input type = "text" v-model = "form.password">
  <input type = "submit" value="login">
</form>
  <div>{{message}}</div>
</template>

<style scoped>

</style>