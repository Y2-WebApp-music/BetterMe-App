import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch, Platform } from 'react-native';
import BackButton from '../../../../../components/Back';
import { useEffect, useMemo, useState } from 'react';
import FormInput from '../../../../../components/FormInput';
import PickDateModal from '../../../../../components/modal/PickDateModal';
import { calculateDuration } from '../../../../../components/goal/goalCreateCard';
import { AddIcon, CloseIcon } from '../../../../../constants/icon';
import { useAuth } from '../../../../../context/authContext';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { FlashList } from '@shopify/flash-list';
import WarningModal from '../../../../../components/modal/WarningModal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../../../context/themeContext';
import { addDays } from 'date-fns';

export default function GoalCreatePage() {

  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { user } = useAuth()

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [form, setForm] = useState({
    goal_name:'',
    description:'',
    start_date:today,
    end_date:tomorrow,
    task:[
      {task_name:'',status:false},
    ],
    create_by:user?._id,
    public_goal:true,
  })

  const getGoalDetail = async () => {
    if (id === "blank") {
      return
    } else {
      try {
        const response = await axios.get(`${SERVER_URL}/goal/create/${id}`);
        const data = response.data // homeGoalCardProp[]
  
        console.log('getAllGoal response \n',response.data);
  
        if (data.message === "Goal not found") {
          return
        } else {

          const taskList = data.task.map((task: any) => ({
            ...task,
            status: false,
          }));
          setForm({
            goal_name:data.goal_name,
            description:data.description,
            start_date:new Date(),
            end_date:new Date(),
            task:taskList,
            create_by:user?._id,
            public_goal:data.public_goal,
          })
        }
  
      } catch (error: any){
        console.error(error)
      }
    }
  }

  const [startDateModal,setStartDateModal] = useState(false)
  const updateStartDate = (date: Date) => {
    setForm((prevForm) => ({
      ...prevForm,
      start_date: date,
    }));
  };
  const [endDateModal,setEndDateModal] = useState(false)
  const updateEndDate = (date: Date) => {
    setForm((prevForm) => ({
      ...prevForm,
      end_date: date,
    }));
  };

  const duration = calculateDuration(form.start_date, form.end_date)


  // const borderColor = value || isFocused ? '#1C60DE' : '#E8E8E8'
  // Add Task
  const addTask = () => {
    setForm((prevState) => ({
      ...prevState,
      task: [...prevState.task, { task_name: '', status: false }],
    }));
  };

  // Remove Task
  const removeTask = (index: number) => {
    setForm((prevState) => ({
      ...prevState,
      task: prevState.task.filter((_, i) => i !== index),
    }));
  };

  // Handle Task Input Change
  const handleTaskChange = (index:number, value:string) => {
    const tasks = [...form.task];
    tasks[index].task_name = value;
    setForm((prev) => ({ ...prev, task: tasks }));
};

  const [countdown, setCountdown] = useState(3);
  const [isConfirming, setIsConfirming] = useState(false);
  const [err, setErr] = useState('')
  const [warning, setWarning] = useState(false)
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  const handleCancel = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdown(3);
      setIsConfirming(false);
      console.log('Goal creation canceled');
    }
  };

  const postToDB = async () => {
    const adjustDate = (date: Date) => {
      const newDate = new Date(date);
      newDate.setHours(9, 0, 0, 0);
      return newDate;
    };
    try {
      const response = await axios.post(`${SERVER_URL}/goal/create`,{
        goal_name:form.goal_name,
        description:form.description,
        start_date: adjustDate(form.start_date),
        end_date: adjustDate(form.end_date),
        tasks:form.task,
        public_goal:form.public_goal,
        create_by:user?._id
      });
      const data = response.data;
      console.log('=============== ::: userData ::: ===============\n',data);

      if (data.message === "At least 1 task is required to create a goal") {
        return setErr('At least 1 task is required to create a goal')
      }

      router.replace(`home/goal/${data.goal._id}`)

    } catch (error) {
      console.error('Can not create goal:', error);
    }
  }

  const handleCreateGoal = async () => {

    if ( form.goal_name != ''){
      if (form.task.length === 0) {
        console.log('At least one task is required');
        setWarning(true)
        setErr('At least one task is required');
        return
      }
      if (form.task.some(task => task.task_name === '')){
        console.log('Task at least one is empty please complete it');
        setWarning(true)
        setErr('Task at least one is empty please complete it');
        return
      }
      if (form.end_date.toDateString() < form.start_date.toDateString()) {
        console.log('Date is false');
        setWarning(true)
        setErr('Can not end date less than start date.');
        return
      }
      if (form.end_date.toDateString() === form.start_date.toDateString()) {
        console.log('Date in Same Day');
        setWarning(true)
        setErr('The start and end dates cannot be set to the same date.');
        return
      }

      console.log('form.end_date',form.end_date);
      console.log('form.start_date',form.start_date);
      

      let counter = 3;
      setCountdown(counter)
      setIsConfirming(true);

      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);

        if (counter <= 0) {
          clearInterval(interval);
          postToDB()
        }
      }, 1000);

      setCountdownInterval(interval)
    } else {
      setErr('goal name is empty')
      setWarning(true)
      console.log('goal_name is empty');
    }
  }

  useMemo(()=>{
    console.log('Goal ID :',id);
    getGoalDetail()
  },[id])

  return (
    <SafeAreaView style={{backgroundColor:colors.background}} className="w-full h-full justify-center items-center font-noto">
      {!isConfirming?(
      <>
      <View className='w-[92%] mt-4'>
        <View className='w-full'>
          <View className='max-w-[14vw]'>
            <BackButton goto={'/home/createGoal'}/>
          </View>
        </View>
        <View className='mt-2'>
          <View className='flex flex-row gap-2 items-center'>
            <View className='grow'>
              <Text className='text-subTitle text-primary font-notoMedium'>Create Goal</Text>
            </View>
            <View>
              <TouchableOpacity onPress={handleCreateGoal} className=' bg-primary flex-row gap-2 p-2 px-6 justify-center items-center rounded-full'>
                <Text className='text-heading2 text-white font-notoMedium'>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
          className='w-[92%] h-auto'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:4}}
          showsVerticalScrollIndicator={false}
        >
          <View className='w-full flex-col gap-2'>
            <FormInput
              name='Goal name'
              value={form.goal_name}
              handleChange={(e:string)=>setForm({ ...form,goal_name: e})}
              keyboardType="default"
            />
            <FormInput
              name='Description'
              value={form.description}
              handleChange={(e:string)=>setForm({ ...form,description: e})}
              keyboardType="default"
            />


            <View className='mt-4'>
              <View className='flex-row'>
                <Text style={{color:colors.subText}} className='grow '>Date</Text>
                <Text style={{color:colors.subText}} >{duration}</Text>
              </View>
              <View className='flex-row gap-3 items-end justify-center'>
                <View className='grow  mt-2 items-center' style={{marginTop: 10}}>
                  <Text style={{color:colors.subText}} className=' text-detail'>start</Text>
                  <TouchableOpacity
                    onPress={()=>{setStartDateModal(true)}}
                    className='w-full h-[5vh] px-4 p-2 flex justify-center border border-primary rounded-normal'
                  >
                    <Text className='flex-1 text-primary text-center font-notoMedium text-heading3'>
                      {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.start_date)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={{color:colors.subText}} className='text-title font-noto '>-</Text>
                <View className='grow mt-2 items-center' style={{marginTop: 10}}>
                  <Text style={{color:colors.subText}} className=' text-detail'>end</Text>
                  <TouchableOpacity
                    onPress={()=>{setEndDateModal(true)}}
                    className='w-full h-[5vh] px-4 p-2 flex justify-center border border-primary rounded-normal'
                  >
                    <Text className='flex-1 text-primary text-center font-notoMedium text-heading3'>
                      {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.end_date)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {Platform.OS === "android" ?(
                    startDateModal &&
                    <RNDateTimePicker
                      display="spinner"
                      mode="date"
                      value={form.start_date}
                      minimumDate={today}
                      maximumDate={new Date(new Date().setDate(new Date().getDate() + 10000))}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setStartDateModal(!startDateModal);
                          updateStartDate(selectedDate);
                        }
                      }}
                      style={{}}
                      locale="en-Gn"
                      themeVariant='light'
                    />
                  ):(
              <PickDateModal value={form.start_date} isOpen={startDateModal} setIsOpen={setStartDateModal} setDate={updateStartDate} maximumDate={false} minimumDate={true}/>
                  )}
              {Platform.OS === "android" ?(
                    endDateModal &&
                    <RNDateTimePicker
                      display="spinner"
                      mode="date"
                      value={form.end_date}
                      minimumDate={tomorrow}
                      maximumDate={new Date(new Date().setDate(new Date().getDate() + 10000))}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setEndDateModal(!endDateModal);
                          updateEndDate(selectedDate);
                        }
                      }}
                      style={{}}
                      locale="en-Gn"
                      themeVariant='light'
                    />
                  ):(
              <PickDateModal value={form.end_date} isOpen={endDateModal} setIsOpen={setEndDateModal} setDate={updateEndDate} maximumDate={false} minimumDate={true}/>
                  )}
              <WarningModal
                title={'Please complete detail'}
                detail={err}
                isOpen={warning}
                setIsOpen={()=>setWarning(!warning)}
              />

              <View className='mt-4 flex-col gap-2 pb-10'>
                <Text style={{color:colors.text}}>Task</Text>

                <FlashList
                    data={form.task}
                    renderItem={({ item, index }) =>
                    <View key={index} style={{marginBottom:12}} className="flex-row gap-2 items-center">
                      <View className="rounded-full h-3 w-3 bg-primary"></View>
                      <View
                        className="grow flex justify-center border focus:border-primary rounded-normal"
                        style={{ height: 44, borderColor:colors.gray }}
                      >
                        <TextInput
                          className="flex-1 px-2 text-primary text-heading2 flex-wrap"
                          style={{
                            height: 40,
                            width: '100%',
                            textAlignVertical: 'center',
                          }}
                          placeholder="Task name..."
                          placeholderTextColor={colors.darkGray}
                          multiline={true}
                          numberOfLines={4}
                          value={item.task_name}
                          onChangeText={(value) => handleTaskChange(index, value)}
                          onContentSizeChange={(e) => {
                            const height = Math.min(4 * 20, e.nativeEvent.contentSize.height);
                            e.target.setNativeProps({ style: { height } });
                          }}
                        />
                      </View>
                      <TouchableOpacity onPress={() => removeTask(index)}>
                        <CloseIcon width={26} height={26} color={colors.darkGray} />
                      </TouchableOpacity>
                    </View>
                    }
                    estimatedItemSize={200}
                  />

                <View className="flex-1 justify-center items-center">
                  <TouchableOpacity
                    onPress={addTask}
                    className="bg-primary flex-row gap-2 p-1 px-4 justify-center items-center rounded-full"
                  >
                    <Text className="text-heading3 text-white font-notoMedium">
                      Add Task
                    </Text>
                    <AddIcon width={24} height={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className='min-h-24 min-w-32 p-4 flex-col gap-2 pb-20'>
              <TouchableOpacity onPress={()=>{setForm((prev) => ({...prev,public_goal: !prev.public_goal}))}} style={{borderColor:colors.gray}} className='p-2 px-4 border rounded-normal flex-row gap-2 justify-center items-center'>
                <Switch
                  trackColor={{false: '#fff', true: '#0DC47C'}}
                  thumbColor={form.public_goal ? '#FFF' : '#fff'}
                  ios_backgroundColor="#FBFFFF"
                  onValueChange={()=>{setForm((prev) => ({...prev,public_goal: !prev.public_goal}))}}
                  value={form.public_goal}
                />
                <Text style={{color:colors.subText}} className='font-noto text-heading3 '>public this goal</Text>
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
        </>
        ):(
          <View className='flex-1 justify-center items-center'>
            <Text className='font-notoMedium text-title text-primary'>{countdown}</Text>
            <Text className='font-notoMedium text-subTitle animate-pulse text-primary'>Creating</Text>
            <TouchableOpacity onPress={handleCancel} style={{backgroundColor:colors.nonFocus}} className='mt-12 p-1 px-4 rounded-full justify-center items-center'>
              <Text className='text-white font-noto text-heading2'>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
    </SafeAreaView>
  )
}