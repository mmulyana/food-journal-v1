import { formatTimestamp } from '../utils/format-timestamp'

export default function Card({ item }) {
  const { time, typeTime } = formatTimestamp(item.createdAt)
  return (
    <div key={item.id} className='pl-12 relative w-full mb-3 px-2'>
      <div className='absolute left-2 -top-4'>
        <p className='text-sm font-medium text-gray-800 m-0'>{time}</p>
        <p className='text-xs text-gray-400 m-0'>{typeTime}</p>
      </div>
      <div className='w-full h-fit border-t border-gray-300 pt-3'>
        <div className='w-full h-24 overflow-hidden flex gap-2 p-1.5 bg-gray-200 rounded-lg relative'>
          <div className='min-w-32 w-32 h-full rounded-md'>
            <img
              src={item.imageUrl}
              className='w-full h-full object-cover object-left rounded-lg'
            />
          </div>
          <div className='pt-2 overflow-hidden relative'>
            <p className='text-gray-800 font-medium'>{item.name}</p>

            <p className='text-sm text-gray-400'>{item.description}</p>
            <div className='w-full h-10 absolute -bottom-0.5 left-0 bg-gradient-to-t from-gray-200 to-gray-200/0'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
