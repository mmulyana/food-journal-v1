import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 grid place-items-center z-50'>
      <div className='bg-white rounded-lg p-4 w-full max-w-md relative'>
        <button
          onClick={onClose}
          className='text-gray-500 hover:text-gray-700 absolute top-4 right-4'
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
