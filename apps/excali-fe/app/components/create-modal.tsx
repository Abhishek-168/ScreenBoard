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
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
      
        <img
          src="./brightsparks.png"
          alt=""
          className="w-[6vw] absolute -top-10 -left-10 -rotate-25"
        />

       
        <div className="flex flex-col gap-6 w-[30vw] p-8 rounded-xl bg-gray-900">
          <span className="text-center text-3xl font-charlie">
            Create Room
          </span>

          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="p-4 border border-violet-800 focus:border-amber-300 outline-none rounded-xl bg-transparent"
          />

          <button
            onClick={handleRoomCreate}
            disabled={loading}
            className="bg-amber-300 text-xl p-4 rounded-xl text-black font-charlie cursor-pointer disabled:opacity-60"
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
