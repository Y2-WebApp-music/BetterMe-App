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
  createByAI:boolean
}

export type mealCard = {
  meal_id:string
  calorie:number
  meal_date:string
  food_name:string
  createByAI:boolean
}


export type MealAi = {
  Menu:string
  Calorie:number
  Protein:number
  Carbs:number
  Fat:number
}



export const mealListDummy = [
  {
    meal_id:'1',
    food_name:'กะเพราไก่',
    meal_date:new Date().toDateString(),
    calorie:273,
    createByAI:true,
  },
  {
    meal_id:'2',
    food_name:'ไก่ย่าง ข้าวเหนียว',
    meal_date:new Date().toDateString(),
    calorie:234,
    createByAI:false,
  },
]

export type weekMealSummary = {
  date:string
  total_calorie:number
  protein:number
  carbs:number
  fat:number
  meal: mealCard[]
}