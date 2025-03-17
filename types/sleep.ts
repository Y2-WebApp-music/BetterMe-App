export type sleepCard = {
  total_time:number
  sleep_date:string
  start_time:string
  end_time:string
  create_by:string
}

export type sleepDatabase = {
  sleep_id:string
  total_time:number
  sleep_date:string
  start_time:string
  end_time:string
  create_by:string
}

export type sleepCardDisplay = {
  sleep_id:string
  total_time: number;
  sleep_date: string | null;
  start_time: string | null;
  end_time: string | null;
  create_by: string;
}