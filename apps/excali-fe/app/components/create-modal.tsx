'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BE_URL } from '../config';

export default function CreateRoomModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoomCreate = async () => {
    if (!roomName.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const resp = await axios.post(
        `${BE_URL}/create-room`,
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!resp.data.roomId) {
        console.log('Room creation failed');
        return;
      }

      onClose(); 
      router.push(`/canvas/${resp.data.roomId}`);
    } catch (err) {
      console.error('Create room error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 md:p-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
      
        <img
          src="./brightsparks.png"
          alt=""
          className="w-16 absolute -top-8 -left-8 -rotate-12 md:w-[6vw] md:-top-10 md:-left-10 md:-rotate-25"
        />

       
        <div className="flex flex-col gap-4 w-full max-w-sm p-6 rounded-xl bg-gray-900 md:gap-6 md:w-[30vw] md:max-w-none md:p-8">
          <span className="text-center text-2xl font-charlie md:text-3xl">
            Create Room
          </span>

          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="p-3 border border-violet-800 focus:border-amber-300 outline-none rounded-xl bg-transparent md:p-4"
          />

          <button
            onClick={handleRoomCreate}
            disabled={loading}
            className="bg-amber-300 text-lg p-3 rounded-xl text-black font-charlie cursor-pointer disabled:opacity-60 md:text-xl md:p-4"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>

          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
