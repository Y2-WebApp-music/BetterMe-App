import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView, Dimensions, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Switch } from 'react-native';
import BackButton from '../../../../components/Back';
import { DeleteIcon, OptionIcon } from '../../../../constants/icon';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useEffect, useMemo, useState } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from 'axios';

type Task = {
  task_name: string;
  task_status: boolean;
};

type GoalData = {
  goal_id: string;
  goal_name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  task: Task[];
  length_task: number;
  complete_task: number;
};

const { width } = Dimensions.get('window');
const circle_length = width * 0.62;
const r = circle_length / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function GoalScreen() {
  const { id } = useLocalSearchParams();

  const [goalData,setGoalData] = useState<GoalData>({
    goal_id:'1',
    goal_name:'First Line test text inline style Second Line',
    description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis placerat ex. Fusce sapien velit,',
    start_date:new Date(),
    end_date:new Date(new Date().setDate(new Date().getDate() + 10)),
    task : [
      {
        task_name:'Test Task',
        task_status:false
      },
      {
        task_name:'Test Task',
        task_status:false
      },
      {
        task_name:'Test Task',
        task_status:true
      },
      {
        task_name:'Test Task',
        task_status:false
      },
    ],
    length_task:12,
    complete_task:9
  })

  const [isLoad, setIsLoad] = useState(true)
  const [err, setErr] = useState<string | null>('')

  // Fetch Data Here
  const fetchGoalData = async () => {
    try {
      const response = await axios.get('https://localhost:3000/.....');
      const data = response.data;

      const transformedData: GoalData = {
        goal_id: data.goal_id,
        goal_name: data.goal_name,
        description: data.description,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        task: data.task,
        length_task: data.task.length,
        complete_task: data.task.filter((task: Task) => task.task_status).length,
      };

      setGoalData(transformedData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setErr('Unable to fetch data. Please try again later.');
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    fetchGoalData();
  }, []);

  const percent = useMemo(() => Math.round((goalData.complete_task / goalData.length_task) * 100), [
    goalData
  ]);
  const color = percent === 100 ? '#0dc47c' : '#FBA742';

  const progress = useSharedValue(0);

  useEffect(() => {
    console.log('=== useEffect progress.value use ===');
    progress.value = withTiming(percent / 100, { duration: 1000 });
  }, [percent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length * (1 - progress.value),
  }));

  const [isOptionsVisible, setOptionsVisible] = useState(false);

  const toggleOptions = () => {
    setOptionsVisible(!isOptionsVisible);
  };
  const closeOptions = () => {
    setOptionsVisible(false);
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleToggleTask = (index: number): void => {
    setGoalData((prevData) => {
      const updatedTasks = [...prevData.task];
      updatedTasks[index].task_status = !updatedTasks[index].task_status;

      const totalTasks = updatedTasks.length;
      const completedTasks = updatedTasks.filter((task) => task.task_status).length;

      return {
        ...prevData,
        task: updatedTasks,
        length_task: totalTasks,
        complete_task: completedTasks,
      };
    });
  };


  return (
    <SafeAreaView className="w-full h-full justify-center items-center bg-Background font-noto" >
      <TouchableWithoutFeedback onPress={closeOptions}>
        <View>
          <View className='w-[92%] mt-4'>
            <View className='w-full flex-row'>
              <View className='max-w-[14vw]'>
                <BackButton goto={'/home'}/>
              </View>
              <View className='grow relative'>
              <TouchableOpacity className='items-end' onPress={toggleOptions}>
                  <OptionIcon width={22} height={22} color={'#626262'}/>
                </TouchableOpacity>
                {isOptionsVisible && (
                <View className='absolute z-20 right-0 top-6 min-h-24 min-w-32 bg-white rounded-normal border border-gray p-4 flex-col gap-2'>
                  <TouchableOpacity onPress={toggleSwitch} className='p-2 px-4 border border-gray rounded-normal flex-row gap-2 justify-center items-center'>
                    <Switch
                      trackColor={{false: '#fff', true: '#0DC47C'}}
                      thumbColor={isEnabled ? '#FFF' : '#fff'}
                      ios_backgroundColor="#FBFFFF"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                    <Text className='font-noto text-heading3 text-subText'>public this goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className='p-2 px-4 border border-gray rounded-normal flex-row gap-2 justify-center items-center'>
                    <DeleteIcon width={26} height={26} color={'#E8E8E8'} />
                    <Text className='font-noto text-heading3 text-subText'>delete this goal</Text>
                  </TouchableOpacity>
                </View>
              )}
              </View>
            </View>

            <View className='flex gap-1 items-start justify-center mt-2'>
              <View className='flex-row items-center'>
                <View className='grow w-[200px]'>
                  <Text className='text-heading text-primary font-notoMedium'>{goalData.goal_name}</Text>
                </View>
                <View className='justify-center items-center'>
                  <Svg width={circle_length/2.8} height={circle_length/2.8} style={{ transform: [{ rotate: '270deg' }] }} >
                    <Circle
                      cx={circle_length/5.6}
                      cy={circle_length/5.6}
                      r={r}
                      fill="#E8E8E8"
                      stroke={'#E8E8E8'}
                      strokeWidth={6}
                    />
                    <AnimatedCircle
                      cx={circle_length/5.6}
                      cy={circle_length/5.6}
                      r={r}
                      fill="#E8E8E8"
                      stroke={color}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeDasharray={circle_length}
                      animatedProps={animatedProps}
                    />
                    <Circle
                      cx={circle_length/5.6}
                      cy={circle_length/5.6}
                      r={r-5}
                      fill="#FBFFFF"
                      stroke='none'
                    />
                  </Svg>
                  <Text style={{color:color}} className=' absolute text-heading font-notoSemiBold'>{percent}%</Text>
                </View>
              </View>
              <View className='w-full'>
                <Text className='text-subText font-noto text-body'>{goalData.description}</Text>
                <View className='flex-col pl-1'>
                  <Text className='text-subText font-notoLight text-[1rem]'>Create : {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(goalData.start_date)}</Text>
                  <Text className='text-subText font-notoLight text-[1rem]'>End : {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(goalData.end_date)}</Text>
                </View>
              </View>
              <View className='flex-row justify-start items-center mt-1'>
                <Text className='grow text-heading3'>Task List</Text>
                <Text className='text-subText font-noto'>{goalData.complete_task}/{goalData.length_task} completed</Text>
              </View>
              <View className='h-[2px] w-full bg-gray rounded-full'/>
            </View>
          </View>
          <ScrollView
            className='w-[92%] h-auto pb-20 mt-2'
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', marginTop:0}}
            showsVerticalScrollIndicator={false}
          >
              <View className='w-[100%] justify-center items-center pb-20'>
                <View className='w-[95%] mt-2 flex-col gap-4'>
                  {goalData.task.map((data,i)=>(
                    <BouncyCheckbox
                      key={i}
                      size={25}
                      fillColor="#0DC47C"
                      unFillColor="#FFFFFF"
                      textComponent={<TextCheckBox taskName={data.task_name} isChecked={data.task_status} />}
                      textContainerStyle={{ marginLeft:20 }}
                      iconStyle={{ borderColor: "#0DC47C", borderRadius:6 }}
                      innerIconStyle={{ borderWidth: 2, borderRadius:6, borderColor:'#E8E8E8' }}
                      isChecked={data.task_status}
                      onPress={() => handleToggleTask(i)}
                    />
                  ))}
                </View>
              </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const TextCheckBox = ({ taskName, isChecked }: { taskName: string; isChecked: boolean }) => (
  <View className="w-full">
    <Text className={`pl-3 w-[97%] font-noto text-body ${isChecked? 'text-green':'text-text'}`}>{taskName}</Text>
  </View>
);