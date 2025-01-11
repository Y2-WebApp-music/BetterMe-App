import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch } from 'react-native';
import BackButton from '../../../../../components/Back';
import { useState } from 'react';
import FormInput from '../../../../../components/FormInput';
import PickDateModal from '../../../../../components/modal/PickDateModal';
import { calculateDuration } from '../../../../../components/goal/goalCreateCard';
import { AddIcon, CloseIcon } from '../../../../../constants/icon';
import { useAuth } from '../../../../../context/authContext';
import axios from 'axios';
import { SERVER_URL } from '@env';

export default function GoalCreatePage() {

  const { id } = useLocalSearchParams();
  const { user } = useAuth()

  const [form, setForm] = useState({
    goal_name:'',
    description:'',
    start_date:new Date(),
    end_date:new Date(),
    task:[
      {
        task_name:'',
        status:false
      },
    ],
    create_by:user?.uid,
    // create_by:{
    //   firebase_uid:user?.uid,
    //   username:user?.displayName,
    // },
    public_goal:true,
  })

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
  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...form.task];
    updatedTasks[index].task_name = value;
    setForm({ ...form, task: updatedTasks });
  };

  const [countdown, setCountdown] = useState(3);
  const [isConfirming, setIsConfirming] = useState(false);
  const [err, setErr] = useState('')
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);

  const handleCreateGoal = async () => {

    if ( form.goal_name != '' && form.description != ''){
      if (form.task.length === 0) {
        console.log('At least one task is required');
        return setErr('At least one task is required');
      }
      if (form.task.some(task => task.task_name === '')){
        console.log('Task at least one is empty please complete it');
        return setErr('Task at least one is empty please complete it');
      }
      console.log('Will post to DB');
      console.log('=======> form Data <======= \n',form);


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
      console.log('goal_name or description is empty');
    }
  }

  const handleCancel = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdown(3);
      setIsConfirming(false);
      console.log('Goal creation canceled');
    }
  };

  const postToDB = async () => {
    try {
      // const response = await axios.post(`${SERVER_URL}/goal/create`,{
      //   goal_name:form.goal_name,
      //   description:form.description,
      //   start_date:form.start_date,
      //   end_date:form.end_date,
      //   create_by:form.create_by,
      //   tasks:form.task,
      //   public_goal:form.public_goal
      // });
      // const data = response.data;
      // console.log('userData : ',data);

      // if (data.message === "At least 1 task is required to create a goal") {
      //   return setErr('At least 1 task is required to create a goal')
      // }

      router.replace(`home/goal/[id]`)

    } catch (error) {
      console.error('Can not create goal:', error);
    }
  }

  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto">
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
          <View className='w-full flex-col'>
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
                <Text className='grow text-subText'>Date</Text>
                <Text className='text-subText'>{duration}</Text>
              </View>
              <View className='flex-row gap-3 items-end justify-center'>
                <View className='mt-2 items-center' style={{marginTop: 10}}>
                  <Text className='text-subText text-detail'>start</Text>
                  <TouchableOpacity
                    onPress={()=>{setStartDateModal(true)}}
                    className='w-full h-[5vh] px-4 p-2 flex justify-center border border-primary rounded-normal'
                  >
                    <Text className='flex-1 text-primary text-center font-notoMedium text-heading3'>
                      {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.start_date)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className='text-title font-noto text-subText'>-</Text>
                <View className='mt-2 items-center' style={{marginTop: 10}}>
                  <Text className='text-subText text-detail'>end</Text>
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
              <PickDateModal value={form.start_date} isOpen={startDateModal} setIsOpen={setStartDateModal} setDate={updateStartDate} maximumDate={false}/>
              <PickDateModal value={form.end_date} isOpen={endDateModal} setIsOpen={setEndDateModal} setDate={updateEndDate} maximumDate={false}/>

              <View className='mt-2 flex-col gap-2 pb-20'>
                <Text>Task</Text>

                {form.task.map((task, index) => (
                  <View key={index} className="flex-row gap-1 items-center">
                    <View className="rounded-full h-3 w-3 bg-primary"></View>
                    <View
                      className="grow flex justify-center border border-gray focus:border-primary rounded-normal"
                      style={{ height: 40 }}
                    >
                      <TextInput
                        className="flex-1 px-2 text-primary text-heading2 flex-wrap"
                        style={{
                          height: 40,
                          width: '100%',
                          textAlignVertical: 'center',
                        }}
                        placeholder="Task name..."
                        placeholderTextColor="#CFCFCF"
                        multiline={true}
                        numberOfLines={4}
                        value={task.task_name}
                        onChangeText={(value) => handleTaskChange(index, value)}
                        onContentSizeChange={(e) => {
                          const height = Math.min(4 * 20, e.nativeEvent.contentSize.height);
                          e.target.setNativeProps({ style: { height } });
                        }}
                      />
                    </View>
                    <TouchableOpacity onPress={() => removeTask(index)}>
                      <CloseIcon width={26} height={26} color="#CFCFCF" />
                    </TouchableOpacity>
                  </View>
                ))}

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

            <View className='min-h-24 min-w-32 p-4 flex-col gap-2'>
              <TouchableOpacity onPress={()=>{setForm((prev) => ({...prev,public_goal: !prev.public_goal}))}} className='p-2 px-4 border border-gray rounded-normal flex-row gap-2 justify-center items-center'>
                <Switch
                  trackColor={{false: '#fff', true: '#0DC47C'}}
                  thumbColor={form.public_goal ? '#FFF' : '#fff'}
                  ios_backgroundColor="#FBFFFF"
                  onValueChange={()=>{setForm((prev) => ({...prev,public_goal: !prev.public_goal}))}}
                  value={form.public_goal}
                />
                <Text className='font-noto text-heading3 text-subText'>public this goal</Text>
              </TouchableOpacity>
            </View>


          </View>
        </ScrollView>
        </>
        ):(
          <View className='flex-1 justify-center items-center'>
            <Text className='font-notoMedium text-title text-primary'>{countdown}</Text>
            <Text className='font-notoMedium text-subTitle animate-pulse text-primary'>Creating</Text>
            <TouchableOpacity onPress={handleCancel} className='mt-12 p-1 px-4 rounded-full bg-nonFocus justify-center items-center'>
              <Text className='text-white font-noto text-heading2'>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});