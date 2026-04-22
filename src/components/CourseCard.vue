<script>
export default{
  props:{
    name:{
      type: String
    },
    difficulty:{
      type: String
    },
    length:{
      type: Number
    },
    availabilaty:{
      type: Boolean
    }
  }
}
</script>

<template>
<div class = "information">
  <h2>{{ name }}</h2>
  <p class = "details">
    Difficulty:
    <span v-if="difficulty === 'Easy'"> Easy</span>
    <span v-else-if="difficulty === 'Medium'"> Medium</span>
    <span v-else> Hard</span>
  </p>
  <p class = "Duration">
    {{ length }} hours
  </p>
  <p class = "availability status" v-if="availabilaty">
    available
  </p>
  <p class = "unavailability status" v-else>
    unavailable
  </p>
  <button> Show details</button>
</div>
</template>

<style scoped>
.information{
  border:1px solid #585858;
  max-width: 300px;
  border-radius: 10px;
  padding: 15px 20px;
  background-color: #e43b3b;
  box-shadow: 2px 4px 5px #585858;
  color: #ffffff;
  font-family: "Annai MN";

}
h2{
  font-size: 2em;
  text-align: center;
}
.availability{
  color: #6cff4f;
}
.unavailability{
  color: #aaaaaa;
}
button{
  padding: 10px 15px;
  border-radius: 7px;
  border:none;
  cursor:pointer;
  background: #3BA2E3;
  color: #ffffff;
  margin: 0 30%;
}
</style>