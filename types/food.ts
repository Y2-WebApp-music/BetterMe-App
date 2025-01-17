export type Meal = {
  meal_id:string
  create_by:string
  meal_date:string
  food_name:string
  portion:string
  image_url:string
  calorie:number
  protein :number
  carbs:number
  fat:number
  isAIcreate:boolean
}

export type mealCard = {
  meal_id:string
  create_by:string
  meal_date:string
  food_name:string
  isAIcreate:boolean
}