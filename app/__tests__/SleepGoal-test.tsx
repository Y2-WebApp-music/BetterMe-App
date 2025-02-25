import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SERVER_URL } from '@env';
import SleepGoal, { toggleSleep } from '../../components/sleep/sleepGoal';
import { render, fireEvent, waitFor } from '@testing-library/react-native';


jest.mock('@env', () => ({
  SERVER_URL: 'http://localhost', // Provide a mock URL
}));

// Mock AsyncStorage with correct typing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null) as jest.Mock<Promise<string | null>>, // Mock getItem with resolved value
  setItem: jest.fn().mockResolvedValue(undefined) as jest.Mock<Promise<void>>, // Mock setItem with resolved value
  removeItem: jest.fn().mockResolvedValue(undefined) as jest.Mock<Promise<void>>, // Mock removeItem with resolved value
}));

// Mock axios with correct typing
jest.mock('axios');
axios.post = jest.fn().mockResolvedValue({ status: 200 }) as jest.Mock<Promise<AxiosResponse<any>>>;

describe('SleepGoal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<SleepGoal />);
    expect(getByText('Sleep time')).toBeTruthy();
  });

  it('toggles sleep state correctly', async () => {
    const { getByText, getByTestId } = render(<SleepGoal />);
    const toggleButton = getByTestId('toggle-button');

    // Simulate pressing toggle
    fireEvent.press(toggleButton);
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
    
    // Check if text updates correctly
    expect(getByText(/Sleeping|Waking/)).toBeTruthy();
  });
});

describe('toggleSleep function', () => {
  it('stores sleep data on sleep start', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // No previous sleep data

    await toggleSleep();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(expect.stringContaining('sleepData'), expect.any(String));
  });

  it('calculates sleep duration and resets invalid data', async () => {
    const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago
    AsyncStorage.getItem.mockResolvedValueOnce(pastTime);

    await toggleSleep();

    // Log the calculation to verify
    console.log("Duration calculated for pastTime:", pastTime);
    
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sleepData'); // Less than 2 hours should be removed
  });

  it('sends valid sleep data to the server', async () => {
    const pastTime = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(); // 6 hours ago
    AsyncStorage.getItem.mockResolvedValueOnce(pastTime);
    
    axios.post.mockResolvedValueOnce({ status: 200 });

    await toggleSleep();

    expect(axios.post).toHaveBeenCalledWith(`${SERVER_URL}/sleep/createSleep`, expect.objectContaining({
      total_time: expect.any(Number),
      date: expect.any(String),
      start_time: expect.any(String),
      end_time: expect.any(String),
    }));
  });
});