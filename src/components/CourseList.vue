<script>
import CourseCard from "./CourseCard.vue"
export default{
  components:{
    CourseCard
  },
  props:{courses:{type : Array, required : true}}
}
</script>

<template>
<div class = "course-list">
  <CourseCard
  v-for="course in courses"
  :key = course.id
  :name = course.name
  :difficulty = course.difficulty
  :length = course.length
  :availabilaty = course.availabilaty
  />
</div>
</template>

<style scoped>

</style>