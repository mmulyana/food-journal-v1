export default function Dashboard() {
  return (
    <>
      <div className='max-w-[400px] mx-auto'>
        <div className='h-fit bg-white mb-7 px-4 pt-4 pb-5 border-b border-gray-200'>
          <p className='text-base font-medium text-orange-600 mb-2.5'>Food Journal</p>
          <div className='w-full flex justify-between'>
            {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(
              (day, idx) => (
                <div
                  key={idx}
                  className={['flex flex-col justify-center items-center px-2.5 rounded py-0.5', idx == 2 ? "bg-orange-50" : ""].join(" ")}
                >
                  <p className={['font-semibold', idx == 2 ? "text-orange-600" : ""].join(" ")}>{idx + 1}</p>
                  <p className={['text-sm capitalize', idx == 2 ? "text-orange-400" : ""].join(" ")}>{day}</p>
                </div>
              )
            )}
          </div>
        </div>
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className='pl-12 relative w-full mb-3 px-2'>
            <div className='absolute left-2 -top-4'>
              <p className='text-sm font-medium text-gray-800 m-0'>10:00</p>
              <p className='text-xs text-gray-400 m-0'>AM</p>
            </div>
            <div className='w-full h-fit border-t border-gray-300 pt-3'>
              <div className='w-full h-24 overflow-hidden flex gap-2 p-1.5 bg-gray-200 rounded-lg relative'>
                <div className='min-w-32 w-32 h-full bg-white rounded-md'></div>
                <div className='pt-2 overflow-hidden relative'>
                  <p className='text-gray-800 font-medium'>Lunch</p>
                  {idx == 1 ? (
                    <ul className='list-disc text-sm text-gray-400'>
                      <li className='flex gap-1.5 items-center'>
                        <div className='mt-1 w-1.5 h-1.5 rounded-full bg-gray-500'></div>
                        nasi
                      </li>
                      <li className='flex gap-1.5 items-center'>
                        <div className='mt-1 w-1.5 h-1.5 rounded-full bg-gray-500'></div>
                        ayam
                      </li>
                      <li className='flex gap-1.5 items-center'>
                        <div className='mt-1 w-1.5 h-1.5 rounded-full bg-gray-500'></div>
                        tempe
                      </li>
                    </ul>
                  ) : (
                    <p className='text-sm text-gray-400'>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Eligendi ratione quos possimus aliquid a. Itaque libero
                      tenetur obcaecati nesciunt reiciendis sunt! Nisi, aut!
                      Tempora aliquid ipsam ea, temporibus voluptas aut.
                    </p>
                  )}
                  <div className='w-full h-10 absolute -bottom-0.5 left-0 bg-gradient-to-t from-gray-200 to-gray-200/0'></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className='py-1 flex justify-center'>
          <button className='bg-orange-600 rounded-full px-4 py-1.5 text-white text-sm'>
            Add
          </button>
        </div>
      </div>
    </>
  )
}
